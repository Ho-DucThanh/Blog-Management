const express = require("express");
const ProfileController = require("../Controllers/ProfileController");
const UserController = require("../Controllers/userController");
const router = express.Router();
const { verifyToken } = require("../Middlewares/verifyUser");

router.post("/profile", verifyToken, ProfileController.createProfile);
router.get("/profile/:user_id", verifyToken, ProfileController.getProfile);
router.put("/profile/:user_id", verifyToken, ProfileController.updateProfile);

router.get("/getAllProfiles", verifyToken, UserController.getAllUsersProfile);
router.get(
  "/getAllUsersProfileNotAdmin",
  verifyToken,
  UserController.getAllUsersProfileNotAdmin
);
router.get("/getAllUsers", verifyToken, UserController.getAllUsers);
router.get(
  "/getUserProfileById/:id",
  verifyToken,
  UserController.getUserProfileById
);

module.exports = router;
