import express from "express";               // import thư viện Express để tạo web server


const app = express(); // khởi tạo ứng dụng Express

app.use(express.json()); //cho phép server đọc dữ liệu JSON từ body của request
 
    
// routes import
import userRouter from './routes/user.route.js'; 
import postRouter from './routes/post.route.js';


// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter)

// example route: http://localhost:4000/api/v1/users/register

// 404 handler (đặt CUỐI CÙNG sau toàn bộ `app.use("/api/...")`):
// - Mục tiêu: khi gọi sai URL/method thì trả JSON thống nhất để Postman/frontend dễ đọc,
//   thay vì trang HTML mặc định kiểu "Cannot POST /...".
// - Lưu ý production: nếu muốn hạn chế lộ thông tin, có thể bỏ `method/path/hint`.
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
    hint: "Try POST /api/v1/posts/create (or /api/v1/routes/create alias)",
  });
});

export default app; // xuất app để index.js có thể dùng để mở server
