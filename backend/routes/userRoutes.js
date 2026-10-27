import express from "express";

import {
  followUnfollowUser,
  getUserProfile,
  suggestedUsers,
  updateUser,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.use(auth);

router.get("/profile/:username", getUserProfile);
router.post("/follow/:id", followUnfollowUser);
router.get("/suggested", suggestedUsers);
router.patch("/updateUser", updateUser);
export default router;
