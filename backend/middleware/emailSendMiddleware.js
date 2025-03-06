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


module.exports = {
  sendForgetPasswordURL,
  sendRecoveryEmail,
  sendApprovalEmail,
  sendApprovedEmail,
  sendApprovalRejectEmail,
 
};
