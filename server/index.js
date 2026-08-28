import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./src/db/config.js";

dotenv.config();

const PORT = Number.parseInt(process.env.PORT, 10);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

const startServer = () => {
  app
    .listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    })
    .on("error", (error) => {
      console.error("Error starting server:", error);
      process.exit(1);
    });
};

const init = async () => {
  try {
    await initDB();
    startServer();
  } catch (error) {
    console.error("Application initialization failed:", error.message);
    process.exit(1);
  }
};

init().catch((error) => {
  console.error("Fatal error during initialization:", error.message);
  process.exit(1);
});
