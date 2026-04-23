const express = require("express");
const router = express.Router();

const { getMyNotifications } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my", authMiddleware, getMyNotifications);

module.exports = router;