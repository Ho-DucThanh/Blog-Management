const NotificationModel = require("../Models/NotificationModel");

const NotificationController = {
  getNotifications: async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const notifications = await NotificationModel.find({
        user_receive: userId,
      })
        .sort({ createdAt: -1 })
        .limit(5);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = NotificationController;
