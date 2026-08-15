const express = require("express");
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  markAsBorrowed,
  returnBook,
  updateBook,
  deleteBook,
} = require("../Controllers/bookController.js");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/add", addBook);
router.put("/borrow/:id", markAsBorrowed);
router.put("/return/:id", returnBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
