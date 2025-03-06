const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Your folder in Cloudinary
        format: async (req, file) => "png", // Supports 'jpeg', 'png', etc.
        public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    },
});

// 🔹 Multer Middleware
const upload = multer({ storage });

module.exports = upload;
