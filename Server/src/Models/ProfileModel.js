const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/330/731/original/avatar-icon-profile-icon-member-login-isolated-login-icons-profile-icons-free-vector.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const ProfileModel = mongoose.model("Profiles", profileSchema);

module.exports = ProfileModel;
