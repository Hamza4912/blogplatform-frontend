import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

const inputClass =
  "w-full px-3 py-2 text-sm rounded-md border border-amber-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Category");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
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
      toast.success("Category created.");
    } catch (err) {
      console.error(err);
      setError("Failed to create category.");
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
      toast.success("Category updated.");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  const confirmDelete = async () => {
    const id = deleteTargetId;
    setDeleteTargetId(null);

    try {
      await api.delete(`/Category/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. This category may still have blogs.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-8">
        Manage Categories
      </h2>

      <form
        onSubmit={handleCreate}
        className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-6 mb-10 space-y-4"
      >
        <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100">
          Add Category
        </h3>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={inputClass}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
        >
          Add Category
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-4">
        All Categories
      </h3>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-4"
          >
            {editingId === cat.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={inputClass}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 border border-amber-200 dark:border-stone-600 rounded-md hover:bg-amber-50 dark:hover:bg-stone-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif font-semibold text-stone-800 dark:text-stone-100">
                    {cat.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(cat.id)}
                    className="text-xs font-medium text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        show={deleteTargetId !== null}
        message="Delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

export default Categories;