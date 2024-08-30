const PostModel = require("../Models/PostModel");

const PostController = {
  createPost: async (req, res) => {
    if (!req.user.admin)
      return res
        .status(403)
        .json({ message: "You are not authorized to create a post" });

    if (!req.body.title || !req.body.content) {
      return res.status(400).json("Please provide all required fields");
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new PostModel({
      ...req.body,
      slug,
      user_id: req.user.id,
    });
    try {
      const savePost = await newPost.save();
      return res.status(201).json(savePost);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  deletePost: async (req, res) => {
    if (!req.user.admin || req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    try {
      await PostModel.findByIdAndDelete(req.params.postId);
      return res.status(200).json({ message: "The Post deleted successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  updatePost: async (req, res) => {
    if (!req.user.admin || req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
    try {
      const updatePost = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        updatePost,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const posts = await PostModel.find();
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = PostController;
