import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import connectDB from "./config/database.js";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
];

envPaths.forEach((envPath) => dotenv.config({ path: envPath, override: false }));

const PORT = Number(process.env.PORT) || 3000; // Dung PORT trong env, neu chua co thi mac dinh 3000.

async function startServer() {
  try {
    try {
      await connectDB(); // Thu ket noi DB som de biet cau hinh co dung hay khong.
      console.log("Database connected successfully.");
    } catch (error) {
      // Dev van nen mo server de ban test route/local code du DB tam thoi chua truy cap duoc.
      console.error("Database connection failed, starting server without DB:", error.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Thoat han de nodemon tu restart khi file duoc sua.
  }
}

startServer();