
const Admin = require("../models/AdminModel");
const { sendApprovalEmail, sendRecoveryEmail, sendForgetPasswordURL } = require("../middleware/emailSendMiddleware");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { createTokenForUser } = require("../services/authService");


const handleAdminSignup = async (req, res) => {
  try {
    const {
      fullName,
      address,
      collegeName,
      gender,
      email,
      password,
      contactNumber,
      role,
    } = req.body;
    const profileImageURL = req.file ? req.file.path : "/uploads/default.png";

    if (
      !fullName ||
      !email ||
      !password ||
      !contactNumber ||
      !gender ||
      !role ||
      !collegeName ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }
    const existingAdminByContact = await Admin.findOne({ contactNumber });
if (existingAdminByContact) {
  return res.status(400).json({ message: "Admin with this contact number already exists" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      fullName,
      address,
      collegeName,
      gender,
      email,
      password: hashedPassword,
      oldPasswords: [hashedPassword], 
      profileImageURL,
      contactNumber,
      role,
      isApproved: false,
    });

    await newAdmin.save();
    await sendApprovalEmail(newAdmin.email, newAdmin.fullName);
    res.status(201).json({
      message:
        "Signup successful. Waiting for approval or You should be approved by Admin or who incharge of websites",
      user: newAdmin,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// Admin Signin
const handleAdminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    if (!admin.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Admin approval pending. Contact the PIC or Admin.",
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = createTokenForUser(admin);
    if (!token) {
      throw new Error("Token generation failed");
    }
    return res
      .status(200)
      .json({ message: "Login successful", success: true, token });
  } catch (error) {
    console.error("Error sign-in:", error);
    return res
      .status(401)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const handleAdminLogout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};



const handleAdminForgetPassword = async (req, res) => {
  try {
    const { email } = req.body
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const resetToken = JWT.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendForgetPasswordURL(admin.email, resetLink);
    return res.status(200).json({
      message: "Forget password link sent to your email",
      data: resetLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// Handle Reset Password
const handleAdminResetPassword = async (req, res) => {
    try {
      const { resetToken } = req.params;
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
      const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      // Check if new password matches any previous password
      const isUsedBefore = await Promise.all(
        admin.oldPasswords.map(async (oldHashedPassword) =>
          bcrypt.compare(newPassword, oldHashedPassword)
        )
      );
      if (isUsedBefore.includes(true)) {
        return res.status(400).json({ message: "You cannot use a previous password." });
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update password and keep history (limit history to last 5 passwords)
      admin.oldPasswords.unshift(admin.password); // Store current password before updating
      if (admin.oldPasswords.length > 5) {
        admin.oldPasswords.pop(); // Keep only last 5 passwords
      }
      admin.password = hashedPassword;
      await admin.save();
      await sendRecoveryEmail(admin.email, admin.fullName);
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password: ", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports = {
  handleAdminSignup,
  handleAdminSignin,
  handleAdminLogout,
  handleAdminForgetPassword,
  handleAdminResetPassword
};
