const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      roll_number,
      course,
      year,
      department_id,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !roll_number ||
      !course ||
      !year ||
      !department_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await authService.registerStudent({
      name,
      email,
      password,
      roll_number,
      course,
      year,
      department_id,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Register error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    
    const result = await authService.login({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};




const registerTeacher = async (req, res, next) => {
  try {
    const result = await authService.registerTeacher(req.body);
    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerTeacher,
};
