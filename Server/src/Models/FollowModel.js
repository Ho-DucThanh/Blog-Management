const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Người theo dõi
      required: true,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Người được theo dõi
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const FollowModel = mongoose.model("Follow", followSchema);

module.exports = FollowModel;
