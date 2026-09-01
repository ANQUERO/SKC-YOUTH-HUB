export const UPLOAD_LIMITS = Object.freeze({
  maxFiles: 10,
  maxFileSizeBytes: 25 * 1024 * 1024,
  multerFileSizeLimitBytes: 25 * 1024 * 1024 + 1,
  maxFields: 50,
});

const publicLimits = Object.freeze({
  maxFiles: UPLOAD_LIMITS.maxFiles,
  maxFileSizeBytes: UPLOAD_LIMITS.maxFileSizeBytes,
  maxFileSizeMb: 25,
});

export const getUploadErrorResponse = (error) => {
  switch (error?.code) {
    case "LIMIT_FILE_SIZE":
      return {
        status: 413,
        body: {
          code: error.code,
          error: "File is too large",
          message: `Each uploaded file must be ${publicLimits.maxFileSizeMb} MB or smaller.`,
          limits: publicLimits,
        },
      };
    case "LIMIT_FILE_COUNT":
      return {
        status: 413,
        body: {
          code: error.code,
          error: "Too many files",
          message: `You can upload up to ${publicLimits.maxFiles} files at a time.`,
          limits: publicLimits,
        },
      };
    case "LIMIT_UNEXPECTED_FILE":
      return {
        status: 415,
        body: {
          code: error.code,
          error: "Unsupported file type",
          message: "Only images, videos, and PDF documents are supported.",
          limits: publicLimits,
        },
      };
    default:
      if (!error?.code?.startsWith("LIMIT_")) {
        return null;
      }

      return {
        status: 400,
        body: {
          code: error.code,
          error: "Invalid upload",
          message: "The upload does not meet the allowed limits.",
          limits: publicLimits,
        },
      };
  }
};
