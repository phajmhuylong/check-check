import { Router } from "express"; // Gom nhóm endpoint theo module (Post)
import { createPost } from "../controllers/post.controller.js"; // handler tạo bài viết
import { getPosts } from "../controllers/post.controller.js"; // handler lấy bài viết
import { updatePost } from "../controllers/post.controller.js"; // handler cập nhật bài viết
import { deletePost } from "../controllers/post.controller.js"; // handler xóa bài viết


const router = Router();

// POST /api/v1/posts/create
router.route("/create").post(createPost);
router.route("/getPosts").get(getPosts);
router.route("/update/:id").patch(updatePost);
router.route("/delete/:id").delete(deletePost);

export default router;
