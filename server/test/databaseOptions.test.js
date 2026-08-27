import test from "node:test";
import assert from "node:assert/strict";
import { createDatabaseConfig } from "../src/db/options.js";

const baseEnvironment = {
  DB_USER: "app_user",
  DB_HOST: "localhost",
  DB_PASSWORD: "secret",
  DB_NAME: "skc",
};

test("supports the documented database environment names", () => {
  assert.deepEqual(createDatabaseConfig(baseEnvironment), {
    user: "app_user",
    database: "skc",
    host: "localhost",
    port: 5432,
    password: "secret",
  });
});

test("prefers standard names while keeping legacy aliases compatible", () => {
  const config = createDatabaseConfig({
    ...baseEnvironment,
    DB_DATABASE: "preferred",
    DB_PORT: "6543",
    DB_POR: "5432",
  });

  assert.equal(config.database, "preferred");
  assert.equal(config.port, 6543);
});

test("rejects incomplete or invalid database configuration", () => {
  assert.throws(() => createDatabaseConfig({}), /Missing database configuration/);
  assert.throws(
    () => createDatabaseConfig({ ...baseEnvironment, DB_PORT: "invalid" }),
    /valid TCP port/,
  );
});
