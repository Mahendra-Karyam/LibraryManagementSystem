import { useNavigate } from "react-router-dom";
import "../output.css";
import { useState } from "react";
import axios from "axios";

export default function AddBook() {
  const [Title, setTitle] = useState("");
  const [Author, setAuthor] = useState("");
  const [Genre, setGenre] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [PDFLink, setPDFLink] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleAddBook = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://librarymanagementsystem-6aca.onrender.com/admin/dashboard/addbook",
        { Title, Author, Genre, imageURL, PDFLink },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200 || res.status === 201) {
        navigate("/admin/dashboard");
        alert("Book added successfully!");
        setTitle("");
        setAuthor("");
        setGenre("");
        setImageURL("");
        setPDFLink("");
      } else {
        const responseData = res.data;
        setMessage(responseData.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        // ❌ Server sent back an error message
        setMessage(error.response.data.message);
      } else {
        // ❌ Unexpected error (no server message)
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 font-['Times_New_Roman']">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Add New Book</h2>

        <form onSubmit={handleAddBook}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Author</label>
              <input
                type="text"
                value={Author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Genre</label>
              <input
                type="text"
                value={Genre}
                onChange={(e) => setGenre(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="Enter image URL (optional)"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">PDF Link</label>
              <input
                type="text"
                value={PDFLink}
                onChange={(e) => setPDFLink(e.target.value)}
                placeholder="Enter PDF Link"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  navigate("/admin/dashboard");
                }}
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md cursor-pointer"
              >
                Add Book
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-10 text-red-500 bg-white px-2 rounded-sm text-center">
        {message && <h1>{message}</h1>}
      </div>
    </div>
  );
}
