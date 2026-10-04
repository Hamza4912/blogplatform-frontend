import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const inputClass =
  "w-full px-3 py-2 text-sm rounded-md border border-amber-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500";

const labelClass =
  "block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/User/me");
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        console.error(err);
        setProfileError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");

    try {
      await api.put("/User/profile", {
        username: username,
        email: email,
      });

      toast.success("Profile updated successfully.");
      localStorage.setItem("username", username);
    } catch (err) {
      console.error(err);
      setProfileError("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    try {
      await api.put("/User/change-password", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setPasswordError("Failed to change password. Please check your current password.");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-8">
        My Profile
      </h2>

      <form
        onSubmit={handleProfileSubmit}
        className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 mb-8 space-y-4"
      >
        <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100">
          Account Details
        </h3>
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
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
        >
          Update Profile
        </button>
        {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 space-y-4"
      >
        <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100">
          Change Password
        </h3>
        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
        >
          Change Password
        </button>
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      </form>
    </div>
  );
}

export default Profile;