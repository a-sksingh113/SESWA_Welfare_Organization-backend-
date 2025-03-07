const Admin = require("../models/AdminModel");
const {
  sendApprovalEmail,
  sendRecoveryEmail,
  sendForgetPasswordURL,
  sendApprovedEmail,
  sendApprovalRejectEmail,
  sendAdminProfileUpdateEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../middleware/emailSendMiddleware");
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

    // Restrict certain roles to female candidates
    const femaleOnlyRoles = [
      "Vice President (Ladies)",
      "Assistant General Secretary (Ladies)",
    ];
    if (femaleOnlyRoles.includes(role) && gender.toLowerCase() !== "female") {
      return res.status(400).json({
        message: `Only female candidates can be assigned the role of ${role}.`,
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
      return res
        .status(400)
        .json({ message: "Admin with this contact number already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000+Math.random()*900000).toString();
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
      isVerified:false,verificationCode,   verificationCodeExpiresat:Date.now()+24*60*60*1000

    });

    await newAdmin.save();
      await sendVerificationEmail(newAdmin.email,newAdmin.fullName, verificationCode);
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

const handleVerifyAdminEmail = async (req,res)=>{
  const {code} = req.body;
  try { 
    const admin =  await Admin.findOne({
      verificationCode : code,
      verificationCodeExpiresat:{$gt:Date.now()},
      
    });
    if(!admin){
      return res.status(400).json({ success:false ,message:"invalid or expire verification code"});
    }
    admin.isVerified=true ;
    admin.verificationCode=undefined;
    admin.verificationCodeExpiresat=undefined;
    await admin.save();
    await sendWelcomeEmail( admin.email, admin.fullName);
    await sendApprovalEmail(admin.email, admin.fullName);
    res.json({success:true,message:"email verified successfully",user:admin
  }); 
  }
   catch (error) {
  console.log("error in verifing email",error);
  res.status(500).json({success:false,message:"server error"});
    
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
    if (!admin.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Admin Not verified , Please verify from valid OTP.",
      });
    }
    if (!admin.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Admin approval pending.",
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
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const resetToken = JWT.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendForgetPasswordURL(admin.email, resetLink);
    return res.status(200).json({
      message: "Forget password link sent to your email",
      data: resetLink,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
      return res
        .status(400)
        .json({ message: "You cannot use a previous password." });
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

const getPendingAdminsApproval = async (req, res) => {
  try {
    const pendingAdmins = await Admin.find({ isApproved: false });
    res.status(200).json({ success: true, pendingAdmins });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const handleApproveAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    // Update the isApproved field
    admin.isApproved = true;
    await admin.save();
    // Send approval email
    await sendApprovedEmail(admin.email, admin.fullName);
    res
      .status(200)
      .json({ success: true, message: "Admin approved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleRejectAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    await Admin.findByIdAndDelete(adminId);
    // Send rejection email
    await sendApprovalRejectEmail(admin.email, admin.fullName);
    res
      .status(200)
      .json({ success: true, message: "Admin request rejected successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleUpdateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { contactNumber, address } = req.body;
    console.log("Request Body:", req.body);
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Update contact number
    admin.contactNumber = contactNumber || admin.contactNumber;
    admin.address = address || admin.address;
    // Update profile image if provided
    if (req.file) {
      admin.profileImageURL = req.file.path;
    }
    await admin.save();
    await sendAdminProfileUpdateEmail(
      admin.email,
      admin.fullName,
      admin.contactNumber,
      admin.address
    );
    return res
      .status(200)
      .json({ message: "Profile updated successfully", admin });
  } catch (error) {
    console.error("Error updating admin: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleAdminSignup,
  handleAdminSignin,
  handleAdminLogout,
  handleAdminForgetPassword,
  handleAdminResetPassword,
  handleRejectAdmin,
  handleApproveAdmin,
  getPendingAdminsApproval,
  handleUpdateAdmin,
  handleVerifyAdminEmail,
};
