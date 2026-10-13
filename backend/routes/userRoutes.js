import express from "express";

import {
  followUnfollowUser,
  getUserProfile,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/profile/:username", auth, getUserProfile);
router.post("/follow/:id", followUnfollowUser);
export default router;
