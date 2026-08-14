const express = require("express");
const router = express.Router();
const { askChatbot, getFaqs } = require("../Controllers/chatbotController.js");

router.post("/ask", askChatbot);
router.get("/faqs", getFaqs);

module.exports = router;
