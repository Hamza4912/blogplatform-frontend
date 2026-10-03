import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function BlogDetail() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
const [likesCount, setLikesCount] = useState(0);
const [liked, setLiked] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/Blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error(err);
        setError("Blog load nahi hua.");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/blog/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchLikes = async () => {
  try {
    const response = await api.get(`/Blog/${id}/likes`);
    setLikesCount(response.data.likes);
  } catch (err) {
    console.error(err);
  }
};

    fetchBlog();
    fetchComments();
    fetchLikes(); 
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/blog/${id}/comments`, {
        text: newComment,
      });

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      setError("Comment post nahi hua.");
    }
  };

  const handleEditClick = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await api.put(`/comments/${commentId}`, {
        text: editText,
      });

      setComments(
        comments.map((c) => (c.id === commentId ? response.data : c))
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Update nahi hua. Shayad ye tumhara comment nahi hai.");
    }
  };

  const handleDeleteComment = async (commentId) => {
  const confirmDelete = window.confirm("Comment delete karna hai?");
  if (!confirmDelete) return;

  const role = localStorage.getItem("role");
  const endpoint = role === "Admin" ? `/Admin/comments/${commentId}` : `/comments/${commentId}`;

  try {
    await api.delete(endpoint);
    setComments(comments.filter((c) => c.id !== commentId));
  } catch (err) {
    console.error(err);
    alert("Delete nahi hua. Shayad ye tumhara comment nahi hai.");
  }
};
const handleLikeToggle = async () => {
  try {
    if (liked) {
      await api.delete(`/Blog/${id}/like`);
      setLikesCount(likesCount - 1);
      setLiked(false);
    } else {
      await api.post(`/Blog/${id}/like`);
      setLikesCount(likesCount + 1);
      setLiked(true);
    }
  } catch (err) {
    console.error(err);
    alert("Kuch masla hua like/unlike karne mein.");
  }
};
  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <small>
        By {blog.authorName} in {blog.categoryName}
      </small>
<button onClick={handleLikeToggle}>
  {liked ? "Unlike" : "Like"} ({likesCount})
</button>
      <hr />

      <h3>Comments</h3>
      {comments.length === 0 && <p>Koi comment nahi hai abhi.</p>}
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
        >
          <strong>{comment.authorName}</strong>

          {editingId === comment.id ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ width: "100%" }}
                rows="2"
              />
              <br />
              <button onClick={() => handleUpdateComment(comment.id)}>
                Save
              </button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{comment.text}</p>
              <button onClick={() => handleEditClick(comment)}>Edit</button>
              <button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Comment likho..."
          style={{ width: "100%" }}
          rows="3"
          required
        />
        <br />
        <button type="submit">Post Comment</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default BlogDetail;