const express = require("express");
const CommentController = require("../Controllers/CommentController");
const router = express.Router();
const { verifyToken } = require("../Middlewares/verifyUser");

router.post("/createComment", verifyToken, CommentController.createComment);
router.get(
  "/getCommentsByPostId/:postId",
  CommentController.getCommentsByPostId
);

router.get("/getComments", CommentController.getComments);

router.get("/getAllComments", verifyToken, CommentController.getAllComments);

router.put(
  "/editComment/:commentId",
  verifyToken,
  CommentController.editComment
);

router.put(
  "/likeComment/:commentId",
  verifyToken,
  CommentController.likeComment
);
router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  CommentController.deleteComment
);

router.get(
  "/getPostWithUserComment",
  verifyToken,
  CommentController.getPostWithUserComment
);

module.exports = router;
