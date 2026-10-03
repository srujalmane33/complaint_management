const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require("../controller/complaintController");

const protect =
  require("../middleware/authMiddleware");

const authorize =
  require("../middleware/roleMidddlware");

const {
  validateCreateComplaint,
} = require("../validators/complaintValidator");


const router = express.Router();


// =====================================================
// ALL COMPLAINT ROUTES REQUIRE LOGIN
// =====================================================

router.use(protect);


// =====================================================
// CREATE COMPLAINT
// STUDENT ONLY
// =====================================================

router.post(
  "/",
  authorize("STUDENT"),
  validateCreateComplaint,
  createComplaint
);


// =====================================================
// GET MY COMPLAINTS
// STUDENT ONLY
// =====================================================

router.get(
  "/my",
  authorize("STUDENT"),
  getMyComplaints
);


// =====================================================
// GET SINGLE COMPLAINT
// STUDENT ONLY
// =====================================================

router.get(
  "/:id",
  authorize("STUDENT"),
  getComplaintById
);


module.exports = router;