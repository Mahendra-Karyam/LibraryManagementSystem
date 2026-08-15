const { Book } = require("../Databases/booksDatabase.js");

// POST /api/books/add
const addBook = async (req, res) => {
  try {
    const { Title, Author, Genre, imageURL, PDFLink } = req.body;
    const existingTitle = await Book.findOne({ Title });
    if (existingTitle) {
      return res.status(400).json({
        success: false,
        message: `Book already exists with the Title ${Title}. Please add another book!`,
      });
    }

    const newBook = await Book.create({
      Title,
      Author,
      Genre,
      Availability: "Available", // Default value for Availability
      imageURL,
      PDFLink,
    });

    res.status(201).json({
      success: true,
      message: `Book with the Title ${Title} added successfully!`,
      data: {
        Title: newBook.Title,
        Author: newBook.Author,
        Genre: newBook.Genre,
        Availability: newBook.Availability,
        imageURL: newBook.imageURL,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during adding new Book, please try again later!",
    });
  }
};

// GET /api/books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({
      success: true,
      message: "All Books are:",
      Books: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching books",
    });
  }
};

// GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

// PUT /api/books/borrow/:id
const markAsBorrowed = async (req, res) => {
  try {
    const bookId = req.params.id;
    const borrowerName = req.body.BorrowerName;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        Availability: "Borrowed",
        BorrowerName: borrowerName,
        BorrowedDate: new Date(),
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book marked as Borrowed",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating book" });
  }
};

// PUT /api/books/return/:id
const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { Availability: "Available", BorrowerName: null, BorrowedDate: null },
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

// PUT /api/books/update/:id
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBookData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });

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

// DELETE /api/books/delete/:id
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the book",
    });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  markAsBorrowed,
  returnBook,
  updateBook,
  deleteBook,
};
