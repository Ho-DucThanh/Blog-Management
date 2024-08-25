const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");
const verifyToken = require("../Middlewares/verifyUser");

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refreshToken", AuthController.requestRefreshToken);
router.post("/logout", verifyToken, AuthController.logoutUser);

module.exports = router;
