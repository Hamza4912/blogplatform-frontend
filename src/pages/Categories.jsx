import { useState, useEffect } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Category");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError("Categories load nahi hui.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/Category", { name, description });
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Category create nahi hui.");
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description);
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/Category/${id}`, {
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Update nahi hua.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Category delete karni hai?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Category/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete nahi hua. Shayad is category mein blogs hain.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Manage Categories</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Add Category</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <hr />

      {categories.map((cat) => (
        <div
          key={cat.id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          {editingId === cat.id ? (
            <div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <br />
              <br />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <br />
              <br />
              <button onClick={() => handleUpdate(cat.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <strong>{cat.name}</strong>
              <p>{cat.description}</p>
              <button onClick={() => handleEditClick(cat)}>Edit</button>
              <button onClick={() => handleDelete(cat.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Categories;