const FollowModel = require("../Models/FollowModel");
const ProfileModel = require("../Models/ProfileModel");
const PostModel = require("../Models/PostModel");
const CommentModel = require("../Models/CommentModel");
const NotificationModel = require("../Models/NotificationModel");

const FollowController = {
  followUser: async (req, res) => {
    const { userId, followId } = req.body; // userId là người dùng hiện tại, followId là người dùng được theo dõi
    try {
      if (!userId || !followId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (userId === followId) {
        return res.status(400).json({ error: "Cannot follow yourself" });
      }
      const existingFollow = await FollowModel.findOne({ follower: userId });
      if (existingFollow) {
        // Kiểm tra xem followId đã có trong mảng following chưa
        if (existingFollow.following.includes(followId)) {
          return res.status(409).json({
            error_code: "FOLLOW_ALREADY_EXISTS",
            error: "Follow already exists",
          });
        }
        // Thêm followId vào mảng following
        existingFollow.following.push(followId);
        await existingFollow.save();
      } else {
        // Tạo mới nếu chưa có document nào
        const newFollow = await FollowModel.create({
          follower: userId,
          following: [followId],
        });
        return res.status(200).json(newFollow);
      }
      const userProfile = await ProfileModel.findOne({ user_id: req.user.id });
      const userName = userProfile ? userProfile.userName : "Unknown User";
      await NotificationModel.create({
        user_id: userId,
        user_receive: followId,
        type: "follow",
        message: `${userName} đã theo dõi bạn`,
      });
      res.status(200).json(existingFollow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  unfollowUser: async (req, res) => {
    const { userId, unfollowId } = req.body;
    const tokenUserId = req.user.id;
    try {
      if (!userId || !unfollowId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (userId !== tokenUserId) {
        return res
          .status(403)
          .json({ error_code: "UNAUTHORIZED", error: "Unauthorized action" });
      }
      const existingFollow = await FollowModel.findOne({ follower: userId });
      if (!existingFollow || !existingFollow.following.includes(unfollowId)) {
        return res
          .status(404)
          .json({ error_code: "FOLLOW_NOT_FOUND", error: "Follow not found" });
      }
      // Xóa unfollowId khỏi mảng following
      existingFollow.following = existingFollow.following.filter(
        (id) => id.toString() !== unfollowId
      );
      await NotificationModel.deleteMany({
        user_id: tokenUserId,
        type: "follow",
      });
      await existingFollow.save();
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  checkFollowing: async (req, res) => {
    const { userId } = req.query; // userId là người dùng được kiểm tra
    const tokenUserId = req.user.id; // ID của người dùng hiện tại

    try {
      const existingFollow = await FollowModel.findOne({
        follower: tokenUserId,
      });
      if (!existingFollow) {
        return res.status(200).json({ isFollowing: false }); // Không có theo dõi nào
      }

      const isFollowing = existingFollow.following.includes(userId);
      res.status(200).json({ isFollowing });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowing: async (req, res) => {
    const { userId } = req.params;
    try {
      const followData = await FollowModel.findOne({
        follower: userId,
      }).populate({
        path: "following",
      });
      if (!followData) {
        return res
          .status(404)
          .json({ error_code: "FOLLOW_NOT_FOUND", error: "Follow not found" });
      }
      const followingIds = followData.following.map((user) => user._id); // Extract _id values
      const profiles = await ProfileModel.find({
        user_id: { $in: followingIds },
      }); // Query ProfileModel
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFollowers: async (req, res) => {
    const { userId } = req.params;
    try {
      const followersData = await FollowModel.find({
        following: userId,
      }).populate("follower");
      if (!followersData) {
        return res.status(404).json({
          error_code: "FOLLOWERS_NOT_FOUND",
          error: "No followers found",
        });
      }
      const followersIds = followersData.map((user) => user.follower._id); // Extract _id values
      const profiles = await ProfileModel.find({
        user_id: { $in: followersIds },
      }); // Query ProfileModel
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFriends: async (req, res) => {
    const { userId } = req.params; // userId là người dùng hiện tại
    try {
      const followData = await FollowModel.findOne({
        follower: userId,
      }).populate("following");
      if (!followData) {
        return res.status(404).json({
          error_code: "FOLLOW_NOT_FOUND",
          error: "No following found",
        });
      }

      const followingIds = followData.following.map((user) =>
        user._id.toString()
      ); // Chuyển đổi ObjectId thành chuỗi
      console.log("Following IDs:", followingIds); // Kiểm tra danh sách ID đang theo dõi

      const followersData = await FollowModel.find({
        following: userId,
      }).populate("follower");
      const friends = followersData.filter((follower) =>
        followingIds.includes(follower.follower._id.toString())
      ); // Chuyển đổi ObjectId thành chuỗi để so sánh

      console.log("Friends:", friends); // Kiểm tra danh sách bạn bè

      const friendIds = friends.map((friend) => friend.follower._id);
      const profiles = await ProfileModel.find({ user_id: { $in: friendIds } });

      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserNewsFeed: async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ params
    try {
      const followData = await FollowModel.findOne({ follower: userId });
      if (!followData) {
        return res.status(200).json([]); // Không có người theo dõi nào
      }

      const followingIds = followData.following; // Danh sách ID người dùng đang theo dõi

      // Sắp xếp bài post theo updatedAt gần nhất
      const posts = await PostModel.find({
        user_id: { $in: followingIds },
      })
        .populate("user_id")
        .sort({ updatedAt: -1 }); // {{ edit_1 }}

      // Lấy thông tin profile cho từng post
      const profiles = await ProfileModel.find({
        user_id: { $in: followingIds },
      });

      // Lấy thông tin comment cho từng post
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          // Log the post ID to debug
          console.log(`Fetching comments for post ID: ${post.user_id}`);

          const comments = await CommentModel.find({ postId: post._id }); // Assuming CommentModel exists

          // Log the fetched comments
          // console.log(`Comments for post ID ${post.user_id}:`, comments);

          const userProfile = profiles.find(
            (profile) =>
              profile.user_id.toString() === post.user_id._id.toString()
          );
          return {
            ...post.toObject(), // Chuyển đổi post thành object
            userProfile: userProfile ? userProfile : null, // Thêm thông tin profile
            comments: comments, // Thêm thông tin comment
          };
        })
      );

      res.status(200).json(postsWithComments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = FollowController;
