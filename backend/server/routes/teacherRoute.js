const express = require("express");
const router = express.Router();

const teacherController = require("../controller/teacherController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidddlware");
const { validateVerification } = require("../validators/teacherValidator");
const { ROLES } = require("../constants/role");

// Support both roleMiddleware.authorize and direct authorize function export
const authorize = roleMiddleware.authorize || roleMiddleware;

// Apply middlewares
router.use(authMiddleware);
router.use(authorize(ROLES.TEACHER));

router.get("/complaints/pending", teacherController.getPendingComplaints);
router.get("/complaints/:id", teacherController.getComplaintById);
router.put(
  "/complaints/:id/verify",
  validateVerification,
  teacherController.verifyComplaint
);

module.exports = router;