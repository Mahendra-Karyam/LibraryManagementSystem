<<<<<<< HEAD
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

const chatbotRoute = require("./Routes/chatbotRoute.js");

userDBConnection;
booksDBConnection;

    // Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/chatbot", chatbotRoute);

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


=======
require("dotenv").config(); // MUST be the very first thing that runs — loads .env before
                             // any other module (like Utils/aiClient.js) reads process.env

const express = require("express");
const cors = require("cors");

const { userDBConnection } = require("./Databases/userDatabase.js");
const { booksDBConnection } = require("./Databases/booksDatabase.js");

const userRoutes = require("./Routes/userRoutes.js");
const adminRoutes = require("./Routes/adminRoutes.js");
const bookRoutes = require("./Routes/bookRoutes.js");
const assistantRoutes = require("./Routes/assistantRoutes.js");

// Both connections start opening as soon as their modules are required above;
// referencing them here just keeps that intent explicit (same as before).
userDBConnection;
booksDBConnection;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
     res.json({ status: "ok", message: "Library Management System API is running" });
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/assistant", assistantRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 3030;
>>>>>>> feb40ec (Update code)
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
