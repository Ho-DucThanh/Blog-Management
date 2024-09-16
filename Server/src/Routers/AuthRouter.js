const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../Middlewares/verifyUser");

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refreshToken", AuthController.requestRefreshToken);
router.post("/logout", verifyToken, AuthController.logoutUser);
router.delete(
  "/deleteUser/:id",
  verifyTokenAndAdmin,
  AuthController.deleteUser
);

router.put("/updateUser/:id", verifyToken, AuthController.ChangePassword);

module.exports = router;
