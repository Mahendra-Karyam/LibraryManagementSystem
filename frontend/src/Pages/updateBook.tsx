import { useNavigate } from "react-router-dom";
import "../output.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateBook() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Extract ID from URL
  const [Title, setTitle] = useState("");
  const [Author, setAuthor] = useState("");
  const [Genre, setGenre] = useState("");
  const [Availability, setAvailability] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [PDFLink, setPDFLink] = useState("");

  // 🔽 Fetch book details on load
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3030/book/${id}`);
        const book = res.data.book;
        setTitle(book.Title);
        setAuthor(book.Author);
        setGenre(book.Genre);
        setAvailability(book.Availability);
        setImageURL(book.imageURL);
        setPDFLink(book.PDFLink);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:3030/books/update/${id}`,
        { Title, Author, Genre, Availability, imageURL, PDFLink },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200 || res.status === 201) {
        alert("Book updated successfully!");
        navigate(`/admin/dashboard`);
      } else {
        const responseData = res.data;
        console.log(responseData.message || "Failed to update book");
        alert(responseData.message || "Failed to update book");
      }
    } catch (error: any) {
      console.error("Error updating book:", error);
    }
  };
  const handleBack = () => {
    navigate("/admin/dashboard");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-['Times_New_Roman']">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Book</h2>

        <form className="space-y-4" onSubmit={handleUpdate}>
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
            <label className="block text-sm font-medium">Availability</label>
            <input
              type="text"
              value={Availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">imageURL</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">PDFLink</label>
            <input
              type="text"
              value={PDFLink}
              onChange={(e) => setPDFLink(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md cursor-pointer"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md cursor-pointer"
              type="submit"
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
