import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await api.get("/Category");
        setCategories(catResponse.data);

        const blogResponse = await api.get(`/Blog/${id}`);
        setTitle(blogResponse.data.title);
        setContent(blogResponse.data.content);
        setCategoryId(blogResponse.data.categoryId);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/Blog/${id}`, {
        title: title,
        content: content,
        categoryId: Number(categoryId),
      });

      toast.success("Blog updated successfully!");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      setError("Update failed. You may not have permission.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Edit Blog</h2>
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
            style={{ width: "100%" }}
            rows="6"
            required
          />
        </div>
        <br />

        <div>
          <label>Category</label>
          <br />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- Select category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <br />

        <button type="submit">Update Blog</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default EditBlog;