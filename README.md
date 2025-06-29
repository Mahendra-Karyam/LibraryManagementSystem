# 📚 Library Management System

A full-stack Library Management System built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**. It features **role-based access control**, **JWT authentication**, and responsive design for seamless use across devices.

🔗 **Live Demo**: https://librarymanagementsystem-1-v9k3.onrender.com

---

## 🚀 Features

### 🔐 Authentication & Access
- JWT-based authentication
- Role-based login for **Users** and **Admins**
- Protected routes to prevent unauthorized access

### 📖 User Functionality
- Register/Login as a user
- View available books
- Search and filter books
- Borrow and return books
- View personal borrowed book history

### 🛠️ Admin Functionality
- Login with admin credentials (no signup)
- View all books with borrower info
- Add, edit, or delete available books
- Cannot delete books currently borrowed

---

## 🧰 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB (with Mongoose)

**Deployment:**
- Render (Frontend & Backend)

---

## 📱 Responsive Design

Built with a responsive UI that works across:
- Mobile 📱
- Tablet 💻
- Desktop 🖥️

---

## 🔐 Security

- JWT tokens stored in localStorage
- Middleware for protected routing
- Unauthorized direct URL access is redirected to login page

---

## 📈 Performance

- Optimized user experience with Tailwind CSS
- 99.8% uptime on Render
- Scalable design and routing
