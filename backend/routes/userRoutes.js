import express from "express";

import {
  followUnfollowUser,
  getUserProfile,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.use(auth);
router.get("/profile/:username", getUserProfile);
router.post("/follow/:id", followUnfollowUser);

export default router;
