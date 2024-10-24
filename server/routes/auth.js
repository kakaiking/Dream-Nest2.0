const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

/* Multer Configuration */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

/* USER REGISTER */
router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "kraPin", maxCount: 1 },
    { name: "businessCertificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        owners, email, password, firmName, yearStarted,
        cmaLicenseNumber, assetsUnderManagement, physical,
        website, phoneNumber,
      } = req.body;

      const { profileImage, kraPin, businessCertificate } = req.files;

      if (!profileImage || !kraPin || !businessCertificate) {
        return res.status(400).send("All required files must be uploaded.");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists!" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        owners,
        email,
        password: hashedPassword,
        profileImagePath: profileImage[0].path,
        kraPinPath: kraPin[0].path,
        businessCertificatePath: businessCertificate[0].path,
        firmName,
        yearStarted,
        cmaLicenseNumber,
        assetsUnderManagement,
        physical,
        website,
        phoneNumber,
      });

      await newUser.save();
      res.status(200).json({ message: "User registered successfully!", user: newUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Registration failed!", error: err.message });
    }
  }
);

/* USER LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(409).json({ message: "User doesn't exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.email === "admins@gmail.com" },
      process.env.JWT_SECRET
    );

    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
