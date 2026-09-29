const express = require("express");
const cors = require("cors");

const authRoutes = require("../backend/server/routes/authRoute");
const complaintRoutes = require("../backend/server/routes/complaintRoute");
const teacherRoutes = require("../backend/server/routes/teacherRoute");
const adminRoutes = require("../backend/server/routes/adminRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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