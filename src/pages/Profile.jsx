import { useState, useEffect } from "react";
import api from "../services/api";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/User/me");
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        console.error(err);
        setProfileError("Profile load nahi hua.");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    try {
      await api.put("/User/profile", {
        username: username,
        email: email,
      });

      setProfileSuccess("Profile update ho gaya.");
      localStorage.setItem("username", username);
    } catch (err) {
      console.error(err);
      setProfileError("Profile update nahi hua.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    try {
      await api.put("/User/change-password", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      setPasswordSuccess("Password change ho gaya.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setPasswordError("Password change nahi hua. Current password check karo.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>My Profile</h2>

      <form onSubmit={handleProfileSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />
        <button type="submit">Update Profile</button>
        {profileError && <p style={{ color: "red" }}>{profileError}</p>}
        {profileSuccess && <p style={{ color: "green" }}>{profileSuccess}</p>}
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>Change Password</h3>
      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label>Current Password</label>
          <br />
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />
        <div>
          <label>New Password</label>
          <br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />
        <button type="submit">Change Password</button>
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        {passwordSuccess && <p style={{ color: "green" }}>{passwordSuccess}</p>}
      </form>
    </div>
  );
}

export default Profile;