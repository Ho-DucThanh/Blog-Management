const express = require("express");
const { verifyToken } = require("../Middlewares/verifyUser");
const PostController = require("../Controllers/PostController");

const router = express.Router();

router.get("/getAllPost", verifyToken, PostController.getAllPost);
router.get("/getPost", PostController.getPost);
router.get("/getPostByUserId", PostController.getPostByUserId);
router.get(
  "/getPostWithCommentsByUserId",
  PostController.getPostWithCommentsByUserId
);
router.post("/create", verifyToken, PostController.createPost);
router.delete(
  "/deletepost/:postId/:userId",
  verifyToken,
  PostController.deletePost
);
router.put(
  "/updatepost/:postId/:userId",
  verifyToken,
  PostController.updatePost
);

module.exports = router;
