import { useNavigate } from "react-router-dom";
import "../output.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardForAdmin() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]); //<any[]> is for removing redmarks in vs code.
  const [searchTerm, setSearchTerm] = useState("");
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3030/AllBooks");
      setBooks(res.data.Books);
    } catch (error) {
      console.error("Error fetching SPI data:", error);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId: string) => {
    try {
      await axios.delete(`http://localhost:3030/books/delete/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };
  return (
    <div className="h-full w-full p-5 sm:p-11 font-['Times_New_Roman']">
      {/* Header */}
      <div className="w-full border-gray-400 border-x-2 border-t-2 rounded-t-lg px-4 py-4 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
        {/* Title & Logout for Mobile */}
        <div className="w-full flex justify-between items-center sm:justify-start">
          <div className="text-2xl sm:text-3xl font-bold text-center">
            Admin Dashboard
          </div>
          <button
            type="button"
            className="bg-red-800 text-white sm:hidden border-black border-2 px-3 py-1 rounded-lg text-sm cursor-pointer"
            onClick={() => {
              navigate("/admin/login");
              localStorage.removeItem("token");
            }}
          >
            Logout
          </button>
        </div>

        {/* Right Section: Search, Add Book, Logout */}
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-3">
          <input
            type="search"
            placeholder="Search by Title, Author, Genre, or Availability"
            className="px-2 py-1 border border-gray-400 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            className="bg-green-700 text-white border-black border-2 px-3 py-1 rounded-lg text-sm whitespace-nowrap cursor-pointer"
            onClick={() => navigate("/admin/dashboard/addbook")}
          >
            + Add Book
          </button>
          <button
            type="button"
            className="bg-red-700 text-white hidden sm:block border-black border-2 px-3 py-1 rounded-lg text-sm cursor-pointer"
            onClick={() => {
              navigate("/admin/login");
              localStorage.removeItem("token");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border-x-2 border-b-2 border-gray-400 rounded-b-lg">
        <table className="min-w-full text-left border-collapse text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">ID</th>
              <th className="px-4 py-2 whitespace-nowrap">Title</th>
              <th className="px-4 py-2 whitespace-nowrap">Author</th>
              <th className="px-4 py-2 whitespace-nowrap">Genre</th>
              <th className="px-4 py-2 whitespace-nowrap">Availability</th>
              <th className="px-4 py-2 whitespace-nowrap">Borrow Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Book 1 */}

            {books
              .filter((book) =>
                `${book.Title} ${book.Author} ${book.Genre} ${book.Availability}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((book, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-400 ${
                    book.Availability === "Borrowed"
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  }`}
                >
                  <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{book.Title}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{book.Author}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{book.Genre}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {book.Availability}
                  </td>
                  {book.Availability == "Available" ? (
                    <>
                      <td className="px-4 py-2 whitespace-nowrap">
                        Not Borrowed
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-2 w-[160px]">
                          <button
                            className="bg-blue-600 text-white text-sm px-2 py-1 rounded-lg cursor-pointer flex-1"
                            onClick={() => {
                              navigate(
                                `/admin/dashboard/updatebook/${book._id}`
                              );
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white text-sm px-2 py-1 rounded-lg flex-1 cursor-pointer"
                            onClick={() => {
                              handleDelete(book._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex flex-col gap-y-1">
                          <span className="whitespace-nowrap block">
                            <span className="text-gray-900">Name:</span>{" "}
                            <span className="text-green-700">
                              {book.BorrowerName || "Unknown"}
                            </span>
                          </span>
                          <span className="whitespace-nowrap block">
                            <span className="text-gray-900">Borrowed On:</span>{" "}
                            <span className="text-green-700">
                              {book.BorrowedDate
                                ? new Date(
                                    book.BorrowedDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </span>
                          <span className="whitespace-nowrap block">
                            <span className="text-red-600">Not Returned</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-2 w-[160px]">
                          <button
                            className="bg-blue-600 text-white text-sm px-2 py-1 rounded-lg cursor-pointer flex-1"
                            onClick={() => {
                              navigate(
                                `/admin/dashboard/updatebook/${book._id}`
                              );
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

            {/* Book 2
            <tr className="border-gray-400 bg-gray-300">
              <td className="px-4 py-2 whitespace-nowrap">2</td>
              <td className="px-4 py-2 whitespace-nowrap">Atomic Habits</td>
              <td className="px-4 py-2 whitespace-nowrap">James Clear</td>
              <td className="px-4 py-2 whitespace-nowrap">Self Help</td>
              <td className="px-4 py-2 whitespace-nowrap">Borrowed</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex flex-col gap-y-1">
                  <span className="whitespace-nowrap block">
                    <span className="text-gray-900">Name:</span>{" "}
                    <span className="text-green-700">Karyam Mahendra</span>
                  </span>
                  <span className="whitespace-nowrap block">
                    <span className="text-gray-900">Borrowed On:</span>{" "}
                    <span className="text-green-700">27-08-2003</span>
                  </span>
                </div>
              </td>

              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex gap-2 w-[160px]">
                  <button
                    className="bg-blue-600 text-white text-sm px-2 py-1 rounded-lg cursor-pointer flex-1"
                    onClick={() => navigate("/admin/dashboard/updatebook")}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
