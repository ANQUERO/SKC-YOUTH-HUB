import test from "node:test";
import assert from "node:assert/strict";
import { normalizePostMedia } from "../src/lib/postMedia.js";

test("collapses duplicated query rows for the same media id", () => {
  const media = {
    media_id: 3,
    url: "https://example.test/image.jpg",
    type: "image",
  };

  assert.deepEqual(normalizePostMedia([media, { ...media }]), [
    {
      media_id: 3,
      url: media.url,
      type: "image",
      mimetype: undefined,
    },
  ]);
});

test("preserves distinct media records even when their URLs match", () => {
  const url = "https://example.test/image.jpg";
  assert.equal(
    normalizePostMedia([
      { media_id: 1, url, type: "image" },
      { media_id: 2, url, type: "image" },
    ]).length,
    2,
  );
});

test("infers Cloudinary video media without misclassifying versioned images", () => {
  const media = normalizePostMedia([
    "https://res.cloudinary.com/demo/video/upload/v123/clip",
    "https://res.cloudinary.com/demo/image/upload/v123/photo",
  ]);

  assert.equal(media[0].type, "video");
  assert.equal(media[1].type, "image");
});
