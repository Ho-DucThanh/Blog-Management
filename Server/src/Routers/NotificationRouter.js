const express = require("express");
const router = express.Router();
const NotificationController = require("../Controllers/NotificationController");

router.get(
  "/getNotifications/:userId",
  NotificationController.getNotifications
);

module.exports = router;
