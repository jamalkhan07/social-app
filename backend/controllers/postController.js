import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";

export const createPost = async (req, res) => {
  try {
    const { text, img } = req.body;

    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "user does not exist!" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "post must have text or image" });
    }

    // if(img){

    // }

    const post = new Post({
      user: userId,
      text,
      img,
    });

    await post.save();
    res.status(201).json({ message: "post created" });
  } catch (error) {
    console.log("error in create post controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "wrong format mongo id" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ error: "post does not exist with geven id" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "u cant delete this post or other users post" });
    }

    // if(post.img){
    //     //delete
    // }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "post deleted successfuly" });
  } catch (error) {
    console.log("error in delete post controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    // console.log(postId);
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "post does not exist!" });

    const comment = { user: userId, text };

    post.comments.push(comment);

    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.log("error in comment on post controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    const isLike = post.likes.includes(userId);

    if (isLike) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      res.status(200).json({ message: "post unliked" });
    } else {
      post.likes.push(userId);

      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();

      res.status(200).json({ message: "post liked" });
    }
  } catch (error) {
    console.log("error in likeUnlike on post controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", " fullname bio profileImg coverImg")
      .populate("likes", "username profileImg -_id");
    //   .select("-password");

    if (!posts) {
      return res.status(200).json({ message: [] });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getAllPost on post controller  ", error.message);
    res.status(500).json({ error: error.message });
  }
};
