import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../output.css";

/*
An interface in TypeScript is used to define the shape of an object — like a blueprint.
I am expecting every Book object to have these properties, and they should be of these types.
Without interface:
  You would write something like this: const [books, setBooks] = useState<any[]>([]);
  But any is unsafe — it disables TypeScript's checks.
So, interface = Safe + Clear + Developer Friendly ✅
*/
interface Book {
  _id: string;
  Title: string;
  Author: string;
  Genre: string;
  imageURL: string;
  PDFLink: string;
  Availability: string;
  BorrowerName?: string;
  BorrowedDate?: string;
}

export default function AvailableBooksForUser() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [userName, setUserName] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);

  /*
    I used useRef<HTMLDivElement>, so borrowedBooksRef must be attached to a <div> using ref.
    What is ref?
      - We use ref when we want to interact directly with a DOM element (e.g., scroll to a section).
    Why here?
      - We use ref to link borrowedBooksRef to a real HTML element (<div>),
        so we can scroll to it using scrollIntoView().
      - Without ref, React won’t know which element to scroll to.
  */
  const borrowedBooksRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const showAlert = (message: string) => {
    alert(message);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:3030/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.user.userName || "User");
    } catch (error) {
      console.error("Error fetching user data:", error);
      showAlert("Failed to load user info");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3030/AllBooks");
      setBooks(res.data.Books);
    } catch (error) {
      console.error("Error fetching books:", error);
      showAlert("Failed to load books");
    } finally {
      setLoadingBooks(false);
    }
  };

  // On first render, fetch both user and book data
  useEffect(() => {
    fetchUser();
    fetchBooks();
  }, []);

  const handleBorrow = async (id: string, bookTitle: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3030/books/borrow/${id}`,
        { BorrowerName: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showAlert(`‘${bookTitle}’ borrowed successfully. Happy reading!`);
      await fetchBooks();

      // 🔽 Smoothly scrolls to the "Borrowed Books" section after borrowing a book.
      setTimeout(() => {
        /*
          borrowedBooksRef.current?.scrollIntoView({
            behavior: "smooth", // Scrolls smoothly instead of jumping.
            block: "start",     // Aligns the section at the top of the screen.
          });

          - borrowedBooksRef.current → Refers to the <div> with ref={borrowedBooksRef}.
          - ?. → Safely checks if the element exists before scrolling.
          - scrollIntoView → Scrolls the page to bring the element into view.
        */
        borrowedBooksRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Delayed slightly to ensure the DOM has updated.
    } catch (error) {
      console.error("Error borrowing book:", error);
      showAlert("Failed to borrow book. Please try again.");
    }
  };

  const handleReturn = async (id: string, bookTitle: string) => {
    try {
      await axios.put(`http://localhost:3030/books/return/${id}`);
      showAlert(`'${bookTitle}' returned successfully. Thank you!`);
      await fetchBooks();
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Error returning book:", error);
      showAlert("Failed to return book. Please try again.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      `${book.Title} ${book.Author}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      book.Genre.toLowerCase().includes(genreFilter.toLowerCase())
  );

  return (
    <>
      <div
        ref={topRef}
        className="min-h-screen w-full bg-cover bg-center bg-fixed font-['Times_New_Roman']"
      >
        <div>
          <div className="mb-2 h-full min-h-[65px] w-full bg-teal-900 rounded-t-lg text-white flex flex-col sm:flex-row items-center justify-between px-3 py-2 gap-2">
            {/* Left Side: Welcome message */}
            <div className="text-2xl text-center break-words sm:text-left w-full sm:w-auto leading-snug">
              {loadingUser ? "Loading..." : `Welcome, ${userName}!`}
            </div>

            {/* Right Side: Search, Genre Filter, Logout */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-end w-full sm:w-auto">
              <input
                type="search"
                placeholder="Search by Author or Title"
                className="text-[15px] border-2 border-white outline-none p-2 rounded h-8 w-[220px] bg-white text-teal-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className=" rounded h-7 w-[120px] outline-none bg-white text-teal-900 cursor-pointer text-[15px]"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="" className="bg-white text-teal-900">
                  All Genres
                </option>
                <option value="Adventure" className="bg-white text-teal-900">
                  Adventure
                </option>
                <option value="Fiction" className="bg-white text-teal-900">
                  Fiction
                </option>
                <option value="Literature" className="bg-white text-teal-900">
                  Literature
                </option>
                <option value="Drama" className="bg-white text-teal-900">
                  Drama
                </option>
                <option value="Dystopian" className="bg-white text-teal-900">
                  Dystopian
                </option>
                <option value="Poem" className="bg-white text-teal-900">
                  Poem
                </option>
                <option value="Fantasy" className="bg-white text-teal-900">
                  Fantasy
                </option>
                <option value="Scripture" className="bg-white text-teal-900">
                  Scripture
                </option>
                <option value="Realism" className="bg-white text-teal-900">
                  Realism
                </option>
                <option value="Mythology" className="bg-white text-teal-900">
                  Mythology
                </option>
                <option value="Novel" className="bg-white text-teal-900">
                  Novel
                </option>
                <option value="Philosophy" className="bg-white text-teal-900">
                  Philosophy
                </option>
                <option value="Poetry" className="bg-white text-teal-900">
                  Poetry
                </option>
                <option value="Satire" className="bg-white text-teal-900">
                  Satire
                </option>
                <option value="Science" className="bg-white text-teal-900">
                  Science
                </option>
                <option value="Tragedy" className="bg-white text-teal-900">
                  Tragedy
                </option>
              </select>
              <button
                type="button"
                className="text-[15px] border-1 border-white text-white h-8 flex items-center px-3 py-1 rounded cursor-pointer"
                onClick={() => {
                  navigate("/user/login");
                  localStorage.removeItem("token");
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="text-teal-900 h-fit p-4 bg-white">
            {loadingBooks ? (
              <p className="text-lg text-center">Loading books...</p>
            ) : (
              <>
                {/* 📚 Available Books Section */}
                <div>
                  <div className="mb-4 mt-8 h-20 border-t-2 border-teal-800 rounded-lg sm:h-14 w-full flex sm:flex-row flex-col sm:justify-between justify-around items-center px-2">
                    <div className="text-2xl font-semibold text-teal-900 text-center sm:text-left">
                      📚 Available Books
                    </div>
                  </div>

                  <div className="mb-2 w-full flex flex-wrap justify-around gap-4 p-5">
                    {filteredBooks.length === 0 ? (
                      <p className="text-lg text-center">
                        No books match your search.
                      </p>
                    ) : (
                      filteredBooks.map((book, index) => (
                        <div
                          key={index}
                          className="transition duration-300 transform hover:scale-105 text-xl w-64 h-[390px] border-2 border-teal-800 rounded-lg px-2 py-3 flex flex-col items-center justify-between"
                        >
                          <div className="w-full h-52 flex justify-center items-center">
                            <img
                              src={book.imageURL}
                              alt="Book"
                              className="rounded-lg w-full h-full object-scale-down"
                            />
                          </div>
                          <div className="text-[13px] w-full px-1 mt-2">
                            <div className="flex items-start">
                              <span className="w-14">Title</span>
                              <span className="pr-1">:</span>
                              <span className="flex-1 break-words">
                                {book.Title}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="w-14">Author</span>
                              <span className="pr-1">:</span>
                              <span className="flex-1 break-words">
                                {book.Author}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="w-14">Genre</span>
                              <span className="pr-1">:</span>
                              <span className="flex-1 break-words">
                                {book.Genre}
                              </span>
                            </div>
                          </div>
                          {book.Availability === "Borrowed" ? (
                            book.BorrowerName === userName ? (
                              <button
                                className="border-2 w-full rounded-md text-sm py-1 mt-2 bg-gray-300 text-gray-600 cursor-pointer"
                                onClick={() =>
                                  showAlert(
                                    `'${book.Title}' is already borrowed. Check the Borrowed Books section.`
                                  )
                                }
                              >
                                🔒 Borrowed by you
                              </button>
                            ) : (
                              <button
                                disabled
                                className="border-2 w-full rounded-md text-sm py-1 mt-2 bg-gray-300 text-gray-600 cursor-not-allowed"
                              >
                                🚫 Borrowed by Others
                              </button>
                            )
                          ) : (
                            <button
                              className="border-2 w-full rounded-md text-sm py-1 mt-2 bg-teal-700 text-white cursor-pointer"
                              onClick={() => handleBorrow(book._id, book.Title)}
                            >
                              📚 Borrow
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 📚 Borrowed Books Section */}
                {(() => {
                  const userBorrowedBooks = filteredBooks.filter(
                    (book) =>
                      book.Availability === "Borrowed" &&
                      book.BorrowerName === userName
                  );

                  return (
                    <>
                      {userBorrowedBooks.length >= 1 && (
                        <>
                          <div
                            ref={borrowedBooksRef} // When the "Borrow" button is clicked, the page automatically scrolls down to this section.
                            className="mb-4 mt-12 h-20 border-t-2 border-teal-800 rounded-lg sm:h-14 w-full flex sm:flex-row flex-col sm:justify-between justify-around items-center px-2"
                          >
                            <div className="text-2xl font-semibold text-teal-900 text-center sm:text-left">
                              📚 Borrowed Books
                            </div>
                          </div>

                          <div className="mb-2 w-full flex flex-wrap justify-around gap-4 p-5">
                            {userBorrowedBooks.map((book, index) => (
                              <div
                                key={index}
                                className="transition duration-300 transform hover:scale-105 text-xl w-64 h-[390px] border-2 border-teal-800 rounded-lg px-2 py-3 flex flex-col items-center justify-between"
                              >
                                <div className="w-full h-52 flex justify-center items-center">
                                  <img
                                    src={book.imageURL}
                                    alt="Borrowed Book"
                                    className="rounded-lg w-full h-full object-scale-down"
                                  />
                                </div>
                                <div className="text-[13px] w-full px-1 mt-2 space-y-[2px]">
                                  <div className="flex items-start">
                                    <span className="w-20">Title</span>
                                    <span className="pr-1">:</span>
                                    <span className="flex-1 break-words">
                                      {book.Title}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="w-20">Author</span>
                                    <span className="pr-1">:</span>
                                    <span className="flex-1 break-words">
                                      {book.Author}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="w-20">Genre</span>
                                    <span className="pr-1">:</span>
                                    <span className="flex-1 break-words">
                                      {book.Genre}
                                    </span>
                                  </div>
                                  {book.BorrowedDate && (
                                    <div className="flex items-start">
                                      <span className="w-20">Borrowed On</span>
                                      <span className="pr-1">:</span>
                                      <span className="flex-1 break-words text-blue-600">
                                        {new Date(
                                          book.BorrowedDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="w-full flex justify-between gap-2 mt-2">
                                  <a
                                    href={book.PDFLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-1/2"
                                  >
                                    <button className="w-full bg-teal-700 rounded-md text-sm py-1 text-white cursor-pointer">
                                      Open
                                    </button>
                                  </a>
                                  <button
                                    className="w-1/2 border-2 rounded-md text-sm py-1 bg-red-700 text-white cursor-pointer"
                                    onClick={() =>
                                      handleReturn(book._id, book.Title)
                                    }
                                  >
                                    Return
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
