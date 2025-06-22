const { Book } = require("../Databases/booksDatabase");

const updatebook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedbBookData = req.body;
    console.log("👉 Received update for ID:", bookId);
    console.log("👉 Data to update:", updatedbBookData);
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updatedbBookData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating book" });
  }
};

module.exports = updatebook;
