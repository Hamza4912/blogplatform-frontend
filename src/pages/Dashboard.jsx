import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchMyDashboard();
  }, []);

  const fetchMyDashboard = async () => {
    try {
      const username = localStorage.getItem("username");

      const blogsResponse = await api.get("/Blog", {
        params: { AuthorName: username, PageSize: 100 },
      });

      const blogs = blogsResponse.data.items;

      const blogsWithStats = await Promise.all(
        blogs.map(async (blog) => {
          const [likesRes, commentsRes] = await Promise.all([
            api.get(`/Blog/${blog.id}/likes`),
            api.get(`/blog/${blog.id}/comments`),
          ]);

          return {
            ...blog,
            likesCount: likesRes.data.likes,
            commentsCount: commentsRes.data.length,
          };
        })
      );

      setMyBlogs(blogsWithStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const blogId = deleteTargetId;
    setDeleteTargetId(null);

    try {
      await api.delete(`/Blog/${blogId}`);
      setMyBlogs(myBlogs.filter((b) => b.id !== blogId));
      toast.success("Blog deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-stone-500 dark:text-stone-400">Loading dashboard...</p>
      </div>
    );
  }

  const totalBlogs = myBlogs.length;
  const totalLikes = myBlogs.reduce((sum, b) => sum + b.likesCount, 0);
  const totalComments = myBlogs.reduce((sum, b) => sum + b.commentsCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-8">
        My Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{totalBlogs}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">My Blogs</p>
        </div>
        <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{totalLikes}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Likes Received</p>
        </div>
        <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{totalComments}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Comments Received</p>
        </div>
      </div>

      <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-4">
        My Posts
      </h3>

      {myBlogs.length === 0 && (
        <p className="text-stone-500 dark:text-stone-400">You haven't posted any blogs yet.</p>
      )}

      <div className="space-y-4">
        {myBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-1">
                  <Link to={`/blog/${blog.id}`} className="hover:text-amber-700 dark:hover:text-amber-400 transition">
                    {blog.title}
                  </Link>
                </h4>
                <div
                  className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                />
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  {blog.likesCount} likes · {blog.commentsCount} comments · {blog.categoryName}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-3 pt-3 border-t border-amber-100 dark:border-stone-700">
              <Link
                to={`/edit-blog/${blog.id}`}
                className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteTargetId(blog.id)}
                className="text-xs font-medium text-red-500 hover:underline"
              >
                Delete
              </button>
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

export default Dashboard;