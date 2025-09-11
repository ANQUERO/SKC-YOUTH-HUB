import React, { useState } from "react";
import style from "@styles/newsFeed.module.scss";
import Avatar from "@images/about.png";
import { Image, Send, Video } from "lucide-react";
import { usePostContext } from "@context/PostContext";

export const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fileType, setFileType] = useState(null); // 'image' | 'video'
    const [type, setType] = useState("post");
    const { createPost } = usePostContext();

    const handleFileChange = (e, kind) => {
        const list = Array.from(e.target.files || []);
        if (list.length > 0) {
            setFiles(list);
            setFileType(kind);
        }
    };

    const handlePost = () => {
        if (title.trim() === "" || description.trim() === "") return;

        const newPost = new FormData();
        newPost.append("title", title);
        newPost.append("description", description);
        if (fileType) newPost.append("media_type", fileType);
        files.forEach((f) => newPost.append("media", f));

        createPost.mutate(newPost, {
            onSuccess: () => {
                setTitle("");
                setDescription("");
                setFiles([]);
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

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={style.titleInput}
            />
            <textarea
                placeholder="What's on your mind?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

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
