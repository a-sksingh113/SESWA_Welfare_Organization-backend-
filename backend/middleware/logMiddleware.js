const fs = require("fs");
const winston = require("winston");
const logConfig = require("../config/logConfig");

// Ensure logs directory exists
if (!fs.existsSync(logConfig.LOGS_DIR)) {
  fs.mkdirSync(logConfig.LOGS_DIR, { recursive: true });
}

// Create Winston logger
const logger = winston.createLogger({
  level: logConfig.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logConfig.LOG_FILE_PATH }),
  ],
});

// Middleware to log API requests
const logRequest = (req, res, next) => {
    const user = req.user ? req.user.email || req.user.fullName || "Unknown User" : "Guest";
    logger.info(`API CALL -> ${req.method} ${req.url} | User: ${user} | IP: ${req.ip}`);
    next();
  };

module.exports = { logger, logRequest };
