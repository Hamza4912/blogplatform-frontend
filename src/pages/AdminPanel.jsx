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
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>Admin Panel</h2>

      {stats && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Total Users: {stats.totalUsers}
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Active: {stats.activeUsers}
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Deactivated: {stats.deactivatedUsers}
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Total Blogs: {stats.totalBlogs}
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Total Comments: {stats.totalComments}
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px 20px" }}>
            Total Likes: {stats.totalLikes}
          </div>
        </div>
      )}

      <h3>Users</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Username</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.username}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.email}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.role}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.isActive ? "Active" : "Deactivated"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.role === "Admin" ? (
                  <button onClick={() => handleRoleChange(user.id, "User")}>
                    Make User
                  </button>
                ) : (
                  <button onClick={() => handleRoleChange(user.id, "Admin")}>
                    Make Admin
                  </button>
                )}
                {" "}
                {user.isActive ? (
                  <button onClick={() => setDeactivateTargetId(user.id)}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleActivate(user.id)}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Blogs</h3>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <strong>
            <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
          </strong>
          <br />
          <small>By {blog.authorName} in {blog.categoryName}</small>
          <br />
          <button onClick={() => setDeleteBlogTargetId(blog.id)}>Delete</button>
        </div>
      ))}

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