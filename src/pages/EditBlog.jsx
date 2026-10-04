import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../services/api";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await api.get("/Category");
        setCategories(catResponse.data);

        const blogResponse = await api.get(`/Blog/${id}`);
        setTitle(blogResponse.data.title);
        setContent(blogResponse.data.content);
        setCategoryId(blogResponse.data.categoryId);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/Blog/${id}`, {
        title: title,
        content: content,
        categoryId: Number(categoryId),
      });

      toast.success("Blog updated successfully!");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Update failed. You may not have permission.";
      setError(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-6">
          Edit blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Content
            </label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-700 text-white font-medium rounded-md hover:bg-amber-800 transition"
          >
            Update Blog
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditBlog;