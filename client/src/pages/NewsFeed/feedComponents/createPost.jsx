import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import { Image, Send, Video, X } from "lucide-react";
import { usePostContext } from "@context/PostContext";
import useCurrentUser from '@hooks/useCurrentUser';

export const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fileType, setFileType] = useState(null);
    const [type, setType] = useState("post");
    const { createPost } = usePostContext();
    const { userData, profilePicture, loading } = useCurrentUser();

    // Get user display information
    const getUserDisplayInfo = () => {
        if (loading) {
            return {
                name: 'Loading...',
                role: 'Loading...',
                avatar: "/default-avatar.png"
            };
        }

        if (userData) {
            return {
                name: userData.name,
                role: userData.userType === 'official' 
                    ? userData.position || 'Official'
                    : userData.userType === 'youth'
                    ? 'Youth Member'
                    : 'User',
                avatar: profilePicture || `/default-avatar.png`
            };
        }

        return {
            name: 'User',
            role: 'User',
            avatar: "/default-avatar.png"
        };
    };

    const displayInfo = getUserDisplayInfo();

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
        newPost.append("type", type); // Send the selected post type
        if (fileType) newPost.append("media_type", fileType);
        files.forEach((f) => newPost.append("media", f));

        createPost.mutate(newPost, {
            onSuccess: () => {
                setDescription("");
                setFiles([]);
                setFileType(null);
                setType("post");
            },
        });
    };

    return (
        <div className={style.createPost}>
            {/* --- USER INFO --- */}
            <div className={style.userInfo}>
                <img 
                    src={displayInfo.avatar} 
                    alt="avatar" 
                    onError={(e) => {
                        e.target.src = "/default-avatar.png";
                    }}
                />
                <div>
                    <strong>{displayInfo.name}</strong>
                    <p>{displayInfo.role}</p>
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
                    <label>
                        <Image />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileChange(e, "image")}
                            style={{ display: "none" }}
                        />
                    </label>
                    <label>
                        <Video />
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => handleFileChange(e, "video")}
                            style={{ display: "none" }}
                        />
                    </label>
                </div>

                <button onClick={handlePost}>
                    <Send />
                </button>
            </div>
        </div>
    );
};
