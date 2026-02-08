import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { AuthContextProvider } from "@context/AuthContext";
import axiosInstance from "@lib/axios";
import styles from "../styles/EditPostModal.module.scss";

const EditPostModal = ({ open, onClose, post, onUpdate }) => {
  const { isSkSuperAdmin, isSkNaturalAdmin } = AuthContextProvider();
  const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("post");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setDescription(post.description || "");
      setPostType(post.type || post.post_type || "post");
      setExistingMedia(post.media || []);
      setMediaFiles([]);
      setPreviewUrls([]);
      setMediaToDelete([]);
      setError("");
    }
  }, [post, open]);

  // Clean up object URLs when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => {
        if (preview.isNew) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previewUrls]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (validFiles.length !== files.length) {
      setError("Please select only image or video files");
      return;
    }

    // Check total media count
    const totalMediaCount =
      existingMedia.length -
      mediaToDelete.length +
      mediaFiles.length +
      validFiles.length;
    if (totalMediaCount > 10) {
      setError("Maximum 10 media files allowed");
      return;
    }

    setMediaFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "video",
      isNew: true,
      file: file,
    }));

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setError(""); // Clear any previous errors
  };

  const removeNewFile = useCallback((index) => {
    setPreviewUrls((prev) => {
      const updated = [...prev];
      const removedPreview = updated[index];

      // Revoke object URL
      if (removedPreview.isNew) {
        URL.revokeObjectURL(removedPreview.url);
      }

      return updated.filter((_, i) => i !== index);
    });

    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingMedia = useCallback((mediaId) => {
    setMediaToDelete((prev) => [...prev, mediaId]);
    setExistingMedia((prev) =>
      prev.filter((media) => media.media_id !== mediaId),
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOfficial) {
      setError("Only officials can edit posts");
      return;
    }

    // Validation
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (description.length > 5000) {
      setError("Description must be less than 5000 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("type", postType);

      // Add new media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      // Add media to delete
      if (mediaToDelete.length > 0) {
        mediaToDelete.forEach((id) => {
          formData.append("media_to_delete[]", id);
        });
      }

      const response = await axiosInstance.put(
        `/post/${post.post_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Clean up all preview URLs
      previewUrls.forEach((preview) => {
        if (preview.isNew) {
          URL.revokeObjectURL(preview.url);
        }
      });

      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    previewUrls.forEach((preview) => {
      if (preview.isNew) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setPreviewUrls([]);
    setMediaFiles([]);
    setMediaToDelete([]);
    setError("");
    onClose();
  };

  if (!post) return null;

  const totalMediaCount = existingMedia.length + previewUrls.length;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.edit_post_modal}>
        <Box className={styles.modal_header}>
          <Typography variant="h6">Edit Post</Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <X size={20} />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box className={styles.modal_content}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Post Type</InputLabel>
              <Select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                label="Post Type"
                disabled={loading}
                required
              >
                <MenuItem value="post">Post</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="activity">Activity</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              required
              error={description.length > 5000}
              helperText={`${description.length}/5000 characters`}
            />

            {/* Media Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Media ({totalMediaCount}/10)
              </Typography>

              {/* Existing Media */}
              {existingMedia.length > 0 && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {existingMedia.map((media) => (
                    <Grid item key={media.media_id}>
                      <Paper
                        elevation={1}
                        className={styles.media_item}
                        sx={{
                          position: "relative",
                          "&:hover .remove_media": {
                            opacity: 1,
                          },
                        }}
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt="Post media"
                            className={styles.media_preview}
                            loading="lazy"
                          />
                        ) : (
                          <video
                            className={styles.media_preview_video} // Changed here
                            controls
                            muted
                            preload="metadata"
                          >
                            <source
                              src={media.url}
                              type={`video/${media.url.split(".").pop()}`}
                            />
                          </video>
                        )}
                        <IconButton
                          size="small"
                          className={styles.remove_media}
                          onClick={() => removeExistingMedia(media.media_id)}
                          disabled={loading}
                        >
                          <X size={14} />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* New Media Upload */}
              <Box sx={{ mb: previewUrls.length > 0 ? 2 : 0 }}>
                <input
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  id="upload-media"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  disabled={loading || totalMediaCount >= 10}
                />
                <label htmlFor="upload-media">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload size={18} />}
                    disabled={loading || totalMediaCount >= 10}
                    fullWidth
                  >
                    Add Media (Images/Videos)
                  </Button>
                </label>
                {totalMediaCount >= 10 && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Maximum 10 media files allowed
                  </Typography>
                )}
              </Box>

              {/* New Media Previews */}
              {previewUrls.length > 0 && (
                <Grid container spacing={1}>
                  {previewUrls.map((preview, index) => (
                    <Grid item key={`new-${index}`}>
                      <Paper
                        elevation={1}
                        className={styles.media_item}
                        sx={{
                          position: "relative",
                          "&:hover .remove_media": {
                            opacity: 1,
                          },
                        }}
                      >
                        {preview.type === "image" ? (
                          <img
                            src={preview.url}
                            alt="Preview"
                            className={styles.media_preview}
                          />
                        ) : (
                          <video
                            className={styles.media_preview_video}
                            controls
                            muted
                          >
                            <source
                              src={preview.url}
                              type={preview.file.type}
                            />
                          </video>
                        )}
                        <IconButton
                          size="small"
                          className={styles.remove_media}
                          onClick={() => removeNewFile(index)}
                          disabled={loading}
                        >
                          <X size={14} />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            {/* Post Type Badge Preview */}
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Post Type Preview:
              </Typography>
              <Chip
                label={postType.charAt(0).toUpperCase() + postType.slice(1)}
                color={
                  postType === "announcement"
                    ? "primary"
                    : postType === "activity"
                      ? "warning"
                      : "default"
                }
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Box className={styles.modal_actions}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditPostModal;
