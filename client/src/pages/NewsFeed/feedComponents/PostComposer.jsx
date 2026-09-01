import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  FileText,
  Image,
  LoaderCircle,
  Megaphone,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import style from "@styles/newsFeed.module.scss";
import { usePostContext } from "@context/PostContext";
import { useToast } from "@context/ToastContext";
import useCurrentUser from "@hooks/useCurrentUser";
import {
  POST_UPLOAD_LIMITS,
  validatePostMediaFiles,
} from "@lib/postUploadLimits";

const POST_TYPE_CONFIG = {
  post: {
    label: "Post",
    title: "Create a post",
    helper: "Share an update with your community.",
    placeholder: "What's on your mind?",
    icon: FileText,
    badgeClass: "composerTypePost",
  },
  announcement: {
    label: "Announcement",
    title: "Create an announcement",
    helper: "Share important information with the community.",
    placeholder: "Share an important announcement...",
    icon: Megaphone,
    badgeClass: "composerTypeAnnouncement",
  },
  activity: {
    label: "Activity",
    title: "Create an activity",
    helper: "Share details about an upcoming or completed activity.",
    placeholder: "Share information about an upcoming or past activity...",
    icon: CalendarDays,
    badgeClass: "composerTypeActivity",
  },
};

const getFileFingerprint = (file) =>
  [file.name, file.size, file.type, file.lastModified].join(":");

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PostComposer = ({ fixedType = null }) => {
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedType, setSelectedType] = useState(fixedType || "post");
  const previewUrls = useRef(new Set());
  const { createPost, createPostUpload } = usePostContext();
  const { showError, showWarning } = useToast();
  const { userData, profilePicture, loading: userLoading } = useCurrentUser();

  const postType = fixedType || selectedType;
  const config = POST_TYPE_CONFIG[postType] || POST_TYPE_CONFIG.post;
  const TypeIcon = config.icon;
  const isPosting = createPost.isPending;
  const uploadProgress = createPostUpload?.progress || 0;
  const hasUploadingMedia = Boolean(createPostUpload?.hasMedia);
  const canPost = description.trim() !== "" || attachments.length > 0;
  const totalAttachmentSize = useMemo(
    () =>
      attachments.reduce(
        (total, attachment) => total + attachment.file.size,
        0,
      ),
    [attachments],
  );

  useEffect(() => {
    const urls = previewUrls.current;

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const clearAttachments = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setAttachments([]);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedFiles.length === 0) return;

    const existingFingerprints = new Set(
      attachments.map(({ file }) => getFileFingerprint(file)),
    );
    const uniqueFiles = selectedFiles.filter((file) => {
      const fingerprint = getFileFingerprint(file);
      if (existingFingerprints.has(fingerprint)) return false;
      existingFingerprints.add(fingerprint);
      return true;
    });

    if (uniqueFiles.length !== selectedFiles.length) {
      showWarning("A file that was already selected was skipped.");
    }
    if (uniqueFiles.length === 0) return;

    const validationMessage = validatePostMediaFiles(
      uniqueFiles,
      attachments.length,
    );
    if (validationMessage) {
      showError(validationMessage);
      return;
    }

    const newAttachments = uniqueFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);

      return {
        file,
        previewUrl,
        type: file.type.startsWith("video/") ? "video" : "image",
        fingerprint: getFileFingerprint(file),
      };
    });

    setAttachments((current) => [...current, ...newAttachments]);
  };

  const handleRemoveFile = (fingerprint) => {
    setAttachments((current) => {
      const removed = current.find(
        (attachment) => attachment.fingerprint === fingerprint,
      );
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrls.current.delete(removed.previewUrl);
      }

      return current.filter(
        (attachment) => attachment.fingerprint !== fingerprint,
      );
    });
  };

  const handlePost = () => {
    if (!canPost || isPosting) return;

    const formData = new FormData();
    formData.append("description", description.trim());
    formData.append("type", postType);
    attachments.forEach(({ file }) => formData.append("media", file));

    createPost.mutate(
      { formData },
      {
        onSuccess: () => {
          setDescription("");
          clearAttachments();
          if (!fixedType) setSelectedType("post");
        },
      },
    );
  };

  return (
    <section
      className={`${style.createPost} ${style.postComposer}`}
      aria-label={config.title}
    >
      <header className={style.composerHeader}>
        <div className={style.composerAuthor}>
          <div className={style.composerAvatarWrap}>
            <img
              src={
                profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userData?.name || "User",
                )}&background=2563eb&color=fff`
              }
              alt=""
              className={style.composerAvatar}
            />
            {userLoading && <span className={style.composerAvatarLoading} />}
          </div>
          <div className={style.composerAuthorDetails}>
            <strong>{userData?.name || "User"}</strong>
            <span>{userData?.position || "SK Official"}</span>
          </div>
        </div>

        {fixedType ? (
          <span
            className={`${style.composerTypeBadge} ${style[config.badgeClass]}`}
          >
            <TypeIcon size={16} />
            {config.label}
          </span>
        ) : (
          <label className={style.composerTypeSelectWrap}>
            <span>Post type</span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              disabled={isPosting}
              aria-label="Post type"
            >
              <option value="post">Post</option>
              <option value="announcement">Announcement</option>
              <option value="activity">Activity</option>
            </select>
          </label>
        )}
      </header>

      <div className={style.composerPrompt}>
        <span
          className={`${style.composerPromptIcon} ${style[config.badgeClass]}`}
        >
          <TypeIcon size={20} />
        </span>
        <div>
          <strong>{config.title}</strong>
          <span>{config.helper}</span>
        </div>
      </div>

      <div className={style.composerTextAreaWrap}>
        <textarea
          placeholder={config.placeholder}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isPosting}
          aria-label="Post description"
        />
      </div>

      {attachments.length > 0 && (
        <div className={style.previewSection}>
          <div className={style.previewGrid}>
            {attachments.map((attachment) => (
              <div key={attachment.fingerprint} className={style.previewItem}>
                {attachment.type === "image" ? (
                  <img
                    src={attachment.previewUrl}
                    alt={attachment.file.name}
                    className={style.previewMedia}
                  />
                ) : (
                  <video
                    src={attachment.previewUrl}
                    className={style.previewMedia}
                    controls
                    preload="metadata"
                    aria-label={attachment.file.name}
                  />
                )}
                <button
                  type="button"
                  className={style.removeBtn}
                  onClick={() => handleRemoveFile(attachment.fingerprint)}
                  disabled={isPosting}
                  aria-label={`Remove ${attachment.file.name}`}
                >
                  <X size={16} />
                </button>
                <span
                  className={style.previewFileName}
                  title={attachment.file.name}
                >
                  {attachment.file.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPosting && (
        <div className={style.uploadStatus}>
          <div className={style.uploadStatusText}>
            <span role="status" aria-live="polite">
              {!hasUploadingMedia
                ? "Publishing post..."
                : uploadProgress < 100
                  ? "Uploading media..."
                  : "Processing post..."}
            </span>
            {hasUploadingMedia && (
              <strong aria-hidden="true">{uploadProgress}%</strong>
            )}
          </div>
          {hasUploadingMedia && (
            <div
              className={style.uploadProgress}
              role="progressbar"
              aria-label="Post upload progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={uploadProgress}
            >
              <div
                className={style.uploadProgressBar}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <footer className={style.composerFooter}>
        <div className={style.composerMediaActions}>
          <label className={style.composerMediaButton}>
            <Image size={19} />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isPosting}
            />
          </label>
          <label className={style.composerMediaButton}>
            <Video size={19} />
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileChange}
              disabled={isPosting}
            />
          </label>
          {attachments.length > 0 && (
            <span className={style.composerAttachmentSummary}>
              <Paperclip size={15} />
              {attachments.length} selected,{" "}
              {formatFileSize(totalAttachmentSize)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handlePost}
          className={style.postButton}
          disabled={!canPost || isPosting}
        >
          {isPosting ? (
            <LoaderCircle className={style.loadingIcon} />
          ) : (
            <Send size={18} />
          )}
          {isPosting ? "Posting..." : `Publish ${config.label}`}
        </button>
      </footer>

      <p className={style.uploadLimitsHint}>
        Up to {POST_UPLOAD_LIMITS.maxFiles} images or videos,{" "}
        {POST_UPLOAD_LIMITS.maxFileSizeMb} MB each.
      </p>
    </section>
  );
};
