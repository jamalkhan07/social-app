import express from "express";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
} from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// router.use(auth)
router.post("/create", auth, createPost);
router.delete("/delete/:id", auth, deletePost);
router.post("/comment/:id", auth, commentOnPost);
router.put("/like/:id", auth, likeUnlikePost);

router.get("/getAllPosts", auth, getAllPosts);

export default router;
