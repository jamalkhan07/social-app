import express from "express";
import { createPost, deletePost } from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// router.use(auth)
router.post("/create", auth, createPost);
router.delete("/delete/:id", auth, deletePost);

export default router;
