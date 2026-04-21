import dotenv from "dotenv";   // thư viện đọc file .env để nạp biến môi trường
import path from "path";        // thư viện xử lý đường dẫn file
import app from "./app.js";     // import ứng dụng Express đã cấu hình
import connectDB from "./config/database.js"; // import hàm kết nối MongoDB

// Nạp biến môi trường theo thứ tự ưu tiên:
// - `.env` ở root (phổ biến khi deploy / chạy local)
// - `backend/.env` (tiện nếu bạn muốn tách riêng backend)
// `override: false` nghĩa là file nạp sau KHÔNG ghi đè biến đã có.
const envPaths = [
  path.resolve(process.cwd(), ".env"),          // đường dẫn tới .env ở thư mục gốc dự án
  path.resolve(process.cwd(), "backend/.env"),  // đường dẫn tới .env trong thư mục backend
];

// duyệt qua từng đường dẫn và nạp file .env tương ứng
envPaths.forEach((envPath) => dotenv.config({ path: envPath, override: false }));

// lấy PORT từ biến môi trường, nếu không có thì dùng cổng 3000 mặc định
const PORT = Number(process.env.PORT) || 3000;

// hàm bất đồng bộ khởi động toàn bộ server
async function startServer() {
  try {
    try {
      // kết nối DB sớm để phát hiện sai URI ngay khi khởi động
      await connectDB();
      console.log("Database connected successfully.");
    } catch (error) {
      // nếu DB lỗi, vẫn mở server để có thể test các route không cần DB
      console.error("Database connection failed, starting server without DB:", error.message);
    }

    // bắt đầu lắng nghe kết nối trên PORT đã chọn
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // nếu có lỗi nghiêm trọng không thể khởi động server
    console.error("Failed to start server:", error);
    process.exit(1); // thoát tiến trình để nodemon tự restart khi file được sửa
  }
}

startServer(); // gọi hàm để khởi động server
