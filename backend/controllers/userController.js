import User from "../models/userModel.js";

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
      res.status(200).json({ message: "followed successfuly" });
    }
  } catch (error) {
    console.log("error in following controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};
