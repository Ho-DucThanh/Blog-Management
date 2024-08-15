const express = require("express");
const ProfileController = require("../Controllers/ProfileController");
const router = express.Router();
const cors = require("cors");
const verifyToken = require("../Middlewares/verifyUser");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
router.post("/profile", ProfileController.createProfile);
router.get("/profile/:user_id", ProfileController.getProfile);

module.exports = router;
