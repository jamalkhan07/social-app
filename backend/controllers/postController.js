import User from "../models/userModel.js";
import Post from "../models/postModel.js";
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

    // if(mongoos.is)

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
