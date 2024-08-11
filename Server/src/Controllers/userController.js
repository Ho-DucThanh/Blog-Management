const UserModel = require("../Models/UserModel");

const UserController = {
  getUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController;
