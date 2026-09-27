import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/Category");
        setCategories(response.data);
      } catch (err) {
        console.error(err);
        setError("Categories load nahi ho sakin.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/Blog", {
        title: title,
        content: content,
        categoryId: Number(categoryId),
      });

      navigate("/blogs");
    } catch (err) {
      console.error(err);
      setError("Blog create nahi hua. Dubara try karo.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />

        <div>
          <label>Content</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            style={{ width: "100%" }}
            required
          />
        </div>
        <br />

        <div>
          <label>Category</label>
          <br />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Select category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <br />

        <button type="submit">Publish Blog</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default CreateBlog;
