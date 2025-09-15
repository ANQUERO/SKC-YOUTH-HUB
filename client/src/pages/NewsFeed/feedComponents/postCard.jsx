import React, { useEffect, useState } from "react";
import style from "@styles/newsFeed.module.scss";
import axiosInstance from "@lib/axios";
import { useNotifications } from "@context/NotificationContext";
import { useAuthContext } from "@context/AuthContext";


export const PostCard = ({ post }) => {
    const {
        pushNotification,
        hasSeen,
        markItemSeen
    } = useNotifications();
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isOfficial = isSkSuperAdmin || isSkNaturalAdmin;
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [comments, setComments] = useState([]);
    const [reactionsCount, setReactionsCount] = useState({
        like: 0,
        heart: 0,
        wow: 0
    });

    useEffect(() => {

        // Load comments
        axiosInstance.get(`/post/${post.post_id}/comments`).then(({ data }) => {
            setComments(data.data || []);
        }).catch(() => { });

        // Load reactions summary
        axiosInstance.get(`/post/${post.post_id}/reactions`).then(({ data }) => {
            const counts = { like: 0, heart: 0, wow: 0 };
            (data.data || []).forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
            setReactionsCount(counts);
        }).catch(() => { });

        // Periodic polling for officials to generate notifications for unseen youth comments/reactions
        if (isOfficial) {
            const interval = setInterval(async () => {
                try {
                    const [cRes, rRes] = await Promise.all([
                        axiosInstance.get(`/post/${post.post_id}/comments`),
                        axiosInstance.get(`/post/${post.post_id}/reactions`)
                    ]);
                    const newComments = cRes.data?.data || [];
                    const flat = (list) => list.flatMap(c => [c, ...(Array.isArray(c.replies) ? flat(c.replies) : [])]);
                    flat(newComments).forEach(c => {
                        if (!hasSeen('comments', c.comment_id)) {
                            pushNotification({ type: 'comment', title: 'New comment', message: c.content?.slice(0, 80) || '' });
                            markItemSeen('comments', c.comment_id);
                        }
                    });
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

    const handleComment = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);
        try {
            await axiosInstance.post(`/post/${post.post_id}/comments`, { content: comment.trim() });
            setComment("");
            pushNotification({ type: 'comment', title: 'Comment posted', message: 'Your comment was posted.' });
            // Reload comments
            axiosInstance.get(`/post/${post.post_id}/comments`).then(({ data }) => {
                setComments(data.data || []);
            }).catch(() => { });
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/post/${post.post_id}`);
            pushNotification({ type: 'post', title: 'Post deleted', message: 'Post has been deleted.' });
        } catch (e) {
            console.error(e);
        }
    };

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
                    {isOfficial && (
                        <span className={style.actionIcon} onClick={handleDelete}>🗑️</span>
                    )}
                </div>
            </div>


            <div className={style.commentBox}>

                <div className={style.box}>
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        disabled={submitting}
                    />

                    <button onClick={handleComment} disabled={submitting || !comment.trim()}>Comment</button>
                </div>

            </div>

            {comments.length > 0 && (
                <div className={style.commentsList}>
                    {comments.map((c) => (
                        <NestedComment key={c.comment_id} postId={post.post_id} comment={c} onChanged={() => {
                            axiosInstance.get(`/post/${post.post_id}/comments`).then(({ data }) => {
                                setComments(data.data || []);
                            }).catch(() => { });
                        }} />
                    ))}
                </div>
            )}

        </div>
    );
};

const NestedComment = ({ postId, comment, onChanged }) => {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showReplies, setShowReplies] = useState(true);

    const submitReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await axiosInstance.post(`/post/${postId}/comments`, { content: replyContent.trim(), parent_comment_id: comment.comment_id });
            setReplyContent("");
            setReplyOpen(false);
            onChanged && onChanged();
        } catch (e) { console.error(e); }
    };

    return (
        <div className={style.commentItem}>
            <div className={style.commentHeader}>
                <strong>{comment.user_name || comment.user_type}</strong>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>

            <div>{comment.content}</div>

            <div style={{ marginTop: "0.25rem" }}>
                <button onClick={() => setReplyOpen((v) => !v)}>Reply</button>
            </div>

            {replyOpen && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button onClick={submitReply} disabled={!replyContent.trim()}>
                        Send
                    </button>
                </div>
            )}

            {/* Only show toggle button if there are replies */}
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <>
                    <button className={style.toggleReplies} onClick={() => setShowReplies((v) => !v)}>
                        {showReplies
                            ? `Hide ${comment.replies.length} repl${comment.replies.length > 1 ? "ies" : "y"}`
                            : `View ${comment.replies.length} repl${comment.replies.length > 1 ? "ies" : "y"}`}
                    </button>
                    {showReplies && (
                        <div className={style.replies}>
                            {comment.replies.map((child) => (
                                <NestedComment
                                    key={child.comment_id}
                                    postId={postId}
                                    comment={child}
                                    onChanged={onChanged}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
