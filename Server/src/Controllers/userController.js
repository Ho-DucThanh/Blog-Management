const UserModel = require("../Models/UserModel");
const ProfileModel = require("../Models/ProfileModel");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find({ admin: false });
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getAllUsersProfile: async (req, res) => {
    try {
      const nonAdminUsers = await UserModel.find({ admin: false }, "_id email");
      const profiles = await ProfileModel.find({
        user_id: { $in: nonAdminUsers.map((user) => user._id) },
      });

      // Kết hợp thông tin từ UserModel và ProfileModel
      const combinedProfiles = profiles.map((profile) => {
        const user = nonAdminUsers.find(
          (u) => u._id.toString() === profile.user_id.toString()
        );
        return {
          ...profile.toObject(),
          email: user ? user.email : null,
        };
      });

      return res.status(200).json(combinedProfiles);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController;
