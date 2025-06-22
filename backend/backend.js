require("dotenv").config();

const PORT = process.env.PORT || 3030;

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// Connect DB functions
const { userDBConnection } = require("./Databases/userDatabase.js");
const { booksDBConnection } = require("./Databases/userDatabase.js");

// Controllers
const { signupUser, loginUser } = require("./Accounts/userAccount.js");
const loginAdmin = require("./Accounts/adminAccount.js");
const addBook = require("./Accounts/addBookAccount.js");
const { Book } = require("./Databases/booksDatabase.js");
const markAsBorrowed = require("./Accounts/markAsBorrowed.js");

const returnBook = require("./Accounts/returnBook.js");

const updatebook = require("./Accounts/updateBook.js");

const deleteBook = require("./Accounts/deleteBook.js");

const authenticateToken = require("./Middlewares/auth.js");

userDBConnection;
booksDBConnection;

    // Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/user/signup", signupUser);
app.post("/user/login", loginUser);
app.post("/admin/login", loginAdmin);
app.post("/admin/dashboard/addbook", addBook);

app.get("/AllBooks", async(req, res) => {
    try{
        const books = await Book.find({});
        res.status(201).send({
            success : true,
            message : "All Books are:",
            Books : books
        })
    }
    catch(error){
        console.error("Error fetching books:", error);
        res.status(500).send({
            success : false,
            message: "Something went wrong while fetching books"
        })
    }
    
});

app.put("/books/borrow/:id", markAsBorrowed);

app.put("/books/return/:id", returnBook);

app.put("/books/update/:id", updatebook);

app.delete("/books/delete/:id", deleteBook);

// GET book by ID
app.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book){
        return res.status(404).json({ message: "Book not found" });
    }
    else{
        res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            book: book
        });
    }
    
  } catch (error) {
        res.status(500).json({ message: "Error fetching book", error });
  }
});

// Middleware to authenticate token
app.get("/user", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected profile data",
    user: req.user // this comes from the token
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
