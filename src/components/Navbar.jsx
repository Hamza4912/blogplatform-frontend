import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    await api.post("/Auth/logout", { refreshToken });
  } catch (err) {
    console.error(err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  navigate("/login");
};

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div>
        <Link to="/blogs" style={{ marginRight: "15px" }}>
          All Blogs
        </Link>
        <Link to="/create-blog" style={{ marginRight: "15px" }}>
  Write Blog
</Link>
        <Link to="/profile" style={{ marginRight: "15px" }}>
          Profile
        </Link>
        <Link to="/categories" style={{ marginRight: "15px" }}>
  Categories
</Link>
        {role === "Admin" && (
          <Link to="/admin" style={{ marginRight: "15px" }}>
            Admin Panel
          </Link>
        )}
      </div>

      <div>
        {username ? (
          <>
            <span style={{ marginRight: "15px" }}>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;