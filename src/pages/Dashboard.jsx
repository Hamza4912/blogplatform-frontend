import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDashboard = async () => {
      try {
        const username = localStorage.getItem("username");

        const blogsResponse = await api.get("/Blog", {
          params: { AuthorName: username, PageSize: 100 },
        });

        const blogs = blogsResponse.data.items;

        const blogsWithStats = await Promise.all(
          blogs.map(async (blog) => {
            const [likesRes, commentsRes] = await Promise.all([
              api.get(`/Blog/${blog.id}/likes`),
              api.get(`/blog/${blog.id}/comments`),
            ]);

            return {
              ...blog,
              likesCount: likesRes.data.likes,
              commentsCount: commentsRes.data.length,
            };
          })
        );

        setMyBlogs(blogsWithStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  const totalBlogs = myBlogs.length;
  const totalLikes = myBlogs.reduce((sum, b) => sum + b.likesCount, 0);
  const totalComments = myBlogs.reduce((sum, b) => sum + b.commentsCount, 0);

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h2>My Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px 25px", borderRadius: "6px" }}>
          <strong>{totalBlogs}</strong>
          <p style={{ margin: 0 }}>My Blogs</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px 25px", borderRadius: "6px" }}>
          <strong>{totalLikes}</strong>
          <p style={{ margin: 0 }}>Likes Received</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px 25px", borderRadius: "6px" }}>
          <strong>{totalComments}</strong>
          <p style={{ margin: 0 }}>Comments Received</p>
        </div>
      </div>

      <h3>My Posts</h3>
      {myBlogs.length === 0 && <p>You haven't posted any blogs yet.</p>}

      {myBlogs.map((blog) => (
        <div
          key={blog.id}
          style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "6px" }}
        >
          <h4>
            <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
          </h4>
          <small>
            {blog.likesCount} likes · {blog.commentsCount} comments · {blog.categoryName}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;