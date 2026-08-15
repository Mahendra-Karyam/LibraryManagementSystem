const { GoogleGenAI } = require("@google/genai");

// New unified Google Gen AI SDK — correctly supports both legacy "AIza" Standard
// keys and the newer "AQ." Auth keys that Google now issues by default.
// (Mirrors the client setup used in the Resume Matcher project's aiClient.js.)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Same model used by the Resume Matcher project's aiClient.js, kept
// overridable via GEMINI_MODEL so either project can bump versions without
// a code change.
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Free-tier Gemini keys have a small daily request quota PER MODEL (see the
// 429 RESOURCE_EXHAUSTED errors this app hit in practice). Different models
// draw from separate quota buckets, so if the primary model's quota is used
// up, a different model can still work for the rest of the day. Overridable
// via GEMINI_FALLBACK_MODEL — set this to any Gemini model your API key has
// access to, ideally one you're not already using elsewhere, so its quota
// is untouched when the primary model runs out.
const FALLBACK_MODEL_NAME = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";

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
 * Sends one chat turn to a specific Gemini model. Pulled out of
 * answerHelpQuestion so it can be called once for the primary model and,
 * if that fails, once more for the fallback model.
 */
const sendToModel = async (modelName, history, userMessage, systemInstruction) => {
  const chat = ai.chats.create({
    model: modelName,
    history,
    config: { systemInstruction },
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text.trim();
};

/**
 * Powers the in-app help chat widget. Takes the new user message, the prior
 * conversation history (for context across turns), and a system instruction
 * (built by the caller from live app context — catalog, current user, current
 * page) and replies in plain text.
 *
 * Tries MODEL_NAME first. If that call fails for any reason (most notably a
 * 429 RESOURCE_EXHAUSTED once the free tier's daily quota for that model is
 * used up), it automatically retries once with FALLBACK_MODEL_NAME before
 * giving up — the two models draw from separate quota buckets, so this
 * keeps the assistant working for the rest of the day instead of failing
 * every request until the primary model's quota resets.
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

  try {
    return await sendToModel(MODEL_NAME, history, userMessage, systemInstruction);
  } catch (primaryError) {
    console.error(
      `Primary model "${MODEL_NAME}" failed (${primaryError.status || "no status"}), trying fallback model "${FALLBACK_MODEL_NAME}"...`
    );
    // Let the fallback attempt's own error (if it also fails) propagate up
    // to the controller's catch block, which shows the user-facing apology.
    return await sendToModel(FALLBACK_MODEL_NAME, history, userMessage, systemInstruction);
  }
};

module.exports = { ai, MODEL_NAME, FALLBACK_MODEL_NAME, cleanJson, answerHelpQuestion };
