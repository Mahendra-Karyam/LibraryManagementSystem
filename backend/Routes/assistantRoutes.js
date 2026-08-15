const express = require("express");
const router = express.Router();
const { chatWithAssistant, getFaqs } = require("../Controllers/assistantController.js");

// Intentionally public (no auth middleware) — the help widget should work
// even for visitors who haven't logged in yet (e.g. on the Welcome page).
router.post("/chat", chatWithAssistant);
router.get("/faqs", getFaqs);

module.exports = router;
