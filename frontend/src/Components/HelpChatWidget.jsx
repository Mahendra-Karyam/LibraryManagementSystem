import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios.js";

/*
Chat messages look like:
  { role: "user" | "model", text: string }

FAQ entries look like:
  { category: string, question: string, answer: string }
*/

const WELCOME_MESSAGE = {
  role: "model",
  text: "Hello! Welcome to the Library. How can I help you today?\n\nI can assist with questions about:\n* Searching and browsing books\n* Borrowing and returning books\n* Reading a borrowed book's PDF\n* Managing your account\n\nLet me know what you need help with!",
};

const STARTER_QUESTIONS = [
  "How do I borrow a book?",
  "How do I return a book?",
  "Is there a late fee?",
  "How do I add a book as admin?",
];

// Gemini replies in light Markdown (mainly **bold**, *italic*, and "* "
// bullet lines). Rather than pulling in a full markdown library or using
// dangerouslySetInnerHTML (risky with AI text), this processes the reply
// line by line: a line starting with "* " becomes a real bullet point
// (dot + text, not a literal asterisk); within any line, **bold** becomes
// <strong> and single *italic* becomes <em> (checked in that order, since
// ** must be matched before a lone * is considered). Numbered lines
// ("1. ", "2. ") and plain lines are left as-is, just with bold/italic applied.
function renderInline(line, lineKey) {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={`${lineKey}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      return <em key={`${lineKey}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderFormattedText(text) {
  // Defensive: if the API ever returns something other than a plain string
  // (e.g. a malformed/non-JSON response from a misconfigured deployment),
  // fall back to a safe placeholder instead of crashing this component —
  // and, since it has no error boundary above it, the whole app.
  if (typeof text !== "string") {
    return "Sorry, I received an unexpected response. Please try again.";
  }
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const bulletMatch = line.match(/^\s*\*\s+(.*)$/);
    if (bulletMatch) {
      return (
        <div key={i} className="flex gap-1.5 pl-0.5">
          <span aria-hidden="true">•</span>
          <span>{renderInline(bulletMatch[1], i)}</span>
        </div>
      );
    }
    return <div key={i}>{renderInline(line, i)}</div>;
  });
}

export default function HelpChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [faqs, setFaqs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Pre-load FAQs so we can show a couple of "quick question" chips.
    api
      .get("/assistant/faqs")
      .then((res) => setFaqs(res.data.faqs || []))
      .catch(() => {
        /* silently ignore — chat still works without preloaded FAQs */
      });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (textOverride) => {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || sending) return;

    const userMessage = { role: "user", text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      const history = nextMessages
        .slice(0, -1)
        .filter((m) => m !== WELCOME_MESSAGE);

      // The shared `api` instance's interceptor (src/api/axios.js) already
      // attaches the logged-in user's token, if any, so the backend can look
      // up their own borrowed books for personalized answers. We still send
      // the current route so the assistant knows what page they're on.
      // Neither is required: an anonymous/logged-out visitor still gets help.
      const res = await api.post("/assistant/chat", {
        message: trimmed,
        history,
        currentPage: location.pathname,
      });

      if (!res.data || typeof res.data.reply !== "string") {
        // Happens if the API base URL is misconfigured and the request
        // silently lands somewhere else (e.g. the frontend's own SPA
        // fallback page) instead of the actual backend.
        throw new Error("Assistant response was missing a reply.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: res.data.reply },
      ]);
    } catch (err) {
      console.error("Assistant request failed:", err);
      setError("Something went wrong reaching the help assistant. Please try again.");
      setMessages(messages);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Toggle button — independently fixed to the corner, same size and
          position whether the panel is open or closed, so it never shifts. */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-teal-700 hover:bg-teal-800
          text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path
              d="M4 5h16v11H8l-4 4V5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chat panel — independently fixed, positioned above the button. */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[520px]
            bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-teal-700 text-white shrink-0">
            <p className="font-semibold text-sm">Library Help Assistant</p>
            <p className="text-xs text-teal-100">Ask me anything about the app</p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl whitespace-pre-wrap break-words
                    ${
                      m.role === "user"
                        ? "bg-teal-700 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
                    }`}
                >
                  {renderFormattedText(m.text)}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  Typing…
                </div>
              </div>
            )}

            {/* Quick question chips — only show before the user has asked anything */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(faqs.length
                  ? faqs.slice(0, 4).map((f) => f.question)
                  : STARTER_QUESTIONS
                ).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs border border-gray-300 text-gray-600 rounded-full px-3 py-1 hover:bg-teal-700 hover:text-white hover:border-teal-700 transition cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="px-3 pt-1 text-xs text-red-500 shrink-0">{error}</p>}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 border-t border-gray-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={sending}
              className="flex-1 border border-gray-300 rounded-full px-3.5 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full
                bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                <path d="M3 10h13M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
