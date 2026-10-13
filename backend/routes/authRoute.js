import express from "express";

import { signup, login, logout, getMe } from "../controllers/authController.js";

import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/me", auth, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
