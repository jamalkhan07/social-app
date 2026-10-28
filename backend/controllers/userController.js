import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

import validator from "validator";

import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("error in   getUserProfile handler", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const modifyUser = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "can not follow own self" });
    }

    if (!modifyUser || !currentUser) {
      return res.status(404).json({ error: "user not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "unfollowed successfuly" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        from: req.user._id,
        to: modifyUser._id,
        type: "follow",
      });
      await newNotification.save();
      res.status(200).json({ message: "followed successfuly" });
    }
  } catch (error) {
    console.log("error in following controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      {
        $sample: { size: 12 },
      },
    ]);

    const filterUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );

    const suggestedUser = filterUsers.slice(0, 4);
    suggestedUser.forEach((user) => (user.password = null));
    res.send(suggestedUser);
  } catch (error) {
    console.log("in suggested user controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const {
    username,
    fullname,
    bio,
    currentPassword,
    profileImg,
    coverImg,
    newPassword,
  } = req.body;

  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "user does not found!" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ error: "password should Strong " });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "both current and new password is require!" });
    }

    if (newPassword) {
      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({ error: "current and new password should not be match" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "current password is wrong!!" });
      }

      const salt = await bcrypt.genSalt(11);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword || user.password;
    }

    // cover and profile image will be remining for later
    if (coverImg) {
    }
    if (profileImg) {
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    await user.save();

    user.password = null;
    res.status(200).json({ message: user });
  } catch (e) {
    console.log("error in updateUser controller  ", e.message);
    res.status(500).json({ error: e.message });
  }
};
