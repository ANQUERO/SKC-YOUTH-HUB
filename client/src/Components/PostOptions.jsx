import React, { useState } from "react";
import axiosInstance from "@lib/axios";
import { AuthContextProvider } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";
import EditPostModal from "./EditPostModal";
import styles from "@styles/postOptions.module.scss";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  VisibilityOff as HideIcon,
  Visibility as UnhideIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

const PostOptions = ({ post, onPostDeleted, onPostHidden, onPostUpdated }) => {
  const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = AuthContextProvider();
  const { showSuccess, showError } = useToast();

  // State for menus and modals
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for confirmation modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [showUnhideModal, setShowUnhideModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  // State for reason inputs
  const [hideReason, setHideReason] = useState("");
  const [banReason, setBanReason] = useState("");

  const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
  const isOwner =
    authUser &&
    authUser.userType === "official" &&
    authUser.official_id === post.official?.official_id;

  const canEdit = isOwner || isOfficial;
  const canDelete = isOwner || isOfficial;
  const canHide = isOfficial;

  // Delete Handler
  const handleDelete = async () => {
    console.log("Delete button clicked");
    console.log("Post ID:", post.post_id);
    console.log("Auth User:", authUser);
    console.log("isSkSuperAdmin:", isSkSuperAdmin);
    console.log("isSkNaturalAdmin:", isSkNaturalAdmin);
    console.log("isOwner:", isOwner);
    console.log("Post official ID:", post.official?.official_id);

    setLoading(true);
    try {
      console.log("Sending DELETE request to:", `/post/${post.post_id}`);
      const response = await axiosInstance.delete(`/post/${post.post_id}`);
      console.log("Delete response:", response.data);

      showSuccess("Post deleted successfully");
      onPostDeleted && onPostDeleted();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting post:", error);
      console.error("Error response:", error.response);
      showError(error.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setShowMenu(false);
    }
  };

  // Hide Handler
  const handleHide = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/post/${post.post_id}/hide`, {
        reason: hideReason || undefined,
      });
      showSuccess("Post has been hidden from public view");
      onPostHidden && onPostHidden(true);
      setHideReason("");

      // Auto refresh and navigate
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error hiding post:", error);
      showError(error.response?.data?.message || "Failed to hide post");
    } finally {
      setLoading(false);
      setShowHideModal(false);
      setShowMenu(false);
    }
  };

  // Unhide Handler
  const handleUnhide = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/post/${post.post_id}/unhide`);
      showSuccess("Post has been made visible again");
      onPostHidden && onPostHidden(false);

      // Auto refresh and navigate
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error unhiding post:", error);
      showError(error.response?.data?.message || "Failed to unhide post");
    } finally {
      setLoading(false);
      setShowUnhideModal(false);
      setShowMenu(false);
    }
  };

  // Edit Handler
  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleUpdatePost = (updatedPost) => {
    showSuccess("Post updated successfully");
    onPostUpdated && onPostUpdated(updatedPost);

    // Auto refresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Ban User Handler
  const handleBanUser = async () => {
    if (isOwner && !isSkSuperAdmin) {
      showError("You cannot ban yourself");
      setShowBanModal(false);
      return;
    }

    const userType = "official";
    const userId = post.official?.official_id;

    if (!userId) {
      showError("Cannot identify post author");
      setShowBanModal(false);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/post/ban/${userType}/${userId}`, {
        reason: banReason || undefined,
      });
      showSuccess(`${userType} has been banned from creating posts`);
      setBanReason("");

      // Auto refresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error banning user:", error);
      showError(error.response?.data?.message || "Failed to ban user");
    } finally {
      setLoading(false);
      setShowBanModal(false);
      setShowMenu(false);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowHideModal(false);
    setShowUnhideModal(false);
    setShowBanModal(false);
    setHideReason("");
    setBanReason("");
  };

  if (!canEdit && !canDelete && !canHide) {
    return null;
  }

  return (
    <>
      {/* Main Options Menu */}
      <div className={styles.post_options}>
        <button
          className={styles.options_trigger}
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading}
          aria-label="Post options"
          type="button"
        >
          {loading ? <CircularProgress size={16} /> : "⋯"}
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
                  onClick={() => setShowDeleteModal(true)}
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
                      onClick={() => setShowUnhideModal(true)}
                      disabled={loading}
                      type="button"
                    >
                      👁️ Unhide Post
                    </button>
                  ) : (
                    <button
                      className={styles.option_item}
                      onClick={() => setShowHideModal(true)}
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
                  onClick={() => setShowBanModal(true)}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => !loading && setShowDeleteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" fontWeight="bold">
            Delete Post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Typography>
          {isOwner && isSkSuperAdmin && (
            <Box
              sx={{ mt: 2, p: 1.5, bgcolor: "warning.light", borderRadius: 1 }}
            >
              <Typography variant="body2" color="warning.dark">
                ⚠️ You are about to delete your own post as a super admin.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="contained"
            color="error"
            startIcon={
              loading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hide Post Modal */}
      <Dialog
        open={showHideModal}
        onClose={() => !loading && setShowHideModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HideIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">
            Hide Post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This post will be hidden from public view. Only officials will be
            able to see it.
          </Typography>
          {isOwner && isSkSuperAdmin && (
            <Box
              sx={{ mb: 2, p: 1.5, bgcolor: "warning.light", borderRadius: 1 }}
            >
              <Typography variant="body2" color="warning.dark">
                ⚠️ You are about to hide your own post as a super admin.
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Reason (optional)"
            variant="outlined"
            value={hideReason}
            onChange={(e) => setHideReason(e.target.value)}
            placeholder="Enter reason for hiding this post..."
            multiline
            rows={2}
            disabled={loading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowHideModal(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleHide}
            disabled={loading || (isOwner && isSkSuperAdmin && !hideReason)}
            variant="contained"
            color="warning"
            startIcon={loading ? <CircularProgress size={16} /> : <HideIcon />}
          >
            {loading ? "Hiding..." : "Hide Post"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unhide Post Modal */}
      <Dialog
        open={showUnhideModal}
        onClose={() => !loading && setShowUnhideModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <UnhideIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Unhide Post
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            This post will be made visible to everyone again.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowUnhideModal(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnhide}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={
              loading ? <CircularProgress size={16} /> : <UnhideIcon />
            }
          >
            {loading ? "Unhiding..." : "Unhide Post"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ban User Modal */}
      <Dialog
        open={showBanModal}
        onClose={() => !loading && setShowBanModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BlockIcon color="error" />
          <Typography variant="h6" fontWeight="bold">
            Ban User from Posting
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This will prevent{" "}
            <strong>{post.official?.name || "the user"}</strong> from creating
            new posts.
          </Typography>
          {isOwner && isSkSuperAdmin && (
            <Box
              sx={{ mb: 2, p: 1.5, bgcolor: "error.light", borderRadius: 1 }}
            >
              <Typography variant="body2" color="error.dark">
                ⚠️ You are about to ban yourself from posting. This action can
                only be reversed by another super admin.
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Reason (optional)"
            variant="outlined"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Enter reason for banning this user..."
            multiline
            rows={2}
            disabled={loading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowBanModal(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBanUser}
            disabled={loading}
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <BlockIcon />}
          >
            {loading ? "Banning..." : "Ban User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Modal */}
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
