const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String, // Store image URL or file path
    },
    oldPasswords: { type: [String], default: [] },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Initially false, set to true after verification
    },
    isVerified: {
      type: Boolean,
      default: false, // Initially false, set to true after verification
    },
    role: {
      type: String,
      enum: [
        "President",
        "Vice President",
        "Vice President (Ladies)",
        "General Secretary",
        "Assistant General Secretary",
        "Assistant General Secretary (Ladies)",
        "Treasurer",
        "Assistant Treasurer",
        "Cultural Secretary",
        "Assistant Cultural Secretary",
      ],
      required: true,
    },
    verificationCode:String,
    verificationCodeExpiresat:Date,    
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
