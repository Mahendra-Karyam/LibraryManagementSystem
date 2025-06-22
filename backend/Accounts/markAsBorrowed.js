const { Book } = require("../Databases/booksDatabase");

const markAsBorrowed = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    const borrowerName = req.body.BorrowerName;
    /*
    ❓ Where is req.body.BorrowerName coming from?
    👉 It comes from the frontend when you send a request like:

    axios.put(`http://localhost:3030/books/borrow/${id}`, {
      BorrowerName: "Mahendra"
    });

    🧠 "Mahendra" is sent in the body of the request.

    🛠️ The backend receives:
    req.body = { BorrowerName: "Mahendra" }

    📥 Then stores it in:
    const borrowerName = req.body.BorrowerName;

    ⚠️ Nothing is automatic — you must send it from the frontend using axios.put() or similar.

    ✅ Conclusion: Always send BorrowerName from the frontend.
    */

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


module.exports = markAsBorrowed;
