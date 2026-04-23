const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
    res.send("Backend radi.");
});

app.get("/api/test/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Zaštićena ruta radi.",
        user: req.user
    });
});

app.get("/api/test/student", authMiddleware, roleMiddleware("student"), (req, res) => {
    res.json({
        message: "Pristup dopušten samo studentu.",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});