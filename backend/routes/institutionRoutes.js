const express = require("express");
const router = express.Router();

const {
    getAllInstitutions,
    createInstitution
} = require("../controllers/institutionController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getAllInstitutions);
router.post("/", authMiddleware, roleMiddleware("admin", "mentor"), createInstitution);

module.exports = router;