const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) return res.status(403).json("Forbidden");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Invalid access token" });
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this user" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
