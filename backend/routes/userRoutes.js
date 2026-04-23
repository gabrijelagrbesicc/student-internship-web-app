const express = require("express");
const router = express.Router();

const { getMe, getAllUsers, getMentors } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/me", authMiddleware, getMe);
router.get("/", authMiddleware, roleMiddleware("admin", "mentor"), getAllUsers);
router.get("/mentors", authMiddleware, getMentors);

module.exports = router;