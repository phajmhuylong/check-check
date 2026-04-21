import express from "express";               // import thư viện Express để tạo web server


const app = express(); // khởi tạo ứng dụng Express

app.use(express.json()); //cho phép server đọc dữ liệu JSON từ body của request
 
    
import userRouter from "./routes/user.route.js"; // import router của User (chứa các endpoint liên quan đến tài khoản)

app.use("/api/v1/users", userRouter); // gắn tất cả route của User vào đường dẫn /api/v1/users || vd : http:localhost:3000/api/v1/users/register
// Ghi chú: trước đó file này có mount `/api/v1/posts` nhưng lại import nhầm `user.route.js`,
// dễ làm bạn test nhầm endpoint. Khi có post router thật thì import đúng file rồi mount lại.

export default app; // xuất app để index.js có thể dùng để mở server
