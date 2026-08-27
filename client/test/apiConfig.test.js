import test from "node:test";
import assert from "node:assert/strict";
import { getApiBaseUrl } from "../src/lib/apiConfig.js";

test("uses the Vite proxy when no API URL is configured", () => {
  assert.equal(getApiBaseUrl({}), "/api");
});

test("uses the Vite proxy for legacy development configuration", () => {
  assert.equal(
    getApiBaseUrl({
      DEV: true,
      VITE_BACKEND_URL: "http://localhost:4521/api",
    }),
    "/api",
  );
});

test("normalizes configured API origins and paths", () => {
  assert.equal(
    getApiBaseUrl({ VITE_API_URL: "http://localhost:4521/" }),
    "http://localhost:4521/api",
  );
  assert.equal(
    getApiBaseUrl({ VITE_BACKEND_URL: "https://example.test/api" }),
    "https://example.test/api",
  );
});
