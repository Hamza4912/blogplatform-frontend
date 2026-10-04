import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/Category");
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Blog", {
        params: { Search: searchText, PageSize: 100 },
      });
      setBlogs(response.data.items);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const blogId = deleteTargetId;
    setDeleteTargetId(null);

    const role = localStorage.getItem("role");
    const endpoint = role === "Admin" ? `/Admin/blogs/${blogId}` : `/Blog/${blogId}`;

    try {
      await api.delete(endpoint);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. You may not have permission.");
    }
  };

  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  const displayedBlogs = selectedCategory
    ? blogs.filter((b) => b.categoryId === Number(selectedCategory))
    : blogs;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-6">
        All Blogs
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-stone-500 dark:text-stone-400">Loading blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && displayedBlogs.length === 0 && (
        <p className="text-stone-500 dark:text-stone-400">No blogs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col"
          >
            <span className="inline-block w-fit text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-stone-700 px-2 py-0.5 rounded-full mb-3">
              {blog.categoryName}
            </span>

            <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-2">
              <Link to={`/blog/${blog.id}`} className="hover:text-amber-700 dark:hover:text-amber-400 transition">
                {blog.title}
              </Link>
            </h3>

            <div
              className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-4 flex-1"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
            />

            <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
  By {blog.authorName} ·{" "}
  {new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}
</p>

            <div className="flex items-center gap-3 pt-3 border-t border-amber-100 dark:border-stone-700">
              {currentUserId === blog.userId && (
                <Link
                  to={`/edit-blog/${blog.id}`}
                  className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                >
                  Edit
                </Link>
              )}
              {(currentUserId === blog.userId || role === "Admin") && (
                <button
                  onClick={() => setDeleteTargetId(blog.id)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        show={deleteTargetId !== null}
        message="Are you sure you want to delete this blog?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

export default BlogList;