import test from "node:test";
import assert from "node:assert/strict";
import {
  UPLOAD_LIMITS,
  getUploadErrorResponse,
} from "../src/utils/uploadLimits.js";

test("defines the enforced upload boundaries", () => {
  assert.equal(UPLOAD_LIMITS.maxFiles, 10);
  assert.equal(UPLOAD_LIMITS.maxFileSizeBytes, 25 * 1024 * 1024);
  assert.equal(
    UPLOAD_LIMITS.multerFileSizeLimitBytes,
    UPLOAD_LIMITS.maxFileSizeBytes + 1,
  );
  assert.equal(UPLOAD_LIMITS.maxFields, 50);
});

test("returns an actionable response for an oversized file", () => {
  const response = getUploadErrorResponse({ code: "LIMIT_FILE_SIZE" });

  assert.equal(response.status, 413);
  assert.equal(response.body.code, "LIMIT_FILE_SIZE");
  assert.match(response.body.message, /25 MB or smaller/);
});

test("returns an actionable response for too many files", () => {
  const response = getUploadErrorResponse({ code: "LIMIT_FILE_COUNT" });

  assert.equal(response.status, 413);
  assert.equal(response.body.code, "LIMIT_FILE_COUNT");
  assert.match(response.body.message, /up to 10 files/);
});

test("does not mislabel unsupported media as a size error", () => {
  const response = getUploadErrorResponse({ code: "LIMIT_UNEXPECTED_FILE" });

  assert.equal(response.status, 415);
  assert.equal(response.body.code, "LIMIT_UNEXPECTED_FILE");
  assert.match(response.body.message, /images, videos, and PDF/);
});

test("ignores errors that are unrelated to upload limits", () => {
  assert.equal(getUploadErrorResponse(new Error("boom")), null);
});
