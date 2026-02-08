import React, { useState, useEffect } from "react";
import style from "@styles/newsFeed.module.scss";
import axiosInstance from "@lib/axios";
import { AuthContextProvider } from "@context/AuthContext";
import CommentSystem from "@components/CommentSystem";
import PostOptions from "@components/PostOptions";
import { MediaGallery } from "Components/MediaGallery";

export const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth, authUser } =
    AuthContextProvider();
  const isSK = isSkSuperAdmin || isSkNaturalAdmin || isSkYouth;
  const [reactionsCount, setReactionsCount] = useState({
    like: 0,
    heart: 0,
    wow: 0,
  });
  const [postHidden, setPostHidden] = useState(post.is_hidden || false);
  const [currentPost, setCurrentPost] = useState(post);

  // Extract author information with proper fallbacks
  const author = currentPost.author || currentPost.official || {};
  const authorName = author.name || "Unknown User";
  const authorRole = author.position || author.official_position || "Official";
  const authorProfilePic = author.profile_picture
    ? author.profile_picture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;

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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    // Return full date for older posts
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
    });
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
            src={authorProfilePic}
            alt={authorName}
            className={style.avatar}
            onError={(e) => {
              // Fallback to initials avatar if image fails to load
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`;
            }}
          />
          <div className={style.authorDetails}>
            <h4 className={style.authorName}>{authorName}</h4>
            <p className={style.authorRole}>{authorRole}</p>
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
            {formatDate(currentPost.created_at || currentPost.time)}
          </span>
          <PostOptions
            post={currentPost}
            onPostDeleted={handlePostDeleted}
            onPostHidden={handlePostHidden}
            onPostUpdated={handlePostUpdated}
          />
        </div>
      </div>

      <p className={style.content}>
        {currentPost.description || currentPost.content}
      </p>

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

      <CommentSystem postId={currentPost.post_id} postAuthor={authorName} />
    </div>
  );
};
