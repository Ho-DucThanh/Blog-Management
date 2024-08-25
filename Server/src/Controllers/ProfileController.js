const ProfileModel = require("../Models/ProfileModel");
const UserModel = require("../Models/UserModel");
const { parse, isValid } = require("date-fns");

const validateUserName = (userName) => /^[a-zA-Z ]{3,30}$/.test(userName);
const validateDate = (date) => isValid(parse(date, "dd-MM-yyyy", new Date()));
const validateSex = (sex) =>
  ["male", "female", "other"].includes(sex.toLowerCase());
const validatePhone = (phone) => /^0[0-9]{9}$/.test(phone);
const validateAddress = (address) => address.length > 5;

const ProfileController = {
  createProfile: async (req, res) => {
    const { user_id, userName, date, sex, phone, address, avatar } = req.body;

    // Check null
    if (
      ![user_id, userName, date, sex, phone, address, avatar].every(Boolean)
    ) {
      return res
        .status(400)
        .json({ message: "Please complete all information" });
    }

    // Validate each field
    if (!validateUserName(userName))
      return res.status(400).json({ message: "Invalid userName" });
    if (!validateDate(date))
      return res.status(400).json({ message: "Invalid date" });
    if (!validateSex(sex))
      return res.status(400).json({ message: "Invalid sex" });
    if (!validatePhone(phone))
      return res.status(400).json({ message: "Invalid phone number" });
    if (!validateAddress(address))
      return res.status(400).json({ message: "Invalid address" });

    try {
      // Chuyển đổi ngày tháng thành đối tượng Date
      const parsedDate = parse(date, "dd-MM-yyyy", new Date());

      const userExists = await UserModel.findById(user_id);
      if (!userExists)
        return res.status(400).json({ message: "User does not exist" });

      const profileExists = await ProfileModel.findOne({ user_id });
      if (profileExists)
        return res.status(400).json({ message: "Profile already exists" });

      const userNameExists = await ProfileModel.findOne({ userName });
      if (userNameExists)
        return res.status(400).json({ message: "UserName already exists" });

      const newProfile = await ProfileModel.create({
        user_id: user_id,
        userName,
        date: parsedDate,
        sex,
        phone,
        address,
        avatar,
      });

      res.status(201).json({
        message: "Profile created successfully",
        profile: newProfile,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", err });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userProfile = await ProfileModel.findOne({
        user_id: req.params.user_id,
      });
      if (!userProfile)
        return res.status(404).json({ message: "Profile not found" });

      res.status(200).json({ profile: userProfile });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", err });
    }
  },

  updateProfile: async (req, res) => {
    const { userName, date, sex, phone, address, avatar } = req.body;

    try {
      const existingNameProfile = await ProfileModel.findOne({
        userName,
        user_id: { $ne: req.params.user_id }, // Loại trừ chính hồ sơ hiện tại
      });
      if (existingNameProfile) {
        return res.status(400).json({ message: "UserName already exists" });
      }
      const parsedDate = parse(date, "dd-MM-yyyy", new Date());
      if (!isValid(parsedDate)) {
        return res.status(400).json({ message: "Invalid date" });
      }

      const updateProfile = await ProfileModel.findOneAndUpdate(
        { user_id: req.params.user_id },
        { userName, date: parsedDate, sex, phone, address, avatar },
        { new: true }
      );

      if (!updateProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const { ...rest } = updateProfile._doc;
      res.status(200).json(rest);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", err });
    }
  },
};

module.exports = ProfileController;
