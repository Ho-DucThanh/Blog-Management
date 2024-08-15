const express = require("express");
const cors = require("cors");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");
const verifyToken = require("../Middlewares/verifyUser");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refreshToken", AuthController.requestRefreshToken);
router.post("/logout", verifyToken, AuthController.logoutUser);


module.exports = router;
