const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Admin login — no auth required
router.post("/auth/login", adminController.loginAdmin);

// Register admin (protected by admin secret)
router.post("/auth/register", adminController.registerAdmin);

// All routes below require valid JWT + ADMIN role
router.use(authenticateToken, authorizeRoles("ADMIN"));

router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/complaints", adminController.getAllComplaints);
router.put("/complaints/:id/resolve", adminController.assignAndResolveComplaint);
router.get("/teachers", adminController.getAllTeachers);
router.get("/students", adminController.getAllStudents);

module.exports = router;