const PostModel = require("../Models/PostModel");
const CommentModel = require("../Models/CommentModel");
const NotificationModel = require("../Models/NotificationModel");
const ProfileModel = require("../Models/ProfileModel");
const FollowModel = require("../Models/FollowModel");

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
      const userProfile = await ProfileModel.findOne({ user_id: req.user.id });
      const userName = userProfile ? userProfile.userName : "Unknown User";

      const savePost = await newPost.save();

      // Tạo thông báo cho các người theo dõi
      const followers = await FollowModel.find({ following: req.user.id });
      for (const follower of followers) {
        await NotificationModel.create({
          user_id: req.user.id, // Người dùng A
          user_receive: follower.follower, // Người dùng B
          type: "post",
          message: `Người dùng ${userName} đã đăng một bài viết`,
        });
      }
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

      const user_id = req.user.id;
      // Xóa comment
      await CommentModel.deleteMany({ postId: req.params.postId });

      // Xóa thông báo
      await NotificationModel.deleteMany({ user_id, type: "post" });

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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const startIndex = (page - 1) * limit;
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

      const totalPosts = await PostModel.countDocuments(
        req.query.userId ? { user_id: req.query.userId } : {}
      );

      res.status(200).json({
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getPostByUserId: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const posts = await PostModel.find({ user_id: req.query.userId });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPostWithCommentsByUserId: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const sortDirection = req.query.order === "asc" ? 1 : -1;

      // Define the query object for counting documents
      const query = {
        ...(req.query.userId && { user_id: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [{ title: { $regex: req.query.searchTerm, $options: "i" } }],
        }),
      };

      const posts = await PostModel.find(query) // Use the query object here
        .sort({ updatedAt: sortDirection })
        .limit(limit);

      // Lấy các comment cho các bài post
      const postIds = posts.map((post) => post._id);
      const comments = await CommentModel.find({ postId: { $in: postIds } });

      // Kết hợp bài post với comment
      const postsWithComments = posts.map((post) => ({
        ...post.toObject(),
        comments: comments.filter(
          (comment) => comment.postId.toString() === post._id.toString()
        ),
      }));

      const totalPosts = await PostModel.countDocuments(query); // Now query is defined

      return res.status(200).json({ postsWithComments, totalPosts });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPostByCategory: async (req, res) => {
    try {
      const categories = [
        "Công Nghệ",
        "Sức khỏe",
        "Du lịch",
        "Đời sống",
        "Thể Thao",
      ];
      const posts = await PostModel.find({ category: { $in: categories } });
      const categoryCount = {};

      // Đếm số lượng bài viết theo từng chủ đề
      categories.forEach((category) => {
        categoryCount[category] = 0; // Khởi tạo số lượng cho tất cả các danh mục
      });

      posts.forEach((post) => {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
      });

      // Tìm chủ đề có tổng số bài viết lớn nhất
      const maxCount = Math.max(...Object.values(categoryCount));
      const mostFrequentCategories = Object.keys(categoryCount).filter(
        (category) => categoryCount[category] === maxCount
      );

      return res
        .status(200)
        .json({ categoryCount, mostFrequentCategories, maxCount });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getTopPosts: async (req, res) => {
    try {
      // Lấy tất cả các bài viết
      const posts = await PostModel.find();
      const postIds = posts.map((post) => post._id);

      // Lấy tất cả các comment cho các bài post
      const comments = await CommentModel.find({ postId: { $in: postIds } });

      // Đếm số lượng comment cho mỗi bài post
      const postCommentCount = {};
      comments.forEach((comment) => {
        postCommentCount[comment.postId] =
          (postCommentCount[comment.postId] || 0) + 1;
      });

      // Tạo danh sách các bài post với số lượng comment
      const postsWithCommentCount = posts.map((post) => ({
        ...post.toObject(),
        commentCount: postCommentCount[post._id] || 0,
      }));

      // Sắp xếp các bài post theo số lượng comment giảm dần
      const topPosts = postsWithCommentCount.sort(
        (a, b) => b.commentCount - a.commentCount
      );

      const topN = 5;
      const result = topPosts.slice(0, topN);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = PostController;
