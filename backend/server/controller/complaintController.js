const complaintService = require("../services/complaintService");

// =====================================================
// CREATE COMPLAINT
// =====================================================

const createComplaint = async (req, res) => {
  try {
    const {
      category_id,
      title,
      description,
      location,
      priority,
      image,
      image_url,
    } = req.body;

    const fileImageUrl = req.file ? `/uploads/complaint/${req.file.filename}` : null;
    const resolvedImage = image || image_url || fileImageUrl || null;

    const complaint = await complaintService.createComplaint({
      userId: req.user.userId,
      categoryId: category_id,
      title,
      description,
      location,
      priority,
      image: resolvedImage,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: {
        complaint,
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET MY COMPLAINTS
// =====================================================

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getMyComplaints(req.user.userId);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: {
        complaints,
      },
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (req, res) => {
  try {
    const complaint = await complaintService.getComplaintById(
      req.user.userId,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: {
        complaint,
      },
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
};