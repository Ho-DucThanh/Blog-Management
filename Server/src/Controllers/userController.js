const UserModel = require("../Models/UserModel");
const ProfileModel = require("../Models/ProfileModel");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
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
      const profiles = await ProfileModel.find();
      return res.status(200).json(profiles);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController;
