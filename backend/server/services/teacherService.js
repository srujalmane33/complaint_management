const pool = require("../config/db");
const QUERIES = require("../config/queries");

let rawStatus;
try {
  rawStatus = require("../constants/complaintStatus");
} catch {
  rawStatus = {};
}

const COMPLAINT_STATUS = rawStatus.COMPLAINT_STATUS || rawStatus || {
  PENDING_REVIEW: "PENDING_REVIEW",
  GENUINE: "GENUINE",
  NOT_GENUINE: "NOT_GENUINE",
};

const PENDING_STATUS = COMPLAINT_STATUS.PENDING_REVIEW || "PENDING_REVIEW";

const getPendingComplaints = async () => {
  try {
    const [rows] = await pool.execute(
      QUERIES.TEACHER.GET_PENDING_COMPLAINTS,
      [PENDING_STATUS]
    );
    return rows;
  } catch (error) {
    console.error("Error in getPendingComplaints:", error);
    throw error;
  }
};

const getComplaintById = async (complaintId) => {
  try {
    const [complaintRows] = await pool.execute(
      QUERIES.TEACHER.GET_COMPLAINT_BY_ID_FOR_TEACHER,
      [complaintId]
    );

    if (complaintRows.length === 0) {
      return null;
    }

    const [historyRows] = await pool.execute(
      QUERIES.TEACHER.GET_COMPLAINT_HISTORY_FOR_TEACHER,
      [complaintId]
    );

    return {
      complaint: complaintRows[0],
      history: historyRows,
    };
  } catch (error) {
    console.error("Error in getComplaintById:", error);
    throw error;
  }
};

const verifyComplaint = async (complaintId, status, remark, teacherUserId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [complaintRows] = await connection.execute(
      QUERIES.TEACHER.LOCK_COMPLAINT_FOR_UPDATE,
      [complaintId]
    );

    if (complaintRows.length === 0) {
      const error = new Error("Complaint not found.");
      error.statusCode = 404;
      throw error;
    }

    const currentStatus = complaintRows[0].status;

    if (currentStatus !== PENDING_STATUS) {
      const error = new Error(
        `Cannot verify complaint. Current status is already '${currentStatus}'.`
      );
      error.statusCode = 400;
      throw error;
    }

    // 1. Update complaints table
    await connection.execute(
      QUERIES.TEACHER.UPDATE_COMPLAINT_STATUS,
      [status, complaintId]
    );

    // 2. Insert into complaint_updates with user_id
    await connection.execute(
      QUERIES.COMPLAINT.INSERT_COMPLAINT_UPDATE_WITH_TIMESTAMP,
      [complaintId, teacherUserId, currentStatus, status, remark]
    );

    await connection.commit();

    return {
      complaintId,
      user_id: teacherUserId,
      old_status: currentStatus,
      new_status: status,
      remark,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error in verifyComplaint:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPendingComplaints,
  getComplaintById,
  verifyComplaint,
};