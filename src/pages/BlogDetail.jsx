import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

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
    const message = err.response?.data?.message || "";

    if (message.includes("already liked")) {
      setLiked(true);
      toast.info("You've already liked this blog.");
    } else if (message.includes("not liked")) {
      setLiked(false);
      toast.info("You haven't liked this blog yet.");
    } else {
      toast.error("Something went wrong while liking/unliking.");
    }
  }
};

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-stone-500 dark:text-stone-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <article className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-8 mb-8">
        <span className="inline-block text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-stone-700 px-2 py-0.5 rounded-full mb-4">
          {blog.categoryName}
        </span>

        <h1 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">
          {blog.title}
        </h1>
<p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
  By {blog.authorName} ·{" "}
  {new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</p>

        <div
  className="prose prose-stone dark:prose-invert max-w-none mb-6 text-stone-700 dark:text-stone-300"
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
/>

        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            liked
              ? "bg-amber-700 text-white hover:bg-amber-800"
              : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-400 dark:hover:bg-stone-600"
          }`}
        >
          {liked ? "♥ Liked" : "♡ Like"} ({likesCount})
        </button>
      </article>

      <div className="bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-100 mb-4">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 && (
          <p className="text-sm text-stone-400 dark:text-stone-500 mb-6">No comments yet.</p>
        )}

        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-amber-100 dark:border-stone-700 pb-4"
            >
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 mb-1">
                {comment.authorName}
              </p>

              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows="2"
                  />
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs font-medium text-stone-500 dark:text-stone-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 mb-2">
                    {comment.text}
                  </p>
                  <div className="flex gap-3">
                    {currentUserId === comment.userId && (
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {(currentUserId === comment.userId || role === "Admin") && (
                      <button
                        onClick={() => setDeleteTargetId(comment.id)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows="3"
            required
          />
          <button
            type="submit"
            className="mt-3 px-5 py-2 bg-amber-700 text-white text-sm font-medium rounded-md hover:bg-amber-800 transition"
          >
            Post Comment
          </button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
      </div>

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