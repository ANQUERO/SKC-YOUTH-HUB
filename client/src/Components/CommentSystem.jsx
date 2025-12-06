import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";
import "./CommentSystem.scss";

const CommentSystem = ({ postId }) => {
  const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [showOptions, setShowOptions] = useState({});
  const [commentReactions, setCommentReactions] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const commentInputRef = useRef(null);

  const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
  const canModerate = isOfficial;

  // Handle scrolling to specific comment from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#comment-")) {
      const commentId = parseInt(hash.replace("#comment-", ""));
      if (commentId && comments.length > 0) {
        // Wait a bit for comments to render, then scroll
        setTimeout(() => {
          const commentElement = document.getElementById(
            `comment-${commentId}`
          );
          if (commentElement) {
            commentElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            // Highlight the comment briefly
            commentElement.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
            setTimeout(() => {
              commentElement.style.backgroundColor = "";
            }, 2000);
          }
        }, 500);
      }
    }
  }, [comments, postId]);

  const fetchCommentReactions = useCallback(async (commentId) => {
  try {
    const response = await axiosInstance.get(`/comment/${commentId}/reactions`);
    const reactions = response.data.data || [];

    const counts = { like: 0, heart: 0, wow: 0 };
    reactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });

    setCommentReactions((prev) => ({
      ...prev,
      [commentId]: counts,
    }));

    if (authUser) {
      const userId =
        authUser.userType === "official"
          ? authUser.official_id
          : authUser.youth_id;

      const userReaction = reactions.find(
        (r) => r.user_type === authUser.userType && r.user_id === userId
      );

      if (userReaction) {
        setUserReactions((prev) => ({
          ...prev,
          [commentId]: userReaction.type,
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching comment reactions:", error);
  }
}, [authUser]);

const fetchComments = useCallback(async () => {
  try {
    const response = await axiosInstance.get(`/post/${postId}/comments`);
    const commentsData = response.data.data || [];
    setComments(commentsData);

    const reactionsPromises = [];

    const fetchReactionsRecursively = (comments) => {
      comments.forEach((comment) => {
        reactionsPromises.push(fetchCommentReactions(comment.comment_id));

        if (comment.replies?.length > 0) {
          fetchReactionsRecursively(comment.replies);
        }
      });
    };

    fetchReactionsRecursively(commentsData);
    await Promise.all(reactionsPromises);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}, [postId, fetchCommentReactions]);

  const handleCommentReact = async (commentId, type) => {
    try {
      const currentReaction = userReactions[commentId];

      if (currentReaction === type) {
        // Remove reaction if clicking the same type
        await axiosInstance.delete(`/comment/${commentId}/react`);
        setUserReactions((prev) => {
          const updated = { ...prev };
          delete updated[commentId];
          return updated;
        });
        // Update counts
        setCommentReactions((prev) => ({
          ...prev,
          [commentId]: {
            ...prev[commentId],
            [type]: Math.max(0, (prev[commentId]?.[type] || 0) - 1),
          },
        }));
      } else {
        // Add or update reaction
        await axiosInstance.post(`/comment/${commentId}/react`, { type });

        // Update user reaction
        setUserReactions((prev) => ({
          ...prev,
          [commentId]: type,
        }));

        // Update counts
        setCommentReactions((prev) => {
          const current = prev[commentId] || { like: 0, heart: 0, wow: 0 };
          const updated = { ...current };

          // Remove old reaction count if exists
          if (currentReaction) {
            updated[currentReaction] = Math.max(
              0,
              (updated[currentReaction] || 0) - 1
            );
          }

          // Add new reaction count
          updated[type] = (updated[type] || 0) + 1;

          return {
            ...prev,
            [commentId]: updated,
          };
        });
      }

      // Refresh reactions to get accurate data
      await fetchCommentReactions(commentId);
    } catch (error) {
      console.error("Error reacting to comment:", error);
      showError(error.response?.data?.message || "Failed to react to comment");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/post/${postId}/comments`, {
        content: newComment.trim(),
      });
      setNewComment("");
      fetchComments();
      showSuccess("Your comment was posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      showError(error.response?.data?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/post/${postId}/comments`, {
        content: replyContent.trim(),
        parent_comment_id: parentId,
      });
      setReplyContent("");
      setReplyingTo(null);
      fetchComments();
      showSuccess("Your reply was posted successfully");
    } catch (error) {
      console.error("Error posting reply:", error);
      showError(error.response?.data?.message || "Failed to post reply");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axiosInstance.delete(`/post/comments/${commentId}`);
      fetchComments();
      showSuccess("Comment has been deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showError(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleHideComment = async (commentId, reason = "") => {
    try {
      await axiosInstance.put(`/post/comments/${commentId}/hide`, { reason });
      fetchComments();
      showSuccess("Comment has been hidden");
    } catch (error) {
      console.error("Error hiding comment:", error);
      showError(error.response?.data?.message || "Failed to hide comment");
    }
  };

  const handleUnhideComment = async (commentId) => {
    try {
      await axiosInstance.put(`/post/comments/${commentId}/unhide`);
      fetchComments();
      showSuccess("Comment has been made visible");
    } catch (error) {
      console.error("Error unhiding comment:", error);
      showError(error.response?.data?.message || "Failed to unhide comment");
    }
  };

  const handleBanUser = async (userId, userType) => {
    const reason = prompt("Enter reason for banning (optional):");
    if (reason === null) return; // User cancelled

    try {
      await axiosInstance.put(`/post/ban/${userType}/${userId}`, { reason });
      showSuccess(`${userType} has been banned from commenting`);
    } catch (error) {
      console.error("Error banning user:", error);
      showError(error.response?.data?.message || "Failed to ban user");
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleOptions = (commentId) => {
    setShowOptions((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return commentDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const CommentItem = ({ comment, depth = 0 }) => {
    const isOwner =
      authUser &&
      ((authUser.userType === "youth" &&
        authUser.youth_id === comment.user_id) ||
        (authUser.userType === "official" &&
          authUser.official_id === comment.user_id));

    const canDelete = isOwner || canModerate;
    const canHide = canModerate && !isOwner;
    const canBan = canModerate && !isOwner;

    return (
      <div
        id={`comment-${comment.comment_id}`}
        className={`comment-item ${depth > 0 ? "reply" : ""}`}
      >
        <div className="comment-header">
          <div className="user-info">
            <div className="avatar">
              {comment.user_name
                ? comment.user_name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="user-details">
              <span className="username">
                {comment.user_name || "Unknown User"}
              </span>
              {comment.user_role && (
                <span className={`role-badge ${comment.user_role}`}>
                  {comment.user_role === "super_official"
                    ? "Super Official"
                    : "Official"}
                </span>
              )}
              <span className="timestamp">
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>
          </div>

          {canDelete && (
            <div className="comment-options">
              <button
                className="options-btn"
                onClick={() => toggleOptions(comment.comment_id)}
              >
                ⋯
              </button>

              {showOptions[comment.comment_id] && (
                <div className="options-menu">
                  {isOwner && (
                    <button
                      className="option-item delete"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                  {canHide && (
                    <>
                      {comment.is_hidden ? (
                        <button
                          className="option-item"
                          onClick={() =>
                            handleUnhideComment(comment.comment_id)
                          }
                        >
                          👁️ Unhide
                        </button>
                      ) : (
                        <button
                          className="option-item"
                          onClick={() => handleHideComment(comment.comment_id)}
                        >
                          🙈 Hide
                        </button>
                      )}
                    </>
                  )}
                  {canBan && (
                    <button
                      className="option-item ban"
                      onClick={() =>
                        handleBanUser(comment.user_id, comment.user_type)
                      }
                    >
                      🚫 Ban User
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="comment-content">
          {comment.is_hidden ? (
            <div className="hidden-comment">
              <span className="hidden-text">This comment has been hidden</span>
              {comment.hidden_reason && (
                <span className="hidden-reason">
                  Reason: {comment.hidden_reason}
                </span>
              )}
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
        </div>

        <div className="comment-actions">
          <div className="reaction-buttons">
            <button
              className={`reaction-btn ${
                userReactions[comment.comment_id] === "like" ? "active" : ""
              }`}
              onClick={() => handleCommentReact(comment.comment_id, "like")}
              title="Like"
            >
              👍 <span>{commentReactions[comment.comment_id]?.like || 0}</span>
            </button>
            <button
              className={`reaction-btn ${
                userReactions[comment.comment_id] === "heart" ? "active" : ""
              }`}
              onClick={() => handleCommentReact(comment.comment_id, "heart")}
              title="Heart"
            >
              ❤️ <span>{commentReactions[comment.comment_id]?.heart || 0}</span>
            </button>
            <button
              className={`reaction-btn ${
                userReactions[comment.comment_id] === "wow" ? "active" : ""
              }`}
              onClick={() => handleCommentReact(comment.comment_id, "wow")}
              title="Wow"
            >
              😮 <span>{commentReactions[comment.comment_id]?.wow || 0}</span>
            </button>
          </div>
          <button
            className="action-btn reply-btn"
            onClick={() => {
              setReplyingTo(comment.comment_id);
              setReplyContent("");
            }}
          >
            Reply
          </button>
        </div>

        {replyingTo === comment.comment_id && (
          <div className="reply-form">
            <div className="reply-input">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleReply(comment.comment_id);
                  }
                }}
                autoFocus
              />
              <div className="reply-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="reply-submit-btn"
                  onClick={() => handleReply(comment.comment_id)}
                  disabled={!replyContent.trim() || loading}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-section">
            <button
              className="toggle-replies-btn"
              onClick={() => toggleReplies(comment.comment_id)}
            >
              {showReplies[comment.comment_id]
                ? `Hide ${comment.replies.length} repl${
                    comment.replies.length > 1 ? "ies" : "y"
                  }`
                : `View ${comment.replies.length} repl${
                    comment.replies.length > 1 ? "ies" : "y"
                  }`}
            </button>

            {showReplies[comment.comment_id] && (
              <div className="replies-list">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.comment_id}
                    comment={reply}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-system">
      <div className="comment-form">
        <form onSubmit={handleSubmitComment}>
          <div className="comment-input-wrapper">
            <div className="user-avatar">
              {authUser?.name ? authUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="input-container">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="submit-btn"
                disabled={!newComment.trim() || loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.comment_id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
