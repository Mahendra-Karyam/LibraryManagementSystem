const { GoogleGenAI } = require("@google/genai");

// New unified Google Gen AI SDK — correctly supports both legacy "AIza" Standard
// keys and the newer "AQ." Auth keys that Google now issues by default.
// (Mirrors the client setup used in the Resume Matcher project's aiClient.js.)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Same model used by the Resume Matcher project's aiClient.js, kept
// overridable via GEMINI_MODEL so either project can bump versions without
// a code change.
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// If no API key is configured, `ai` stays null and callers should fall back
// to non-AI behavior (see assistantController.js's FAQ keyword fallback).
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/**
 * Strips markdown code fences just in case (safety net — responseMimeType usually
 * makes this unnecessary, but keeps behavior consistent if Gemini adds stray text).
 */
const cleanJson = (text) => {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
};

/**
 * Powers the in-app help chat widget. Takes the new user message, the prior
 * conversation history (for context across turns), and a system instruction
 * (built by the caller from live app context — catalog, current user, current
 * page) and replies in plain text.
 *
 * @param {Array<{role: "user"|"model", parts: [{text: string}]}>} history - prior turns, oldest first, already in Gemini's chat format
 * @param {string} userMessage - the new question from the user
 * @param {string} systemInstruction - grounding/system prompt for this turn
 * @returns {Promise<string>} the assistant's plain-text reply
 */
const answerHelpQuestion = async (history, userMessage, systemInstruction) => {
  if (!ai) {
    throw new Error("Gemini client is not configured (missing GEMINI_API_KEY)");
  }

  const chat = ai.chats.create({
    model: MODEL_NAME,
    history,
    config: { systemInstruction },
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text.trim();
};

module.exports = { ai, MODEL_NAME, cleanJson, answerHelpQuestion };
