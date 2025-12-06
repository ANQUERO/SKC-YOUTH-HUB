import React, { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";
import EditPostModal from "./EditPostModal";
import styles from "@styles/postOptions.module.scss";

const PostOptions = ({ post, onPostDeleted, onPostHidden, onPostUpdated }) => {
  const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
  const isOwner =
    authUser &&
    authUser.userType === "official" &&
    authUser.official_id === post.official?.official_id;

  const canEdit = isOwner || isOfficial;
  const canDelete = isOwner || isOfficial;
  const canHide = isOfficial && !isOwner;

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.delete(`/post/${post.post_id}`);
      showSuccess("Post deleted successfully");
      onPostDeleted && onPostDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
      showError(error.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleHide = async () => {
    const reason = prompt("Enter reason for hiding this post (optional):");
    if (reason === null) return; // User cancelled

    setLoading(true);
    try {
      await axiosInstance.put(`/post/${post.post_id}/hide`, { reason });
      showSuccess("Post has been hidden from public view");
      onPostHidden && onPostHidden(true);
    } catch (error) {
      console.error("Error hiding post:", error);
      showError(error.response?.data?.message || "Failed to hide post");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleUnhide = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/post/${post.post_id}/unhide`);
      showSuccess("Post has been made visible again");
      onPostHidden && onPostHidden(false);
    } catch (error) {
      console.error("Error unhiding post:", error);
      showError(error.response?.data?.message || "Failed to unhide post");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleUpdatePost = (updatedPost) => {
    showSuccess("Post updated successfully");
    onPostUpdated && onPostUpdated(updatedPost);
  };

  const handleBanUser = async () => {
    const userType = "official"; // Posts are only created by officials
    const userId = post.official?.official_id;

    if (!userId) {
      showError("Cannot identify post author");
      return;
    }

    const reason = prompt(
      `Enter reason for banning this ${userType} from posting (optional):`
    );
    if (reason === null) return;

    setLoading(true);
    try {
      await axiosInstance.put(`/post/ban/${userType}/${userId}`, { reason });
      showSuccess(`${userType} has been banned from creating posts`);
    } catch (error) {
      console.error("Error banning user:", error);
      showError(error.response?.data?.message || "Failed to ban user");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  if (!canEdit && !canDelete && !canHide) {
    return null;
  }

  return (
    <>
      <div className={styles.post_options}>
        <button
          className={styles.options_trigger}
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading}
          aria-label="Post options"
          type="button"
        >
          {loading ? "⋯" : "⋯"}
        </button>

        {showMenu && (
          <>
            <div 
              className={styles.backdrop} 
              onClick={() => setShowMenu(false)} 
              aria-hidden="true"
            />
            <div className={styles.options_menu}>
              {canEdit && (
                <button
                  className={`${styles.option_item} ${styles.option_edit}`}
                  onClick={handleEdit}
                  disabled={loading}
                  type="button"
                >
                  ✏️ Edit Post
                </button>
              )}

              {canDelete && (
                <button
                  className={`${styles.option_item} ${styles.option_delete}`}
                  onClick={handleDelete}
                  disabled={loading}
                  type="button"
                >
                  🗑️ Delete Post
                </button>
              )}

              {canHide && (
                <>
                  {post.is_hidden ? (
                    <button
                      className={styles.option_item}
                      onClick={handleUnhide}
                      disabled={loading}
                      type="button"
                    >
                      👁️ Unhide Post
                    </button>
                  ) : (
                    <button
                      className={styles.option_item}
                      onClick={handleHide}
                      disabled={loading}
                      type="button"
                    >
                      🙈 Hide Post
                    </button>
                  )}
                </>
              )}

              {isOfficial && !isOwner && (
                <button
                  className={`${styles.option_item} ${styles.option_ban}`}
                  onClick={handleBanUser}
                  disabled={loading}
                  type="button"
                >
                  🚫 Ban User from Posting
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <EditPostModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={post}
          onUpdate={handleUpdatePost}
        />
      )}
    </>
  );
};

export default PostOptions;