const {Book} = require("../Databases/booksDatabase.js");
const deleteBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
            return res.status(404).send({
                success: false,
                message: "Book not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Book deleted successfully",
            book: book
        });
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send({
            success: false,
            message: "Something went wrong while deleting the book"
        });
    }
}   
module.exports = deleteBook;