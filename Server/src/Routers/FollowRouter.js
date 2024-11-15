const express = require("express");
const FollowController = require("../Controllers/FollowController");
const { verifyToken } = require("../Middlewares/verifyUser");

const router = express.Router();

router.post("/follow-user", verifyToken, FollowController.followUser);
router.post("/unfollow-user", verifyToken, FollowController.unfollowUser);
router.get("/check-following", verifyToken, FollowController.checkFollowing);
router.get("/get-following/:userId", FollowController.getFollowing);
router.get("/get-followers/:userId", FollowController.getFollowers);
router.get("/get-friends/:userId", FollowController.getFriends);
router.get("/get-user-newsfeed/:userId", FollowController.getUserNewsFeed);
module.exports = router;
