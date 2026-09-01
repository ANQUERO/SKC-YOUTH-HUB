import test from "node:test";
import assert from "node:assert/strict";
import {
  POST_UPLOAD_LIMITS,
  validatePostMediaFiles,
} from "../src/lib/postUploadLimits.js";

const mediaFile = ({
  name = "photo.jpg",
  size = 1024,
  type = "image/jpeg",
} = {}) => ({ name, size, type });

test("accepts supported media at the exact size boundary", () => {
  const file = mediaFile({ size: POST_UPLOAD_LIMITS.maxFileSizeBytes });
  assert.equal(validatePostMediaFiles([file]), null);
});

test("identifies an oversized file before upload", () => {
  const file = mediaFile({
    name: "large-video.mp4",
    size: POST_UPLOAD_LIMITS.maxFileSizeBytes + 1,
    type: "video/mp4",
  });

  assert.match(validatePostMediaFiles([file]), /large-video\.mp4.*25 MB/);
});

test("enforces the combined post media count", () => {
  assert.match(
    validatePostMediaFiles([mediaFile(), mediaFile()], 9),
    /up to 10 files/,
  );
});

test("rejects unsupported file types", () => {
  const file = mediaFile({ name: "archive.zip", type: "application/zip" });
  assert.match(validatePostMediaFiles([file]), /not a supported image or video/);
});
