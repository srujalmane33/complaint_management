const express = require("express");
const cors = require("cors");

const authRoutes = require("../backend/server/routes/authRoute");
const complaintRoutes = require("../backend/server/routes/complaintRoute");
const teacherRoutes = require("../backend/server/routes/teacherRoute");
const adminRoutes = require("../backend/server/routes/adminRoute");

<<<<<<< HEAD
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(uploadsDir));
=======
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2

// =====================================================
// ROOT
// =====================================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Complaint Management API is running",
  });
});

// =====================================================
// AUTH
// =====================================================
app.use("/api/auth", authRoutes);

// =====================================================
// COMPLAINTS
// =====================================================
app.use("/api/complaints", complaintRoutes);

// =====================================================
// TEACHER
// =====================================================
app.use("/api/teacher", teacherRoutes);

// =====================================================
// ADMIN
// =====================================================
app.use("/api/admin", adminRoutes);

module.exports = app;