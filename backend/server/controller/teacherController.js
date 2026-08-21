const teacherService = require("../services/teacherService");

const getPendingComplaints = async (req, res, next) => {
  try {
    const complaints = await teacherService.getPendingComplaints();
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const data = await teacherService.getComplaintById(complaintId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const verifyComplaint = async (req, res, next) => {
  try {
    const complaintId = req.params.id;
    const { status, remark } = req.body;
    const teacherUserId = req.user.userId || req.user.id;

    const result = await teacherService.verifyComplaint(
      complaintId,
      status,
      remark,
      teacherUserId
    );

    res.status(200).json({
      success: true,
      message: `Complaint marked as ${status} successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingComplaints,
  getComplaintById,
  verifyComplaint,
};