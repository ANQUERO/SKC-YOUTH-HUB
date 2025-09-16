import React, { useEffect, useState } from "react";
import style from "@styles/newsFeed.module.scss";
import axiosInstance from "@lib/axios";
import { useNotifications } from "@context/NotificationContext";
import { useAuthContext } from "@context/AuthContext";
import CommentSystem from "@components/CommentSystem";
import PostOptions from "@components/PostOptions";


export const PostCard = ({ post, onPostDeleted }) => {
    const {
        pushNotification,
        hasSeen,
        markItemSeen
    } = useNotifications();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
    const [reactionsCount, setReactionsCount] = useState({
        like: 0,
        heart: 0,
        wow: 0
    });
    const [postHidden, setPostHidden] = useState(false);

    useEffect(() => {
        // Load reactions summary
        axiosInstance.get(`/post/${post.post_id}/reactions`).then(({ data }) => {
            const counts = { like: 0, heart: 0, wow: 0 };
            (data.data || []).forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
            setReactionsCount(counts);
        }).catch(() => { });

        // Periodic polling for officials to generate notifications for unseen reactions
        if (isOfficial) {
            const interval = setInterval(async () => {
                try {
                    const rRes = await axiosInstance.get(`/post/${post.post_id}/reactions`);
                    const reacts = rRes.data?.data || [];
                    reacts.forEach(r => {
                        if (!hasSeen('reactions', r.reaction_id)) {
                            pushNotification({ type: 'reaction', title: 'New reaction', message: `${r.user_name || r.user_type} reacted: ${r.type}` });
                            markItemSeen('reactions', r.reaction_id);
                        }
                    });
                } catch { }
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [post.post_id, isOfficial, hasSeen, markItemSeen, pushNotification]);

    const handleReact = async (type) => {
        try {
            await axiosInstance.post(`/post/${post.post_id}/react`, { type });
            pushNotification({ type: 'reaction', title: 'Reaction added', message: `You reacted: ${type}` });
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

