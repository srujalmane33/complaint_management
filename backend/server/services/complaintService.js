const pool = require("../config/db");
const QUERIES = require("../config/queries");

const generateComplaintNumber = require("../utils/generateComplaintNumber");

const COMPLAINT_STATUS = require("../constants/complaintStatus");

const COMPLAINT_PRIORITY = require("../constants/complaintPriority");

// =====================================================
// CREATE COMPLAINT
// =====================================================

const createComplaint = async ({
  userId,
  categoryId,
  title,
  description,
  location,
  priority,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // -----------------------------------------------
    // Find student using logged-in user's ID
    // -----------------------------------------------

    const [students] = await connection.execute(
      QUERIES.COMPLAINT.FIND_STUDENT_BY_USER_ID,
      [userId],
    );

    if (students.length === 0) {
      throw new Error("Student profile not found");
    }

    const studentId = students[0].id;

    // -----------------------------------------------
    // Check category
    // -----------------------------------------------

    const [categories] = await connection.execute(
      QUERIES.COMPLAINT.FIND_CATEGORY_BY_ID,
      [categoryId],
    );

    if (categories.length === 0) {
      throw new Error("Invalid complaint category");
    }

    // -----------------------------------------------
    // Generate complaint number
    // -----------------------------------------------

    const complaintNumber = generateComplaintNumber();

    // -----------------------------------------------
    // Set default priority
    // -----------------------------------------------

    const complaintPriority = priority || COMPLAINT_PRIORITY.MEDIUM;

    // -----------------------------------------------
    // Insert complaint
    // -----------------------------------------------

    const [result] = await connection.execute(
      QUERIES.COMPLAINT.INSERT_COMPLAINT,
      [
        complaintNumber,
        studentId,
        categoryId,
        title.trim(),
        description.trim(),
        location || null,
        complaintPriority,
        COMPLAINT_STATUS.PENDING_REVIEW,
      ],
    );

    // -----------------------------------------------
    // Create complaint history
    // -----------------------------------------------

    await connection.execute(
      QUERIES.COMPLAINT.INSERT_COMPLAINT_UPDATE,
      [
        result.insertId,
        userId,
        null,
        COMPLAINT_STATUS.PENDING_REVIEW,
        "Complaint submitted by student",
      ],
    );

    // -----------------------------------------------
    // Commit transaction
    // -----------------------------------------------

    await connection.commit();

    // -----------------------------------------------
    // Return created complaint
    // -----------------------------------------------

    const [complaints] = await connection.execute(
      QUERIES.COMPLAINT.GET_COMPLAINT_BY_ID_WITH_CATEGORY,
      [result.insertId],
    );

    return complaints[0];
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};

// =====================================================
// GET MY COMPLAINTS
// =====================================================

const getMyComplaints = async (userId) => {
  const [students] = await pool.execute(
    QUERIES.COMPLAINT.FIND_STUDENT_BY_USER_ID,
    [userId],
  );

  if (students.length === 0) {
    throw new Error("Student profile not found");
  }

  const studentId = students[0].id;

  const [complaints] = await pool.execute(
    QUERIES.COMPLAINT.GET_COMPLAINTS_BY_STUDENT_ID,
    [studentId],
  );

  return complaints;
};

// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (userId, complaintId) => {
  const [students] = await pool.execute(
    QUERIES.COMPLAINT.FIND_STUDENT_BY_USER_ID,
    [userId],
  );

  if (students.length === 0) {
    throw new Error("Student profile not found");
  }

  const studentId = students[0].id;

  const [complaints] = await pool.execute(
    QUERIES.COMPLAINT.GET_COMPLAINT_BY_ID_AND_STUDENT,
    [complaintId, studentId],
  );

  if (complaints.length === 0) {
    throw new Error("Complaint not found");
  }

  // -----------------------------------------------
  // Get complaint history
  // -----------------------------------------------

  const [updates] = await pool.execute(
    QUERIES.COMPLAINT.GET_COMPLAINT_UPDATES,
    [complaintId],
  );

  return {
    ...complaints[0],
    updates,
  };
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
};
