import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import Avatar from "@images/about.png";
import { Image, Send, Video, X } from "lucide-react";
import { usePostContext } from "@context/PostContext";

export const CreateAnnouncement = () => {
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fileType, setFileType] = useState(null);
    const { createPost } = usePostContext();

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
        newPost.append("type", "announcement"); // Always set as announcement
        if (fileType) newPost.append("media_type", fileType);
        files.forEach((f) => newPost.append("media", f));

        createPost.mutate(newPost, {
            onSuccess: () => {
                setDescription("");
                setFiles([]);
                setFileType(null);
            },
        });
    };

    return (
        <div className={style.createPost}>
            {/* --- USER INFO --- */}
            <div className={style.userInfo}>
                <img src={Avatar} alt="avatar" />
                <div>
                    <strong>SK Chairman, Lester Q. Cruspero</strong>
                    <p>Official</p>
                </div>

                <div className={style.topBar}>
                    <div className={style.postTypeIndicator}>
                        📢 Announcement
                    </div>
                </div>
            </div>

            {/* --- INPUTS --- */}
            <textarea
                placeholder="Share an important announcement..."
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
