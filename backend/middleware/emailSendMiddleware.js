const { transporter } = require("../middleware/emailConfigMiddleware");

const sendForgetPasswordURL = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      text: "Please click the link below to reset your password.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f4f4f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
          <div style="text-align: center; padding: 10px 0;">
              <img src="default.png" alt="Logo" style="max-width: 150px;">
          </div>
          <div style="background-color: #fff; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="color: #555; line-height: 1.6;">
                  We received a request to reset your password. Click the button below to reset it:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #999; font-size: 14px;">
                  <strong>Note:</strong> This link expires in 10 minutes.
              </p>
              <p style="color: #555; line-height: 1.6;">
                  If you did not request this, please ignore this email or contact support if you have concerns.
              </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 12px;">
              © 2025 SESWA Welfare Team. All rights reserved.
          </div>
        </div>
      `,
    });
    console.log("Password reset email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

// Send Welcome Email
const sendRecoveryEmail = async (email, name) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/signin`; // Redirect link
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "Password Reset Successful!",
      text: `Hello, ${name}! Your password has been successfully reset. You can now log in using your new credentials. Go to: ${loginURL}`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #3de84e; font-size: 28px; margin-bottom: 10px; text-align: center;">
            Welcome to SESWA, ${name}!
          </h2>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Your password has been reset successfully. You can now log in using your new credentials.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${loginURL}" style="background-color: #28a745; color: white; text-decoration: none; padding: 12px 20px; font-size: 18px; border-radius: 5px; display: inline-block;">
              Go to Login Page
            </a>
          </div>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-top: 20px;">
            Best Regards,<br>
            <strong style="color: #0fe456;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });

    console.log("Recovery email sent successfully:", response);
  } catch (error) {
    console.error("Error sending recovery email:", error);
  }
};
const sendApprovalEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: process.env.ADMIN_EMAIL,
      subject: "New Admin Signup Approval Request",
      text: `${name} has requested approval for an admin account. Please review and approve if applicable. You can approve from here: [YOUR_APPROVAL_LINK_HERE] or from your admin panel.`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; 
                    border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #1e88e5; font-size: 24px; text-align: center; margin-bottom: 15px;">
            Admin Signup Request
          </h2>
          <p style="color: #555555; font-size: 18px; text-align: center; line-height: 1.6; margin-bottom: 15px;">
            <strong>${name}</strong> has requested to become an admin. If this user should be an admin, 
            please approve their request.
          </p>
          <p style="color: #555555; font-size: 18px; text-align: center; line-height: 1.6; margin-bottom: 15px;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="color: #555555; font-size: 16px; text-align: center; margin-bottom: 15px;">
            You can approve from here or from your admin panel.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="YOUR_APPROVAL_LINK_HERE" target="_blank" 
               style="background-color: #1e88e5; color: #ffffff; padding: 12px 20px; text-decoration: none;
                      font-size: 18px; border-radius: 5px; display: inline-block;">
              Approve Admin
            </a>
          </div>
          <p style="color: #555555; font-size: 16px; text-align: center; margin-top: 20px;">
            Best Regards,<br>
            <strong style="color: #1e88e5;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });

    console.log("Approval email sent successfully", response);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};
const sendApprovedEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "Your Admin Request is Approved!",
      text: `Welcome, ${name}! Your signup request has been approved successfully.`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #1e88e5; font-size: 24px; text-align: center;">
            Welcome to SESWA, ${name}!
          </h2>
          <p style="color: #555555; font-size: 18px; text-align: center;">
            We are excited to have you join SESWA Welfare Organization as an admin.
          </p>
          <p style="color: #555555; font-size: 18px; text-align: center;">
            Best Regards,<br>
            <strong style="color: #1e88e5;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });
    console.log("Approved email sent successfully:", response);
  } catch (error) {
    console.error("Error sending approved email:", error);
  }
};

// Send Rejection Email
const sendApprovalRejectEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "Your Admin Request is Rejected",
      text: `Dear ${name}, your admin request has been rejected by SESWA Welfare Organization.`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #e53935; font-size: 24px; text-align: center;">
            Admin Request Rejected
          </h2>
          <p style="color: #555555; font-size: 18px; text-align: center;">
            Dear ${name}, we regret to inform you that your request to become an admin has been rejected.
          </p>
          <p style="color: #555555; font-size: 18px; text-align: center;">
            If you have any concerns, please contact our support team.
          </p>
          <p style="color: #555555; font-size: 18px; text-align: center;">
            Best Regards,<br>
            <strong style="color: #e53935;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });
    console.log("Rejected email sent successfully:", response);
  } catch (error) {
    console.error("Error sending rejected email:", error);
  }
};
const sendAdminProfileUpdateEmail = async (email, name, contactNumber, address) => {
  try {
    const profileURL = `${process.env.FRONTEND_URL}/profile`; // Profile page link

    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "Profile Updated Successfully!",
      text: `Hello, ${name}! Your profile has been successfully updated. Updated Contact Number: ${contactNumber}, Address: ${address}. You can review your changes here: ${profileURL}`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #3de84e; font-size: 28px; margin-bottom: 10px; text-align: center;">
            Profile Updated Successfully, ${name}!
          </h2>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Your profile information has been successfully updated in the SESWA Welfare System.
          </p>
          <h3 style="color: #333333; text-align: center;">Updated Details:</h3>
          <ul style="list-style: none; padding: 0; text-align: center; font-size: 18px; color: #555555;">
            <li><strong>📞 Contact Number:</strong> ${contactNumber}</li>
            <li><strong>🏠 Address:</strong> ${address}</li>
          </ul>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${profileURL}" style="background-color: #28a745; color: white; text-decoration: none; padding: 12px 20px; font-size: 18px; border-radius: 5px; display: inline-block;">
              Review Profile
            </a>
          </div>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-top: 20px;">
            If you did not make these changes, please contact the SESWA admin team immediately.
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center;">
            Best Regards,<br>
            <strong style="color: #0fe456;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });

    console.log("Profile update email sent successfully:", response);
  } catch (error) {
    console.error("Error sending profile update email:", error);
  }
};


const sendVerificationEmail = async (email, fullName, otp) => {
  try {
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "🔐 Verify Your Email - SESWA Welfare",
      text: `Hello ${fullName},\n\nThank you for registering with SESWA Welfare!\n\nPlease verify your email by entering this OTP:\n\n🔢 Your OTP: ${otp}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nSESWA Welfare Team`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #3de84e; font-size: 28px; margin-bottom: 10px; text-align: center;">
            🔐 Email Verification - SESWA Welfare
          </h2>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Hello <strong>${fullName}</strong>, welcome to SESWA Welfare! Please verify your email by entering the OTP below:
          </p>
          <p style="color: #555555; font-size: 20px; font-weight: bold; text-align: center; background: #f4f4f4; padding: 10px; border-radius: 5px;">
            🔢 Your OTP: <span style="color: #e63946; font-size: 22px;">${otp}</span>
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-top: 20px;">
            Enter this OTP on the verification page to complete your registration.
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center;">
            Best Regards,<br>
            <strong style="color: #0fe456;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });

    console.log(" Verification email with OTP sent successfully:", response);
  } catch (error) {
    console.error(" Error sending verification email with OTP:", error);
  }
};
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/login`; // Login page link
    const response = await transporter.sendMail({
      from: '"SESWA Welfare Team" <i.sksingh113@gmail.com>',
      to: email,
      subject: "✅ Email Verified Successfully – Await Admin Approval!",
      text: `Hello ${fullName},\n\nYour email has been successfully verified! ✅\n\nNow, please wait for admin approval. If you receive an approval confirmation email, you can log in here: ${loginURL}\n\nThank you for being part of SESWA Welfare!\n\nBest Regards,\nSESWA Welfare Team`,
      html: `
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <h2 style="color: #3de84e; font-size: 28px; margin-bottom: 10px; text-align: center;">
            ✅ Email Verified Successfully, ${fullName}!
          </h2>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Your email has been successfully verified in the SESWA Welfare system.
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Now, please wait for admin approval. Once approved, you will receive another confirmation email.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${loginURL}" style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 20px; font-size: 18px; border-radius: 5px; display: inline-block;">
              Login Here
            </a>
          </div>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center; margin-top: 20px;">
            If you have already received the approval email, you can log in using the button above.
          </p>
          <p style="color: #555555; font-size: 18px; line-height: 1.6; text-align: center;">
            Best Regards,<br>
            <strong style="color: #0fe456;">SESWA Welfare Team</strong>
          </p>
        </div>
      `,
    });

    console.log(" Verification success email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification success email:", error);
  }
};


module.exports = {
  sendForgetPasswordURL,
  sendRecoveryEmail,
  sendApprovalEmail,
  sendApprovedEmail,
  sendApprovalRejectEmail,
  sendAdminProfileUpdateEmail,
  sendVerificationEmail,
  sendWelcomeEmail
};
