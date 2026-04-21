import { Router } from "express"; // import Router từ Express để tạo nhóm route riêng
import { login, logout, register } from "../controllers/user.controller.js"; // import hàm xử lý đăng ký

const router = Router(); // tạo một router mới — đây là nơi khai báo các endpoint cho User

// POST /api/users/register → gọi hàm register trong controller để xử lý đăng ký tài khoản
router.route("/register").post(register); 
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router; // xuất router để app.js gắn vào server
