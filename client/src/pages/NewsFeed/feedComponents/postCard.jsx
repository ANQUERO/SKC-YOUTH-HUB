// Update your PostCard.js to include the updated PostOptions
import React, { useState, useEffect } from "react";
import style from "@styles/newsFeed.module.scss";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";
import CommentSystem from "@components/CommentSystem";
import PostOptions from "@components/PostOptions"; 
import { MediaGallery } from "Components/MediaGallery";

export const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth } = useAuthContext();
  const isSK = isSkSuperAdmin || isSkNaturalAdmin || isSkYouth;
  const [reactionsCount, setReactionsCount] = useState({
    like: 0,
    heart: 0,
    wow: 0,
  });
  const [postHidden, setPostHidden] = useState(post.is_hidden || false);
  const [currentPost, setCurrentPost] = useState(post);

  const mediaItems = currentPost.media || [];

  const allMediaItems = mediaItems.map((item) => ({
    url: item.url,
    type: item.type || (item.mimetype?.includes("image") ? "image" : "video"),
  }));

  const handleReact = async (type) => {
    if (!isSK) return;

    try {
      await axiosInstance.post(`/post/${currentPost.post_id}/react`, { type });
      setReactionsCount((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveReaction = async () => {
    if (!isSK) return;

    try {
      await axiosInstance.delete(`/post/${currentPost.post_id}/react`);

      // Reload reactions after removal
      axiosInstance
        .get(`/post/${currentPost.post_id}/reactions`)
        .then(({ data }) => {
          const counts = { like: 0, heart: 0, wow: 0 };
          (data.data || []).forEach((r) => {
            counts[r.type] = (counts[r.type] || 0) + 1;
          });
          setReactionsCount(counts);
        })
        .catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostDeleted = () => {
    onPostDeleted && onPostDeleted(currentPost.post_id);
  };

  const handlePostHidden = (isHidden) => {
    setPostHidden(isHidden);
  };

  const handlePostUpdated = (updatedPost) => {
    setCurrentPost(updatedPost);
    onPostUpdated && onPostUpdated(updatedPost);
  };

  if (postHidden) {
    return (
      <div className={style.card}>
        <div className={style.hiddenPost}>
          <p>This post has been hidden by a moderator.</p>
          {isSkSuperAdmin || isSkNaturalAdmin ? (
            <PostOptions
              post={currentPost}
              onPostDeleted={handlePostDeleted}
              onPostHidden={handlePostHidden}
              onPostUpdated={handlePostUpdated}
            />
          ) : null}
        </div>
      </div>
    );
  }

  const getPostTypeInfo = (type) => {
    switch (type) {
      case "announcement":
        return { icon: "📢", label: "Announcement", color: "#1976d2" };
      case "activity":
        return { icon: "🎯", label: "Activity", color: "#f57c00" };
      default:
        return { icon: "📝", label: "Post", color: "#4caf50" };
    }
  };

  const postTypeInfo = getPostTypeInfo(currentPost.type);

  useEffect(() => {
    axiosInstance
      .get(`/post/${currentPost.post_id}/reactions`)
      .then(({ data }) => {
        const counts = { like: 0, heart: 0, wow: 0 };
        (data.data || []).forEach((r) => {
          counts[r.type] = (counts[r.type] || 0) + 1;
        });
        setReactionsCount(counts);
      })
      .catch(() => {});
  }, [currentPost.post_id, isSK]);

  return (
    <div className={style.card} id={`post-${currentPost.post_id}`}>
      <div className={style.header}>
        <div className={style.author}>
          <img
            src={currentPost.avatar || "/default-avatar.png"}
            alt="Author"
            className={style.avatar}
          />
          <div>
            <h4>{currentPost.author || currentPost.official?.name}</h4>
            <p>{currentPost.role || currentPost.official?.position}</p>
          </div>
        </div>
        <div className={style.headerActions}>
          <div
            className={style.postTypeBadge}
            style={{ backgroundColor: postTypeInfo.color }}
          >
            <span>{postTypeInfo.icon}</span>
            <span>{postTypeInfo.label}</span>
          </div>
          <span className={style.time}>
            {new Date(currentPost.created_at || currentPost.time).toLocaleString()}
          </span>
          <PostOptions
            post={currentPost}
            onPostDeleted={handlePostDeleted}
            onPostHidden={handlePostHidden}
            onPostUpdated={handlePostUpdated}
          />
        </div>
      </div>

      <p className={style.content}>{currentPost.description || currentPost.content}</p>

      {allMediaItems.length > 0 && <MediaGallery mediaItems={allMediaItems} />}

      <div className={style.actionsRow}>
        <div className={style.actionGroup}>
          <span
            className={style.actionIcon}
            onClick={() => handleReact("like")}
          >
            👍 <small>{reactionsCount.like}</small>
          </span>
          <span
            className={style.actionIcon}
            onClick={() => handleReact("heart")}
          >
            ❤️ <small>{reactionsCount.heart}</small>
          </span>
          <span className={style.actionIcon} onClick={() => handleReact("wow")}>
            😮 <small>{reactionsCount.wow}</small>
          </span>
        </div>

        <div className={style.actionGroup}>
          <span className={style.actionIcon} onClick={handleRemoveReaction}>
            ↩
          </span>
        </div>
      </div>

      <CommentSystem
        postId={currentPost.post_id}
        postAuthor={currentPost.author || currentPost.official?.name}
      />
    </div>
  );
};