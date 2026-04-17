import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import connectDB from "./config/database.js";

// Nạp biến môi trường theo thứ tự ưu tiên:
// - `.env` ở root (phổ biến khi deploy / chạy local)
// - `backend/.env` (tiện nếu bạn muốn tách riêng backend)
// `override: false` nghĩa là file nạp sau KHÔNG ghi đè biến đã có.
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
];

envPaths.forEach((envPath) => dotenv.config({ path: envPath, override: false }));

const PORT = Number(process.env.PORT) || 3000; // Dung PORT trong env, neu chua co thi mac dinh 3000.

async function startServer() {
  try {
    try {
      // Kết nối DB sớm để phát hiện sai URI ngay khi start.
      await connectDB();
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