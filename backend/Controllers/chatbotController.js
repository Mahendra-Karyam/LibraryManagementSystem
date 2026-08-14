require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const faqData = require("../Data/faqData.js");
const { Book } = require("../Databases/booksDatabase.js");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// "gemini-flash-latest" is an alias Google keeps pointed at their current
// recommended Flash model, so this stays working even as Google renames/
// deprecates specific dated model versions (e.g. 2.0-flash, 2.5-flash).
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

// Safety cap so a very large catalog never blows up the prompt size / cost.
// Well beyond what a typical student/demo library project would have.
const MAX_BOOKS_IN_CONTEXT = 300;

let ai = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Build a compact grounding block out of the FAQ data so the model answers
// based on THIS project's real features instead of generic library knowledge.
const faqContext = faqData
  .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
  .join("\n\n");

// Fetches the current catalog from MongoDB and formats it compactly for the
// model. Deliberately excludes BorrowerName/BorrowedDate/PDFLink — the
// chatbot shouldn't reveal who currently has a book or leak direct file
// links to users who haven't borrowed it themselves.
async function buildCatalogContext() {
  try {
    const totalCount = await Book.countDocuments();
    const books = await Book.find({}, "Title Author Genre Availability")
      .limit(MAX_BOOKS_IN_CONTEXT)
      .lean();

    if (!books.length) {
      return "The catalog is currently empty — no books have been added yet.";
    }

    const rows = books
      .map(
        (b) =>
          `- "${b.Title}" by ${b.Author} | Genre: ${b.Genre} | ${
            b.Availability === "Borrowed" ? "Currently borrowed" : "Available"
          }`
      )
      .join("\n");

    const truncatedNote =
      totalCount > books.length
        ? `\n(Showing ${books.length} of ${totalCount} total books — ask the user to use the search/filter on the Available Books page for the full list.)`
        : "";

    return `Current book catalog (${totalCount} total book${totalCount === 1 ? "" : "s"}):\n${rows}${truncatedNote}`;
  } catch (err) {
    console.error("Failed to load catalog for chatbot context:", err);
    return "The live book catalog could not be loaded right now — don't guess at specific titles or availability.";
  }
}

function buildSystemPrompt(catalogContext) {
  return `You are the in-app Help Assistant for a Library Management System website built with React and Express/MongoDB.

Your job: help users who are stuck while using THIS website, and answer questions about the real book catalog below. Do not invent features that aren't listed (e.g. do NOT mention due dates, late fees, reservations, wishlists, or multiple-copy borrowing, because none of those exist in this system).

Known facts about this system:
- Roles: normal User and Admin (Admin login is separate and restricted).
- User features: sign up, log in/out, search books by title/author, filter by genre, borrow an available book (one copy per book — if someone else has it, it's unavailable until returned), view "Borrowed Books", open a borrowed book's PDF, return a borrowed book.
- Admin features: add a new book (Title, Author, Genre, image URL, PDF link), update a book's details, delete a book, view all books on a dashboard.
- There are NO due dates, NO late fees, NO reservations/waitlists, and NO borrow limits in this system.
- There is no self-service password reset.

Reference FAQ (use this to answer accurately, but phrase things naturally and don't just recite it verbatim every time):
${faqContext}

${catalogContext}

Guidelines:
- Keep answers short, friendly, and specific to this website (2-4 sentences typically).
- You DO have live access to the book catalog above — use it to answer questions like "do you have any fantasy books" or "is [title] available". Only say you don't know if the book genuinely isn't in the list above.
- Never reveal who currently has a book borrowed (no borrower names) — you only know whether a book is "Available" or "Currently borrowed".
- If a user asks about a feature that doesn't exist in this system, politely say it isn't available rather than guessing.
- If you genuinely don't know, say so and suggest they contact the site admin.`;
}

/**
 * POST /chatbot/ask
 * body: { message: string, history?: Array<{role: 'user'|'model', text: string}> }
 */
const askChatbot = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question in the 'message' field.",
      });
    }

    // If no API key is configured, fall back to simple FAQ keyword matching
    // so the widget still works (with reduced smarts) before setup is done.
    if (!ai) {
      const fallback = findBestFaqMatch(message);
      return res.status(200).json({
        success: true,
        source: "faq-fallback",
        reply:
          fallback ||
          "I'm not fully set up yet (missing GEMINI_API_KEY on the server), so I can only answer a few basic questions right now. Please try asking about borrowing, returning, or searching for books.",
      });
    }

    // Convert simple {role, text} history into the SDK's expected format
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((h) => h && h.text && (h.role === "user" || h.role === "model"))
          .map((h) => ({ role: h.role, parts: [{ text: h.text }] }))
      : [];

    const catalogContext = await buildCatalogContext();

    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      history: formattedHistory,
      config: { systemInstruction: buildSystemPrompt(catalogContext) },
    });

    const result = await chat.sendMessage({ message });
    const reply = result.text;

    return res.status(200).json({
      success: true,
      source: "gemini",
      reply,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    // Fall back to FAQ matching if the Gemini call fails (bad key, quota, network, etc.)
    const fallback = findBestFaqMatch(req.body?.message || "");
    return res.status(200).json({
      success: true,
      source: "faq-fallback-error",
      reply:
        fallback ||
        "Sorry, I'm having trouble answering right now. Please try again in a moment, or contact the site admin.",
    });
  }
};

// GET /chatbot/faqs - lets the frontend show suggested/quick questions
const getFaqs = (req, res) => {
  res.status(200).json({
    success: true,
    faqs: faqData,
  });
};

// Very simple keyword-overlap matcher used only as a fallback when Gemini
// is unavailable (no API key, or the API call failed).
function findBestFaqMatch(message) {
  const normalized = message.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const item of faqData) {
    const words = item.question.toLowerCase().split(/\W+/).filter(Boolean);
    let score = 0;
    for (const w of words) {
      if (w.length > 3 && normalized.includes(w)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore > 0 ? best.answer : null;
}

module.exports = { askChatbot, getFaqs };
