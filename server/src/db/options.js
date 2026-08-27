export const createDatabaseConfig = (env = {}) => {
  const database = env.DB_DATABASE || env.DB_NAME;
  const rawPort = env.DB_PORT || env.DB_POR;
  const missing = [
    ["DB_USER", env.DB_USER],
    ["DB_HOST", env.DB_HOST],
    ["DB_PASSWORD", env.DB_PASSWORD],
    ["DB_DATABASE or DB_NAME", database],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing database configuration: ${missing.join(", ")}`);
  }

  const port = rawPort ? Number.parseInt(rawPort, 10) : 5432;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT must be a valid TCP port");
  }

  return {
    user: env.DB_USER,
    database,
    host: env.DB_HOST,
    port,
    password: env.DB_PASSWORD,
  };
};
