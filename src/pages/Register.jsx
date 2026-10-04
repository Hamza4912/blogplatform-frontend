import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const inputClass =
  "w-full px-3 py-2 text-sm rounded-md border border-amber-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500";

const labelClass =
  "block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/Auth/register", {
        username: username,
        email: email,
        password: password,
      });

      toast.success("Registration successful! Please log in.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-10">
      <div className="w-full max-w-sm bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-1">
          Create account
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
          Join Bytepress and start writing
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              required
            />
          </div>

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
            Register
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        <p className="text-sm text-stone-500 dark:text-stone-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;