const PostModel = require("../Models/PostModel");

const PostController = {
  createPost: async (req, res) => {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json("Please provide all required fields");
    }

    const slugBase = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${slugBase}-${uniqueSuffix}`;

    const newPost = new PostModel({
      ...req.body,
      slug,
      user_id: req.user.id,
    });
    try {
      const savePost = await newPost.save();
      return res.status(201).json(savePost);
    } catch (err) {
      console.error("Error saving post:", err);
      return res.status(500).json(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (!req.user.admin && req.user.id !== post.user_id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this post" });
      }

      await PostModel.findByIdAndDelete(req.params.postId);
      return res.status(200).json({ message: "The Post deleted successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  updatePost: async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (!req.user.admin && req.user.id !== post.user_id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this post" });
      }

      const slugBase = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      const slug = `${slugBase}-${uniqueSuffix}`;

      const updatePost = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
            slug,
          },
        },
        { new: true }
      );
      return res.status(200).json(updatePost);
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
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const posts = await PostModel.find({
        ...(req.query.userId && { user_id: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [{ title: { $regex: req.query.searchTerm, $options: "i" } }],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

      const totalPosts = await PostModel.countDocuments();

      res.status(200).json({
        posts,
        totalPosts,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = PostController;
