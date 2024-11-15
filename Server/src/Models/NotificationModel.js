const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người gửi thông báo
    user_receive: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người nhận thông báo
    type: { type: String, required: true }, // loại thông báo
    message: { type: String, required: true }, // nội dung thông báo
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
