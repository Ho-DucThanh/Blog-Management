const express = require("express");
const ProfileController = require("../Controllers/ProfileController");
const UserController = require("../Controllers/userController");
const router = express.Router();
const cors = require("cors");
const verifyToken = require("../Middlewares/verifyUser");

router.post("/profile", verifyToken, ProfileController.createProfile);
router.get("/profile/:user_id", verifyToken, ProfileController.getProfile);
router.get("/getAllProfiles", verifyToken, UserController.getAllUsersProfile);

module.exports = router;
