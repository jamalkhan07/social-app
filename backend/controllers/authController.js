import validator from "validator";

import bcrypt from "bcryptjs";

import { genrateAuthTokenAndSetCookie } from "../lib/utils/genAuthToken.js";
import User from "../models/userModel.js";

export const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, username, fullname } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "invalid email " });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "username is already taken" });
    }
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "email is already in use" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "password is too weak" });
    }

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      fullname,
      password: hashedPassword,
    });

    if (newUser) {
      genrateAuthTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      });

      console.log(newUser);
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    const isPasswordOk = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordOk) {
      return res.status(400).json({ error: "invalid credentials" });
    }

    genrateAuthTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "logout seccessfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json(user);
  } catch (error) {
    console.log("error in getMe controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
