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
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
