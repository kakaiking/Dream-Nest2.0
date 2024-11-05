const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    owners: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    firmName: {
      type: String,
      default: "",
    },
    yearStarted: {
      type: Number,
      default: null,
    },
    cmaLicenseNumber: {
      type: Number,
      default: null,
    },
    assetsUnderManagement: {
      type: Number,
      default: 0,
    },
    physical: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    kraPinPath: {
      type: String,
      default: "",
    },
    businessCertificatePath: {
      type: String,
      default: "",
    },
    verified: {
      type: String,
      enum: ["Pending Verification", "Verified", "Rejected"],
      default: "Pending Verification",
    },
    tripList: {
      type: Array,
      default: [],
    },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    propertyList: {
      type: Array,
      default: [],
    },
    reservationList: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
