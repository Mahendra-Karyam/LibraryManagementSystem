// Below is the code for MongoDB connection with some syntax changes,  
// as we are connecting to two separate MongoDB Atlas connections. 1.userDatabase.js 2.bookDatabase.js

const mongoose = require('mongoose');
const { type } = require('os');
require('dotenv').config();

const BOOKS_DB_URI = process.env.BOOKS_DB_URI;

// Create separate connections
const booksDBConnection = mongoose.createConnection(BOOKS_DB_URI);

//✅ 1. Handling Successful Connection (once('open', callback))
booksDBConnection.once('open', () => {
  console.log('✅ Connected to Books Database successfully!');
});

//✅ 2. Handling Connection Errors (on('error', callback))
booksDBConnection.on('error', (err) => {
  console.error('❌ Books Database Connection Error:', err);
});

const bookSchema = new mongoose.Schema({
      Title: {
        type: String,
        required: true,
      },
      Author: {
        type: String,
        required: true,
      },
      Genre: {
        type: String,
        required: true,
      },
      Availability: {
        type: String,
        default: "Available"
      },
      imageURL: {
        type: String
      },
      BorrowerName: 
      { 
        type: String 
      },
      BorrowedDate: { 
        type: Date 
      },
      PDFLink: {
        type: String
      }
});

const Book = booksDBConnection.model("Book", bookSchema);

module.exports = {
    booksDBConnection,
    Book
};
