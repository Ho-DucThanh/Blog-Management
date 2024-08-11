const express = require("express");
const ProfileController = require("../Controllers/ProfileController");
const router = express.Router();

router.post("/profile", ProfileController.createProfile);

module.exports = router;
