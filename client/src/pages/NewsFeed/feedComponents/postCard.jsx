import React from "react";
import style from "@styles/newsFeed.module.scss";

export const PostCard = ({ post }) => {
    return (
        <div className={style.card}>
            <div className={style.header}>
                <div className={style.author}>
                    <img src={post.avatar || "/default-avatar.png"} alt="Author" className={style.avatar} />
                    <div>
                        <h4>{post.author || post.official?.name}</h4>
                        <p>{post.role || post.official?.position}</p>
                    </div>
                </div>
                <span className={style.time}>
                    {new Date(post.created_at || post.time).toLocaleString()}
                </span>
            </div>

            <p className={style.typeTag}>{post.type?.toUpperCase()}</p>
            <p className={style.content}>{post.description || post.content}</p>

            {post.media_type === "image" && (
                <img src={post.media_url} alt="Post visual" className={style.postMedia} />
            )}
            {post.media_type === "video" && (
                <video src={post.media_url} controls className={style.postMedia} />
            )}
        </div>
    );
};
