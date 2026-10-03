const express = require("express");

const {
  register,
  login,
  getMe,
  registerTeacher
} = require("../controller/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/register-teacher", registerTeacher);

module.exports = router;