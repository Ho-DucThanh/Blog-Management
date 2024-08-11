const ProfileModel = require("../Models/ProfileModel");
const { parse, isValid } = require("date-fns");

// Check UserName
const validateUserName = (userName) => {
  const regex = /^[a-zA-Z ]{3,30}$/;
  return regex.test(userName);
};

// Check date
const validateDate = (date) => {
  const parsedDate = parse(date, "dd-MM-yyyy", new Date());
  return isValid(parsedDate);
};

// Check Sex
const validateSex = (sex) => {
  const validSexes = ["male", "female", "other"];
  const normalizedSex = sex.toLowerCase();
  return validSexes.includes(normalizedSex);
};

// Check Role
const validateRole = (role) => {
  const validRoles = ["student", "tutor"];
  const normalizedRole = role.toLowerCase();
  return validRoles.includes(normalizedRole);
};

const validatePhone = (phone) => {
  const regex = /^0[0-9]{9}$/;
  return regex.test(phone);
};

const validateAddress = (address) => {
  return address.length > 5;
};

const ProfileController = {
  createProfile: async (req, res) => {
    const { userId, userName, date, sex, role, phone, address, avatar } =
      req.body;

    // Check null
    if (!userId || !userName || !date || !sex || !role || !phone || !address) {
      return res
        .status(400)
        .json({ message: "Please complete all information" });
    }

    // Validate each field
    if (!validateUserName(userName)) {
      return res.status(400).json({ message: "Invalid userName" });
    }

    if (!validateDate(date)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (!validateSex(sex)) {
      return res.status(400).json({ message: "Invalid sex" });
    }

    if (!validateRole(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Invalid address" });
    }

    try {
      // Chuyển đổi ngày tháng thành đối tượng Date
      const parsedDate = parse(date, "dd-MM-yyyy", new Date());
      if (!isValid(parsedDate)) {
        return res.status(400).json({ message: "Invalid date" });
      }

      const existingProfile = await ProfileModel.findOne({ user_id: userId });
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const existingNameProfile = await ProfileModel.findOne({ userName });
      if (existingNameProfile) {
        return res.status(400).json({ message: "UserName already exists" });
      }

      const newProfile = new ProfileModel({
        user_id: userId,
        userName,
        date: parsedDate,
        sex,
        role,
        phone,
        address,
        avatar,
      });

      await newProfile.save();
      res
        .status(201)
        .json({ message: "Profile created successfully", newProfile });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", err });
    }
  },
};

module.exports = ProfileController;
