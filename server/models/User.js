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
    firmName: {
      type: String,
      default: "",
    },
    yearStarted: {
      type: Number,
      default: "",
    },
    cmaLicenseNumber: {
      type: Number,
      default: "",
    },
    assetsUnderManagement: {
      type: Number,
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
      enum: ["notVerified", "verified", "rejected"],
      default: "",
    },
    tripList: {
      type: Array,
      default: [],
    },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
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