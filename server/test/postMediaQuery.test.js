import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../src/db/config.js";
import {
  getPost,
  index,
  inferMediaType,
} from "../src/controller/post.controller.js";

const createResponse = () => ({
  statusCode: 200,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  },
});

const assertIndependentMediaAggregation = (sql) => {
  assert.match(
    sql,
    /FROM post_media pm\s+WHERE pm\.post_id = p\.post_id\s+AND pm\.deleted_at IS NULL/,
  );
  assert.match(sql, /ORDER BY pm\.display_order ASC, pm\.media_id ASC/);
  assert.doesNotMatch(sql, /LEFT JOIN post_media pm/);
  assert.doesNotMatch(sql, /LEFT JOIN post_comments c/);
  assert.doesNotMatch(sql, /LEFT JOIN post_reactions r/);
};

test("feed query aggregates media independently from engagement rows", async () => {
  let capturedSql = "";
  const queryMock = mock.method(pool, "query", async (sql) => {
    capturedSql = sql;
    return { rows: [] };
  });

  try {
    await index({ user: { userType: "official" } }, createResponse());
    assertIndependentMediaAggregation(capturedSql);
    assert.match(capturedSql, /LEFT JOIN LATERAL/);
  } finally {
    queryMock.mock.restore();
  }
});

test("single-post query uses the same independent media aggregation", async () => {
  let capturedSql = "";
  const queryMock = mock.method(pool, "query", async (sql) => {
    capturedSql = sql;
    return { rows: [] };
  });

  try {
    await getPost(
      { params: { id: "1" }, user: { userType: "official" } },
      createResponse(),
    );
    assertIndependentMediaAggregation(capturedSql);
  } finally {
    queryMock.mock.restore();
  }
});

test("original MIME type takes precedence over ambiguous Cloudinary paths", () => {
  const versionedImage =
    "https://res.cloudinary.com/demo/image/upload/v123/photo";

  assert.equal(inferMediaType(versionedImage, "image/png"), "image");
  assert.equal(
    inferMediaType("https://res.cloudinary.com/demo/video/upload/v123/clip"),
    "video",
  );
});
