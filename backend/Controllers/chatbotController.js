require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const faqData = require("../Data/faqData.js");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Build a compact grounding block out of the FAQ data so the model answers
// based on THIS project's real features instead of generic library knowledge.
const faqContext = faqData
  .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
  .join("\n\n");

const SYSTEM_PROMPT = `You are the in-app Help Assistant for a Library Management System website built with React and Express/MongoDB.

Your job: help users who are stuck while using THIS website. Answer only based on the facts below — do not invent features that aren't listed (e.g. do NOT mention due dates, late fees, reservations, wishlists, or multiple-copy borrowing, because none of those exist in this system).

Known facts about this system:
- Roles: normal User and Admin (Admin login is separate and restricted).
- User features: sign up, log in/out, search books by title/author, filter by genre, borrow an available book (one copy per book — if someone else has it, it's unavailable until returned), view "Borrowed Books", open a borrowed book's PDF, return a borrowed book.
- Admin features: add a new book (Title, Author, Genre, image URL, PDF link), update a book's details, delete a book, view all books on a dashboard.
- There are NO due dates, NO late fees, NO reservations/waitlists, and NO borrow limits in this system.
- There is no self-service password reset.

Reference FAQ (use this to answer accurately, but phrase things naturally and don't just recite it verbatim every time):
${faqContext}

Guidelines:
- Keep answers short, friendly, and specific to this website (2-4 sentences typically).
- If a user asks about a feature that doesn't exist in this system, politely say it isn't available rather than guessing.
- If you genuinely don't know, say so and suggest they contact the site admin.
- Never invent book titles, authors, or data you don't have — you don't have live access to the book catalog.`;

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
    if (!genAI) {
      const fallback = findBestFaqMatch(message);
      return res.status(200).json({
        success: true,
        source: "faq-fallback",
        reply:
          fallback ||
          "I'm not fully set up yet (missing GEMINI_API_KEY on the server), so I can only answer a few basic questions right now. Please try asking about borrowing, returning, or searching for books.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert simple {role, text} history into Gemini's expected format
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((h) => h && h.text && (h.role === "user" || h.role === "model"))
          .map((h) => ({ role: h.role, parts: [{ text: h.text }] }))
      : [];

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

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
