import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import { Image, Send, Video, X } from "lucide-react";
import { usePostContext } from "@context/PostContext";
import useCurrentUser from "@hooks/useCurrentUser";

export const CreateActivity = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState(null);
  const { createPost } = usePostContext();
  const { userData, profilePicture, loading: userLoading } = useCurrentUser();

  const handleFileChange = (e, kind) => {
    const list = Array.from(e.target.files || []);
    if (list.length > 0) {
      setFiles(list);
      setFileType(kind);
    }
  };

  const handleRemoveFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length === 0) setFileType(null);
  };

const handlePost = () => {
    if (description.trim() === "") return;

    const newPost = new FormData();
    newPost.append("description", description);
    newPost.append("type", "activity"); // Always set as activity
    
    // Append all files
    files.forEach((file) => {
        newPost.append("media", file); // Use "media" not "media[]"
    });

    createPost.mutate(newPost, {
        onSuccess: () => {
            setDescription("");
            setFiles([]);
            setFilePreviews([]);
            setFileType(null);
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
          <div className={style.postTypeIndicator}>🎯 Activity</div>
        </div>
      </div>

      {/* --- INPUTS --- */}
      <textarea
        placeholder="Share information about an upcoming or past activity..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={style.postTextarea}
      />

      {/* --- PREVIEW SECTION --- */}
      {files.length > 0 && (
        <div className={style.previewSection}>
          {files.map((file, idx) => (
            <div key={idx} className={style.previewItem}>
              {fileType === "image" ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className={style.previewMedia}
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
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