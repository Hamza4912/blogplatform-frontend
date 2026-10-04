import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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
    localStorage.removeItem("userId");
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const closeMenu = () => setMenuOpen(false);

  const links = [
    { to: "/blogs", label: "All Blogs" },
    { to: "/create-blog", label: "Write Blog" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    ...(role === "Admin"
      ? [
          { to: "/categories", label: "Categories" },
          { to: "/admin", label: "Admin Panel" },
        ]
      : []),
  ];

  return (
    <nav className="bg-amber-50 dark:bg-stone-900 border-b border-amber-200 dark:border-stone-700 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            to="/blogs"
            className="text-xl font-serif font-bold text-amber-800 dark:text-amber-400"
          >
            Bytepress
          </Link>

          {username && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-stone-600 dark:text-stone-300">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-amber-100 dark:hover:bg-stone-700 transition"
          >
            🌙
          </button>

          <div className="hidden md:flex items-center gap-4">
            {username ? (
              <>
                <span className="text-sm text-stone-600 dark:text-stone-300">
                  Welcome,{" "}
                  <span className="font-semibold text-stone-800 dark:text-stone-100">
                    {username}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-400 hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md text-stone-700 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-amber-200 dark:border-stone-700 px-4 py-3 space-y-1">
          {username ? (
            <>
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 hover:text-amber-700 dark:hover:text-amber-400 transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-amber-200 dark:border-stone-700">
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/login"
                onClick={closeMenu}
                className="px-4 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-400 hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="px-4 py-1.5 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;