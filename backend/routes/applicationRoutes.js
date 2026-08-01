const express = require("express");
const router = express.Router();

const {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateStatus,
    assignMentor,
    gradeApplication,
    getStatusHistory,
    getApplicationReports
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("student"), createApplication);
router.get("/my", authMiddleware, roleMiddleware("student"), getMyApplications);
router.get("/reports", authMiddleware, roleMiddleware("admin"), getApplicationReports);
router.get("/", authMiddleware, roleMiddleware("admin", "mentor"), getAllApplications);
router.get("/:id/status-history", authMiddleware, getStatusHistory);
router.get("/:id", authMiddleware, getApplicationById);
router.put("/:id/status", authMiddleware, roleMiddleware("admin", "mentor"), updateStatus);
router.put("/:id/assign-mentor", authMiddleware, roleMiddleware("admin"), assignMentor);
router.put("/:id/grade", authMiddleware, roleMiddleware("admin", "mentor"), gradeApplication);

module.exports = router;
