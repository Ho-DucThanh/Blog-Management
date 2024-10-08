const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ProfileModel = require("../Models/ProfileModel");

dotenv.config();

let refreshTokens = [];
const AuthController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check email
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z]+\.(com|edu\.vn)$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //   Check password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
      });
      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "1d" }
    );
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const accessToken = AuthController.generateAccessToken(user);

      // Tạo refresh token và lưu vào cookie
      const refreshToken = AuthController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      const { password: pass, ...rest } = user._doc;

      return res.status(200).json({
        message: "Authentication successful",
        accessToken: accessToken,
        user: rest,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token is required" });
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).json("Forbidden");

        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = AuthController.generateAccessToken(user);
        const newRefreshToken = AuthController.generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res
          .status(200)
          .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
    // try {
    //   refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    //   res.clearCookie("refreshToken");

    //   return res.status(200).json({ message: "Logout successful" });
    // } catch (err) {
    //   return res
    //     .status(500)
    //     .json({ message: "Server error", error: err.message });
    // }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await ProfileModel.findOneAndDelete({ user_id: req.params.id });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  ChangePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      // Check login có hợp lệ hay không(chính chủ)
      if (req.user.id !== user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to change password" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid old password" });
      }

      const isOldPasswordSame = await bcrypt.compare(
        newPassword,
        user.password
      ); // Thêm kiểm tra
      if (isOldPasswordSame) {
        return res.status(400).json({
          message: "New password cannot be the same as the old password",
        }); // Thêm thông báo lỗi
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
};

module.exports = AuthController;
