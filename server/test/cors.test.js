import test from "node:test";
import assert from "node:assert/strict";
import { isLocalDevelopmentOrigin } from "../src/utils/cors.js";

test("accepts Vite development origins on loopback and private networks", () => {
  assert.equal(isLocalDevelopmentOrigin("http://localhost:5173"), true);
  assert.equal(isLocalDevelopmentOrigin("http://127.0.0.1:5173"), true);
  assert.equal(isLocalDevelopmentOrigin("http://10.0.0.41:5173"), true);
  assert.equal(isLocalDevelopmentOrigin("http://192.168.1.20:4173"), true);
});

test("rejects non-local or unexpected development origins", () => {
  assert.equal(isLocalDevelopmentOrigin("https://evil.example:5173"), false);
  assert.equal(isLocalDevelopmentOrigin("http://evil.example:5173"), false);
  assert.equal(isLocalDevelopmentOrigin("http://localhost:3000"), false);
  assert.equal(isLocalDevelopmentOrigin("not-a-url"), false);
});
