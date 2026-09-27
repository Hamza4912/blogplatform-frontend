import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/Blog");
        setBlogs(response.data.items);
      } catch (err) {
        console.error(err);
        setError("Blogs load nahi ho sake.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm("Kya tum ye blog delete karna chahte ho?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Blog/${blogId}`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error(err);
      alert("Delete nahi hua. Shayad ye tumhara blog nahi hai.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>All Blogs</h2>
      {blogs.length === 0 && <p>Koi blog nahi mila.</p>}
      {blogs.map((blog) => (
        <div
          key={blog.id}
          style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}
        >
          <h3>
  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
</h3>
          <p>{blog.content}</p>
          <small>
            By {blog.authorName} in {blog.categoryName}
          </small>
          <br />
          <Link to={`/edit-blog/${blog.id}`} style={{ marginRight: "10px" }}>
            Edit
          </Link>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default BlogList;