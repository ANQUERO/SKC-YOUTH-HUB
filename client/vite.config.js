import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredUrl = env.VITE_API_URL || env.VITE_BACKEND_URL;
  const proxyTarget = configuredUrl
    ? new URL(configuredUrl).origin
    : "http://localhost:4521";

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure(proxy) {
            proxy.on("error", (_error, _request, response) => {
              if (!response.headersSent) {
                response.writeHead(503, {
                  "Content-Type": "application/json",
                });
              }
              response.end(
                JSON.stringify({
                  status: "Error",
                  message: "Backend server is unavailable",
                }),
              );
            });
          },
        },
      },
    },
  };
});
