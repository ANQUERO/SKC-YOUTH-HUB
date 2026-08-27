export const getApiBaseUrl = (env = {}) => {
  // In development, keep browser requests same-origin and let Vite proxy /api.
  // This avoids CORS and cookie-domain mismatches between localhost, 127.0.0.1,
  // and local-network URLs.
  if (env.DEV && !env.VITE_API_URL) return "/api";

  const configuredUrl = env.VITE_API_URL || env.VITE_BACKEND_URL;
  if (!configuredUrl) return "/api";

  const normalized = configuredUrl.trim().replace(/\/$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
