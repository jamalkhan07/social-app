import express from "express";
import { signup, login, logout, getMe } from "../controllers/authController.js";

import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/me", auth, getMe);
router.get("/signup", signup);
router.get("/login", login);
router.get("/logout", logout);

export default router;
