import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;

    if (!token) {
      res.status(401).json({ error: "unauthorized: no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(401).json({ error: "unauthorized: invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-passord");

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    res.json({ error: e.message });
  }
};
