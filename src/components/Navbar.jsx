import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        <Link to="/profile" style={{ marginRight: "15px" }}>
          Profile
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