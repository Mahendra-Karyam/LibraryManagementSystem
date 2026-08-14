// Frequently Asked Questions for the Library Management System.
// This data is grounded in the ACTUAL features of the app (see backend.js routes
// and the frontend pages) — not generic placeholder FAQs.
//
// It is used two ways:
//   1. Sent to the Gemini model as grounding context so answers stay accurate
//      to this specific project instead of a generic "library system".
//   2. Shown directly in the chat widget as quick "suggested questions" the
//      user can tap instead of typing.

const faqData = [
  {
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Go to the Sign Up page, enter your name, email, and a password. Your password is stored securely (hashed), never in plain text. Once signed up, log in from the User Login page.",
  },
  {
    category: "Account",
    question: "I signed up but can't log in. What's wrong?",
    answer:
      "Double check your email and password. If you see 'User not signed up', that email hasn't registered yet — use Sign Up first. If you see 'Invalid Password', the password doesn't match our records.",
  },
  {
    category: "Account",
    question: "How do I log out?",
    answer:
      "Click the Logout button in the top right of the Available Books page. This clears your session token and returns you to the login page.",
  },
  {
    category: "Account",
    question: "Is there a way to reset my password?",
    answer:
      "There's currently no self-service password reset in this system. You'd need to sign up again with a different email, or ask the site admin to help.",
  },
  {
    category: "Browsing",
    question: "How do I search for a book?",
    answer:
      "Use the search box at the top of the Available Books page — it searches by both Title and Author as you type.",
  },
  {
    category: "Browsing",
    question: "Can I filter books by genre?",
    answer:
      "Yes. Use the Genre dropdown next to the search box. Available genres include Adventure, Fiction, Literature, Drama, Dystopian, Poem, Fantasy, Scripture, Realism, Mythology, Novel, Philosophy, Poetry, Satire, Science, and Tragedy.",
  },
  {
    category: "Borrowing",
    question: "How do I borrow a book?",
    answer:
      "Click the 'Borrow' button on any available book's card. It's instantly marked as borrowed under your name and moves into your 'Borrowed Books' section below.",
  },
  {
    category: "Borrowing",
    question: "Why can't I borrow a certain book?",
    answer:
      "Each book has only one copy in this system. If it's already borrowed by someone else, the button will show 'Borrowed by Others' and be disabled until that person returns it.",
  },
  {
    category: "Borrowing",
    question: "Is there a due date or late fee?",
    answer:
      "No — this system doesn't track due dates or charge late fees. Books stay borrowed until you manually return them.",
  },
  {
    category: "Borrowing",
    question: "How many books can I borrow at once?",
    answer:
      "There's no set limit in this system — you can borrow as many different available books as you like, one copy each.",
  },
  {
    category: "Borrowing",
    question: "How do I return a book?",
    answer:
      "Scroll to your 'Borrowed Books' section and click the 'Return' button on the book you're done with. It immediately becomes available for others again.",
  },
  {
    category: "Borrowing",
    question: "How do I read a book I've borrowed?",
    answer:
      "In your Borrowed Books section, click the 'Open' button on the book — it opens the book's PDF link in a new tab.",
  },
  {
    category: "Borrowing",
    question: "Can I reserve a book that's currently borrowed?",
    answer:
      "Not currently — there's no reservation or waitlist feature. You'll need to check back later to see if it's been returned.",
  },
  {
    category: "Admin",
    question: "How do I log in as an admin?",
    answer:
      "Admins log in from the Admin Login page using admin credentials. Regular user accounts don't have admin access.",
  },
  {
    category: "Admin",
    question: "How do I add a new book to the library?",
    answer:
      "From the Admin Dashboard, go to 'Add Book' and fill in the Title, Author, Genre, image URL, and PDF link. New books are automatically marked 'Available'.",
  },
  {
    category: "Admin",
    question: "How do I edit or remove a book?",
    answer:
      "From the Admin Dashboard, select a book to Update its details, or Delete it entirely. Both actions are instant and can't be undone.",
  },
  {
    category: "General",
    question: "What can this library system do?",
    answer:
      "You can sign up, log in, browse and search/filter the book catalog, borrow and return books, and open a book's PDF to read it. Admins can additionally add, update, and delete books from the catalog.",
  },
];

module.exports = faqData;
