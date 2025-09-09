import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import Avatar from "@images/about.png";
import { Image, Send, Video } from "lucide-react";
import { usePostContext } from "@context/PostContext";

export const CreatePost = () => {
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [type, setType] = useState("post");
    const { createPost } = usePostContext();

    const handleFileChange = (e, kind) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setFileType(kind);
        }
    };

    const handlePost = () => {
        if (content.trim() === "") return;

        const newPost = new FormData();
        newPost.append("title", content);
        newPost.append("description", content);
        newPost.append("type", type);
        if (file) {
            newPost.append("media", file);
            newPost.append("media_type", fileType);
        }

        createPost.mutate(newPost, {
            onSuccess: () => {
                setContent("");
                setFile(null);
                setFileType(null);
                setType("post");
            },
        });
    };

    return (
        <div className={style.createPost}>
            <div className={style.userInfo}>
                <img src={Avatar} alt="avatar" />
                <div>
                    <strong>SK Chairman, Lester Q. Cruspero</strong>
                    <p>Official</p>
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

            <textarea
                placeholder="What's your announcement..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className={style.actions}>
                <div className={style.files}>
                    <label>
                        <Image />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "image")}
                            style={{ display: "none" }}
                        />
                    </label>
                    <label>
                        <Video />
                        <input
                            type="file"
                            accept="video/*"
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
