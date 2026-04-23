const express = require("express");
const router = express.Router();

const {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateStatus,
    assignMentor
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("student"), createApplication);
router.get("/my", authMiddleware, roleMiddleware("student"), getMyApplications);
router.get("/", authMiddleware, roleMiddleware("admin", "mentor"), getAllApplications);
router.get("/:id", authMiddleware, getApplicationById);
router.put("/:id/status", authMiddleware, roleMiddleware("admin", "mentor"), updateStatus);
router.put("/:id/assign-mentor", authMiddleware, roleMiddleware("admin", "mentor"), assignMentor);

module.exports = router;