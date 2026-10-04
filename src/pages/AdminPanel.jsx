import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [deactivateTargetId, setDeactivateTargetId] = useState(null);
  const [deleteBlogTargetId, setDeleteBlogTargetId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/Admin/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users.");
      }
    };

    const fetchStats = async () => {
      try {
        const response = await api.get("/Admin/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await api.get("/Blog", { params: { PageSize: 100 } });
        setBlogs(response.data.items);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchStats();
    fetchBlogs();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/Admin/users/${userId}/role`, {
        role: newRole,
      });

      setUsers(users.map((u) => (u.id === userId ? response.data : u)));
      toast.success("Role updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role.");
    }
  };

  const confirmDeactivate = async () => {
    const userId = deactivateTargetId;

    setDeactivateTargetId(null);

    try {
      const response = await api.put(`/Admin/users/${userId}/deactivate`);
      setUsers(users.map((u) => (u.id === userId ? response.data : u)));
      toast.success("User deactivated.");
    } catch (err) {
      console.error(err);
      toast.error("Deactivation failed. User may already be inactive.");
    }
  };

  const handleActivate = async (userId) => {
    try {
      const response = await api.put(`/Admin/users/${userId}/activate`);
      setUsers(users.map((u) => (u.id === userId ? response.data : u)));
      toast.success("User activated.");
    } catch (err) {
      console.error(err);
      toast.error("Activation failed.");
    }
  };

  const confirmDeleteBlog = async () => {
    const blogId = deleteBlogTargetId;
    setDeleteBlogTargetId(null);

    try {
      await api.delete(`/Admin/blogs/${blogId}`);
      setBlogs(blogs.filter((b) => b.id !== blogId));
      toast.success("Blog deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-8">
        Admin Panel
      </h2>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active", value: stats.activeUsers },
            { label: "Deactivated", value: stats.deactivatedUsers },
            { label: "Blogs", value: stats.totalBlogs },
            { label: "Comments", value: stats.totalComments },
            { label: "Likes", value: stats.totalLikes },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-4 text-center"
            >
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {item.value}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-4">
        Users
      </h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 dark:bg-stone-700 text-left text-stone-600 dark:text-stone-300">
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-amber-100 dark:border-stone-700 text-stone-700 dark:text-stone-300"
              >
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-amber-400">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.isActive ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    {user.role === "Admin" ? (
                      <button
                        onClick={() => handleRoleChange(user.id, "User")}
                        className="w-20 text-left text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Make User
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user.id, "Admin")}
                        className="w-20 text-left text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.isActive ? (
                      <button
                        onClick={() => setDeactivateTargetId(user.id)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user.id)}
                        className="text-xs font-medium text-green-600 hover:underline"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-4">
        All Blogs
      </h3>

      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <Link
                to={`/blog/${blog.id}`}
                className="font-serif font-semibold text-stone-800 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition"
              >
                {blog.title}
              </Link>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                By {blog.authorName} in {blog.categoryName}
              </p>
            </div>
            <button
              onClick={() => setDeleteBlogTargetId(blog.id)}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        show={deactivateTargetId !== null}
        message="Deactivate this user?"
        onConfirm={confirmDeactivate}
        onCancel={() => setDeactivateTargetId(null)}
      />

      <ConfirmModal
        show={deleteBlogTargetId !== null}
        message="Delete this blog?"
        onConfirm={confirmDeleteBlog}
        onCancel={() => setDeleteBlogTargetId(null)}
      />
    </div>
  );
}

export default AdminPanel;