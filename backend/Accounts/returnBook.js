const { Book } = require("../Databases/booksDatabase");
const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { Availability: "Available" },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book is returned successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating book" });
  }
};

module.exports = returnBook;