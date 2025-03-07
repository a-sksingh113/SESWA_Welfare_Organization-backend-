const express = require("express");
const {
  handleAdminSignup,
  handleAdminSignin,
  handleAdminLogout,
  handleAdminForgetPassword,
  handleAdminResetPassword,
  getPendingAdminsApproval,
  handleApproveAdmin,
  handleRejectAdmin,
  handleUpdateAdmin,
  handleVerifyAdminEmail,
} = require("../controllers/adminController");
const upload = require("../config/cloudinaryConfig");
const checkForAuthenticationCookie = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();
router.post("/signup", upload.single("profileImageURL"), handleAdminSignup);
router.post("/signin", handleAdminSignin);
router.post("/logout", handleAdminLogout);
router.post("/forget-password", handleAdminForgetPassword);
router.post("/reset-password/:resetToken", handleAdminResetPassword);
router.post("/verify-email",handleVerifyAdminEmail)
router.put(
    "/updateProfile/:adminId",
    checkForAuthenticationCookie("token"),
    authorizeRoles([
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
    ]),
    handleUpdateAdmin
  );
router.get(
  "/dashboard/pending-approvals",
  checkForAuthenticationCookie("token"),
  authorizeRoles([
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
  ]),
  getPendingAdminsApproval
);
router.put(
  "/dashboard/approve/:adminId",
  checkForAuthenticationCookie("token"),
  authorizeRoles([
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
  ]),
  handleApproveAdmin
);
router.delete(
  "/dashboard/reject/:adminId",
  checkForAuthenticationCookie("token"),
  authorizeRoles([
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
  ]),
  handleRejectAdmin
);

module.exports = router;
