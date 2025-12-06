import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import { Image, Send, Video, X } from "lucide-react";
import { usePostContext } from "@context/PostContext";
import useCurrentUser from '@hooks/useCurrentUser';

export const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fileType, setFileType] = useState(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [type, setType] = useState("post");
    const { createPost } = usePostContext();
    const { userData, profilePicture, loading: userLoading } = useCurrentUser();

    const handleFileChange = (e, kind) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            // Add new files to existing ones
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            setFileType(kind);
            
            // Create previews
            const previews = newFiles.map(file => ({
                url: URL.createObjectURL(file),
                type: kind,
                file
            }));
            setFilePreviews([...filePreviews, ...previews]);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = filePreviews.filter((_, i) => i !== index);
        
        setFiles(updatedFiles);
        setFilePreviews(updatedPreviews);
        
        if (updatedFiles.length === 0) {
            setFileType(null);
        }
    };

    const handlePost = () => {
    if (description.trim() === "") return;

    const newPost = new FormData();
    newPost.append("description", description);
    newPost.append("type", type);
    
    // Append all files - backend expects field name "media" for multiple files
    files.forEach((file) => {
        newPost.append("media", file); // Changed from "media[]" to "media"
    });

    createPost.mutate(newPost, {
        onSuccess: () => {
            setDescription("");
            setFiles([]);
            setFilePreviews([]);
            setFileType(null);
            setType("post");
            
            // Revoke object URLs to prevent memory leaks
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
                    <select
                        className={style.postTypeSelect}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="post">Post</option>
                        <option value="announcement">Announcement</option>
                        <option value="activity">Activity</option>
                    </select>
                </div>
            </div>

            {/* --- INPUTS --- */}
            <textarea
                placeholder="What's on your mind?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={style.postTextarea}
            />

            {/* --- PREVIEW SECTION --- */}
          {filePreviews.length > 0 && (
                <div className={style.previewSection}>
                    <div className={style.previewGrid}>
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
                    <div className={style.fileCount}>
                        {filePreviews.length} file{filePreviews.length !== 1 ? 's' : ''} selected
                    </div>
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