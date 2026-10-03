import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [deactivateTargetId, setDeactivateTargetId] = useState(null);

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

    fetchUsers();
    fetchStats();
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

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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

      <ConfirmModal
        show={deactivateTargetId !== null}
        message="Deactivate this user?"
        onConfirm={confirmDeactivate}
        onCancel={() => setDeactivateTargetId(null)}
      />
    </div>
  );
}

export default AdminPanel;