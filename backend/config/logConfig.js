const path = require("path");

// Define the logs directory
const LOGS_DIR = path.join(__dirname, "../logs");

// Define the log file path
const LOG_FILE_PATH = path.join(LOGS_DIR, "logs.log");

module.exports = {
  LOGS_DIR,
  LOG_FILE_PATH,
  LOG_LEVEL: "info", // Change to "debug" for detailed logs
};
