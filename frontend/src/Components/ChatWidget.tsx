import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Backend base URL. Uses VITE_API_BASE_URL from a .env.local file when present
// (e.g. "http://localhost:3030" for local development), otherwise falls back
// to the deployed production backend.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://librarymanagementsystem-6aca.onrender.com";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface Faq {
  category: string;
  question: string;
  answer: string;
}

const STARTER_QUESTIONS = [
  "How do I borrow a book?",
  "How do I return a book?",
  "Is there a late fee?",
  "How do I add a book as admin?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hi! 👋 I'm your Library Help Assistant. Ask me anything about borrowing, returning, searching, or managing books on this site.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pre-load FAQs so we can show a couple of "quick question" chips.
    axios
      .get(`${API_BASE_URL}/chatbot/faqs`)
      .then((res) => setFaqs(res.data.faqs || []))
      .catch(() => {
        /* silently ignore — chat still works without preloaded FAQs */
      });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isSending) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      // Send the conversation so far (minus the very first greeting) as history
      const history = newMessages.slice(0, -1).slice(1);

      const res = await axios.post(`${API_BASE_URL}/chatbot/ask`, {
        message: text,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", text: res.data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, something went wrong reaching the help assistant. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-['Times_New_Roman']">
      {isOpen && (
        <div className="mb-3 w-[92vw] max-w-[360px] h-[70vh] max-h-[520px] bg-white border-2 border-teal-800 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-teal-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span className="font-semibold">Library Help Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white hover:text-gray-200 text-xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-teal-700 text-white rounded-br-none"
                      : "bg-white border border-teal-800 text-teal-900 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-white border border-teal-800 text-teal-900 rounded-bl-none">
                  Typing...
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
                    className="text-xs border border-teal-800 text-teal-900 rounded-full px-3 py-1 hover:bg-teal-800 hover:text-white transition cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t-2 border-teal-800 p-2 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={isSending}
              className="flex-1 text-sm border-2 border-teal-800 rounded px-2 py-1 outline-none text-teal-900"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isSending || !input.trim()}
              className="bg-teal-700 disabled:bg-gray-300 text-white text-sm rounded px-3 py-1 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle bubble */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle help chat"
        className="w-14 h-14 rounded-full bg-teal-800 text-white text-2xl shadow-lg flex items-center justify-center hover:bg-teal-700 transition cursor-pointer"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}