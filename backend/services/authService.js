const JWT = require("jsonwebtoken");
function createTokenForUser(user) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }
    const payload = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageURL: user.profileImageURL,
      role: user.role,
      contactNumber:user.contactNumber,
      isApproved:user.isApproved,
      address:user.address,
      gender:user.gender,
      collegeName:user.collegeName
    };
    return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (error) {
    console.error("error creating token", error.message);
    return null;
  }
}

const validateToken = (token)=>{
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("error validating token", error.message);
    return res.status(500).json({error:"Validation token error!"});
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
