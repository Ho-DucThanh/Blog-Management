const CommentModel = require("../Models/CommentModel");

const CommentController = {
  createComment: async (req, res) => {
    try {
      const { content, postId } = req.body;
      const newComment = await CommentModel.create({
        content,
        postId,
        user_id: req.user.id,
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCommentsByPostId: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await CommentModel.find({ postId }).sort({
        createdAt: -1,
      });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCommentsByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const comments = await CommentModel.find({ userId }).sort({
        createdAt: -1,
      });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  likeComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      const userIndex = comment.likes.indexOf(req.user.id);
      if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  editComment: async (req, res) => {
    try {
      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (comment.user_id.toString() !== req.user.id && !req.user.admin) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const editComment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        { content: req.body.content },
        { new: true }
      );
      res.status(200).json(editComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (comment.user_id.toString() !== req.user.id && !req.user.admin) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await comment.deleteOne();
      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 9;
      const sortDirection = req.query.sort === "desc" ? -1 : 1;
      const comments = await CommentModel.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComments = await CommentModel.countDocuments();
      res.status(200).json({ comments, totalComments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CommentController;
