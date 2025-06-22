// Below is the code for MongoDB connection with some syntax changes,  
// as we are connecting to two separate MongoDB Atlas connections. 1.userDatabase.js 2.bookDatabase.js

const mongoose = require('mongoose');
require('dotenv').config();

const USER_DB_URI = process.env.USER_DB_URI;

// Create separate connections
const userDBConnection = mongoose.createConnection(USER_DB_URI);

//✅ 1. Handling Successful Connection (once('open', callback))
userDBConnection.once('open', () => {
  console.log('✅ Connected to User Database successfully!');
});

//✅ 2. Handling Connection Errors (on('error', callback))
userDBConnection.on('error', (err) => {
  console.error('❌ User Database Connection Error:', err);
});

const userSchema = new mongoose.Schema({
      userName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
});

const User = userDBConnection.model("User", userSchema);

// Export connections if needed
module.exports = { 
    userDBConnection,
    User
};
