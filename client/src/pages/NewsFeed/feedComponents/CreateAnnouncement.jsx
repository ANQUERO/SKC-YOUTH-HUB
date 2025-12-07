import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import { Image, Send, Video, X } from "lucide-react";
import { usePostContext } from "@context/PostContext";
import useCurrentUser from "@hooks/useCurrentUser";

export const CreateAnnouncement = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState(null);
  const [filePreviews, setFilePreviews] = useState([]); // Added missing state
  const { createPost } = usePostContext();
  const { userData, profilePicture, loading: userLoading } = useCurrentUser();

  const handleFileChange = (e, kind) => {
    const list = Array.from(e.target.files || []);
    if (list.length > 0) {
      setFiles(list);
      setFileType(kind);
      
      // Create previews for new files
      const previews = list.map(file => ({
        url: URL.createObjectURL(file),
        type: kind,
        file
      }));
      setFilePreviews(previews);
    }
  };

  const handleRemoveFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    
    setFiles(updated);
    setFilePreviews(updatedPreviews);
    if (updated.length === 0) setFileType(null);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(filePreviews[index].url);
  };

  const handlePost = () => {
    if (description.trim() === "") return;

    const newPost = new FormData();
    newPost.append("description", description);
    newPost.append("type", "announcement");
    
    // Append all files
    files.forEach((file) => {
      newPost.append("media", file);
    });

    createPost.mutate(newPost, {
      onSuccess: () => {
        setDescription("");
        setFiles([]);
        setFilePreviews([]);
        setFileType(null);
        
        // Revoke all object URLs
        filePreviews.forEach(preview => {
          URL.revokeObjectURL(preview.url);
        });
      },
    });
  };

  return (
    <div className={style.createPost}>
      {/* --- USER INFO --- */}
      <div className={style.userInfo}>
        <div className={style.avatarContainer}>
          <img
            src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userData?.name || 'User'
            )}&background=random&color=fff`}
            alt="Profile"
            className={style.avatar}
          />
          {userLoading && <div className={style.avatarLoading}></div>}
        </div>
        <div className={style.userDetails}>
          <strong className={style.userName}>{userData?.name || 'User'}</strong>
          <span className={style.userRole}>
            {userData?.position || 'Youth Member'}
          </span>
        </div>

        <div className={style.topBar}>
          <div className={style.postTypeIndicator}>📢 Announcement</div>
        </div>
      </div>

      {/* --- INPUTS --- */}
      <textarea
        placeholder="Share an important announcement..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={style.postTextarea}
      />

      {/* --- PREVIEW SECTION --- */}
      {filePreviews.length > 0 && (
        <div className={style.previewSection}>
          {filePreviews.map((preview, idx) => (
            <div key={idx} className={style.previewItem}>
              {preview.type === "image" ? (
                <img
                  src={preview.url}
                  alt="preview"
                  className={style.previewMedia}
                />
              ) : (
                <video
                  src={preview.url}
                  className={style.previewMedia}
                  controls
                />
              )}
              <button
                className={style.removeBtn}
                onClick={() => handleRemoveFile(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- ACTIONS --- */}
      <div className={style.actions}>
        <div className={style.files}>
          <label className={style.fileInputLabel}>
            <Image className={style.fileIcon} />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "image")}
              style={{ display: "none" }}
            />
          </label>
          <label className={style.fileInputLabel}>
            <Video className={style.fileIcon} />
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, "video")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <button 
          onClick={handlePost} 
          className={style.postButton}
          disabled={description.trim() === ""}
        >
          <Send className={style.sendIcon} />
          Post
        </button>
      </div>
    </div>
  );
};