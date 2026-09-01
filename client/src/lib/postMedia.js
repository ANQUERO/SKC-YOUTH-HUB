const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v|avi|mkv)(?:$|[?#])/i;

const inferMediaType = (item, url) => {
  if (item?.type === "image" || item?.type === "video") return item.type;
  if (item?.mimetype?.startsWith("video/")) return "video";
  if (item?.mimetype?.startsWith("image/")) return "image";
  if (VIDEO_EXTENSION.test(url) || url.includes("/video/upload/")) {
    return "video";
  }
  return "image";
};

export const normalizePostMedia = (mediaItems = []) => {
  const seen = new Set();

  return mediaItems.reduce((normalized, item) => {
    const url = typeof item === "string" ? item : item?.url;
    if (!url) return normalized;

    const mediaId = typeof item === "string" ? null : item.media_id;
    const key = mediaId == null ? `url:${url}` : `id:${mediaId}`;
    if (seen.has(key)) return normalized;
    seen.add(key);

    normalized.push({
      media_id: mediaId,
      url,
      type: inferMediaType(item, url),
      mimetype: typeof item === "string" ? undefined : item.mimetype,
    });
    return normalized;
  }, []);
};
