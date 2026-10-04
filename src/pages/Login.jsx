import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const inputClass =
  "w-full px-3 py-2 text-sm rounded-md border border-amber-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500";

const labelClass =
  "block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1";

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
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      const meResponse = await api.get("/User/me");
      localStorage.setItem("userId", meResponse.data.id);

      toast.success("Welcome back!");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your email and password.";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-10">
      <div className="w-full max-w-sm bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
          Log in to continue to Bytepress
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
          >
            Login
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        <p className="text-sm text-stone-500 dark:text-stone-400 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login; 