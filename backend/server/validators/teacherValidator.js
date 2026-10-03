const { COMPLAINT_STATUS } = require("../constants/complaintStatus");

const validateVerification = (req, res, next) => {
  const { status, remark } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Verification status is required.",
    });
  }

  const allowedStatuses = [
    COMPLAINT_STATUS.GENUINE,
    COMPLAINT_STATUS.NOT_GENUINE,
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Status must be either '${COMPLAINT_STATUS.GENUINE}' or '${COMPLAINT_STATUS.NOT_GENUINE}'.`,
    });
  }

  if (!remark || remark.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Remark is required and must be at least 5 characters long.",
    });
  }

  next();
};

module.exports = {
  validateVerification,
};