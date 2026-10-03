const COMPLAINT_PRIORITY = require("../constants/complaintPriority");

const validateCreateComplaint = (req, res, next) => {
  const {
    category_id,
    title,
    description,
    location,
    priority,
  } = req.body;

  if (!category_id) {
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });
  }

  if (!title || title.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Title must contain at least 5 characters",
    });
  }

  if (!description || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Description must contain at least 10 characters",
    });
  }

  if (
    priority &&
    !Object.values(COMPLAINT_PRIORITY).includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid complaint priority",
    });
  }

  next();
};

module.exports = {
  validateCreateComplaint,
};