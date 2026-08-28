import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  generateTokenAndSetCookies,
  getAuthCookieOptions,
} from "../src/utils/jwt.js";

test("uses cross-site-safe cookie settings in production", () => {
  assert.deepEqual(getAuthCookieOptions("production"), {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
});

test("uses local-development cookie settings outside production", () => {
  assert.deepEqual(getAuthCookieOptions("development"), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
});

test("returns the same signed token that is written to the auth cookie", () => {
  const previousSecret = process.env.JWT_SECRET;
  const previousNodeEnvironment = process.env.NODE_ENV;
  const cookies = [];

  process.env.JWT_SECRET = "test-only-jwt-secret";
  process.env.NODE_ENV = "production";

  try {
    const response = {
      cookie(name, value, options) {
        cookies.push({ name, value, options });
      },
    };
    const user = {
      youth_id: 42,
      email: "youth@example.com",
    };

    const token = generateTokenAndSetCookies(user, response, "youth");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    assert.equal(cookies.length, 1);
    assert.equal(cookies[0].name, "jwt");
    assert.equal(cookies[0].value, token);
    assert.equal(cookies[0].options.sameSite, "none");
    assert.equal(cookies[0].options.secure, true);
    assert.equal(decoded.userType, "youth");
    assert.equal(decoded.youth_id, 42);
    assert.equal(decoded.email, "youth@example.com");
  } finally {
    if (previousSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = previousSecret;
    }

    if (previousNodeEnvironment === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnvironment;
    }
  }
});
