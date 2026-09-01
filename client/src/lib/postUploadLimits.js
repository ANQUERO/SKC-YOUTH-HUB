export const POST_UPLOAD_LIMITS = Object.freeze({
  maxFiles: 10,
  maxFileSizeBytes: 25 * 1024 * 1024,
  maxFileSizeMb: 25,
});

const isSupportedMedia = (file) =>
  file?.type?.startsWith("image/") || file?.type?.startsWith("video/");

export const validatePostMediaFiles = (
  selectedFiles,
  existingFileCount = 0,
) => {
  const files = Array.from(selectedFiles || []);

  if (existingFileCount + files.length > POST_UPLOAD_LIMITS.maxFiles) {
    return `You can attach up to ${POST_UPLOAD_LIMITS.maxFiles} files to one post.`;
  }

  const unsupportedFile = files.find((file) => !isSupportedMedia(file));
  if (unsupportedFile) {
    return `${unsupportedFile.name || "The selected file"} is not a supported image or video.`;
  }

  const oversizedFile = files.find(
    (file) => file.size > POST_UPLOAD_LIMITS.maxFileSizeBytes,
  );
  if (oversizedFile) {
    return `${oversizedFile.name || "The selected file"} is larger than ${POST_UPLOAD_LIMITS.maxFileSizeMb} MB.`;
  }

  return null;
};
