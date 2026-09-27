import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await api.post("/Auth/login", {
      email: email,
      password: password,
    });

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("role", response.data.role);

    navigate("/blogs"); // abhi ye page nahi bana, thodi der mein banayenge
    console.log("Login success! Token saved.");
  } catch (err) {
    console.error(err);
    setError("Login failed. Email ya password check karo.");
  }
};
  return (
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    <p>
  Account nahi hai? <Link to="/register">Register karo</Link>
</p>
    </div>
  );
}

export default Login;