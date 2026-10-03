import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import DOMPurify from "dompurify";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/Blog");
        setBlogs(response.data.items);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const confirmDelete = async () => {
    const blogId = deleteTargetId;
    setDeleteTargetId(null);

    const role = localStorage.getItem("role");
    const endpoint = role === "Admin" ? `/Admin/blogs/${blogId}` : `/Blog/${blogId}`;

    try {
      await api.delete(endpoint);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      toast.success("Blog deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. You may not have permission.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>All Blogs</h2>
      {blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <div
          key={blog.id}
          style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}
        >
          <h3>
            <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
          />
          <small>
            By {blog.authorName} in {blog.categoryName}
          </small>
          <br />
          {currentUserId === blog.userId && (
            <Link to={`/edit-blog/${blog.id}`} style={{ marginRight: "10px" }}>
              Edit
            </Link>
          )}
          {(currentUserId === blog.userId || role === "Admin") && (
            <button onClick={() => setDeleteTargetId(blog.id)}>Delete</button>
          )}
        </div>
      ))}

      <ConfirmModal
        show={deleteTargetId !== null}
        message="Are you sure you want to delete this blog?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

export default BlogList;