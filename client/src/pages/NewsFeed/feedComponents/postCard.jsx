import React, { useEffect, useState } from "react";
import style from "@styles/newsFeed.module.scss";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";
import CommentSystem from "@components/CommentSystem";
import PostOptions from "@components/PostOptions";


export const PostCard = ({ post, onPostDeleted }) => {
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
    const [reactionsCount, setReactionsCount] = useState({
        like: 0,
        heart: 0,
        wow: 0
    });
    const [postHidden, setPostHidden] = useState(false);

        if (!isOfficial) {
        return (
            <div className={style.card}>
                <div className={style.unauthorizedPost}>
                    <p>You need to be an official to view this content.</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        // Load reactions summary
        axiosInstance.get(`/post/${post.post_id}/reactions`).then(({ data }) => {
            const counts = { like: 0, heart: 0, wow: 0 };
            (data.data || []).forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
            setReactionsCount(counts);
        }).catch(() => { });

    }, [post.post_id]);

    const handleReact = async (type) => {
        try {
            await axiosInstance.post(`/post/${post.post_id}/react`, { type });
            setReactionsCount((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveReaction = async () => {
        try {
            await axiosInstance.delete(`/post/${post.post_id}/react`);

            // Reload reactions after removal

            axiosInstance.get(`/post/${post.post_id}/reactions`).then(({ data }) => {
                const counts = { like: 0, heart: 0, wow: 0 };
                (data.data || []).forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
                setReactionsCount(counts);
            }).catch(() => { });

        } catch (e) {
            console.error(e);
        }
    };

    const handlePostDeleted = () => {
        onPostDeleted && onPostDeleted();
    };

    const handlePostHidden = () => {
        setPostHidden(!postHidden);
    };

    if (postHidden) {
        return (
            <div className={style.card}>
                <div className={style.hiddenPost}>
                    <p>This post has been hidden by a moderator.</p>
                </div>
            </div>
        );
    }

    const getPostTypeInfo = (type) => {
        switch (type) {
            case 'announcement':
                return { icon: '📢', label: 'Announcement', color: '#1976d2' };
            case 'activity':
                return { icon: '🎯', label: 'Activity', color: '#f57c00' };
            default:
                return { icon: '📝', label: 'Post', color: '#4caf50' };
        }
    };

    const postTypeInfo = getPostTypeInfo(post.type);

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
                <div className={style.headerActions}>
                    <div className={style.postTypeBadge} style={{ backgroundColor: postTypeInfo.color }}>
                        <span>{postTypeInfo.icon}</span>
                        <span>{postTypeInfo.label}</span>
                    </div>
                    <span className={style.time}>
                        {new Date(post.created_at || post.time).toLocaleString()}
                    </span>
                    <PostOptions
                        post={post}
                        onPostDeleted={handlePostDeleted}
                        onPostHidden={handlePostHidden}
                    />
                </div>
            </div>

            <p className={style.content}>{post.description || post.content}</p>

            {post.media_type === "image" && (
                <img src={post.media_url} alt="Post visual" className={style.postMedia} />
            )}
            {post.media_type === "video" && (
                <video src={post.media_url} controls className={style.postMedia} />
            )}

            <div className={style.actionsRow}>
                <div className={style.actionGroup}>
                    <span className={style.actionIcon} onClick={() => handleReact("like")}>
                        👍 <small>{reactionsCount.like}</small>
                    </span>
                    <span className={style.actionIcon} onClick={() => handleReact("heart")}>
                        ❤️ <small>{reactionsCount.heart}</small>
                    </span>
                    <span className={style.actionIcon} onClick={() => handleReact("wow")}>
                        😮 <small>{reactionsCount.wow}</small>
                    </span>
                </div>

                <div className={style.actionGroup}>
                    <span className={style.actionIcon} onClick={handleRemoveReaction}>↩</span>
                </div>
            </div>

            <CommentSystem
                postId={post.post_id}
                postAuthor={post.author || post.official?.name}
            />

        </div>
    );
};

