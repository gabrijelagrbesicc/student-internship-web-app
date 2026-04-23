const express = require("express");
const router = express.Router();

const {
    getDocumentsByApplicationId,
    uploadDocument
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/:applicationId", authMiddleware, getDocumentsByApplicationId);
router.post("/upload", authMiddleware, upload.single("dokument"), uploadDocument);

module.exports = router;