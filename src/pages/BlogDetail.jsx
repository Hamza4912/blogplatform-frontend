import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import DOMPurify from "dompurify";

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
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/Blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog.");
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
      toast.success("Comment posted.");
    } catch (err) {
      console.error(err);
      setError("Failed to post comment.");
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
      toast.success("Comment updated.");
    } catch (err) {
      console.error(err);
      toast.error("Update failed. You may not have permission.");
    }
  };

  const confirmDeleteComment = async () => {
    const commentId = deleteTargetId;
    setDeleteTargetId(null);

    const endpoint = role === "Admin" ? `/Admin/comments/${commentId}` : `/comments/${commentId}`;

    try {
      await api.delete(endpoint);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. You may not have permission.");
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
      toast.error("Something went wrong while liking/unliking.");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>{blog.title}</h2>
      <div
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
/>
      <small>
        By {blog.authorName} in {blog.categoryName}
      </small>
      <br />
      <button onClick={handleLikeToggle}>
        {liked ? "Unlike" : "Like"} ({likesCount})
      </button>

      <hr />

      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
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
              {currentUserId === comment.userId && (
                <button onClick={() => handleEditClick(comment)}>Edit</button>
              )}
              {(currentUserId === comment.userId || role === "Admin") && (
                <button onClick={() => setDeleteTargetId(comment.id)}>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{ width: "100%" }}
          rows="3"
          required
        />
        <br />
        <button type="submit">Post Comment</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <ConfirmModal
        show={deleteTargetId !== null}
        message="Delete this comment?"
        onConfirm={confirmDeleteComment}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

export default BlogDetail;