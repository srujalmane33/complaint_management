const pool = require("../config/db");

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
    const query = `
      SELECT 
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
        c.created_at,
        u.name AS student_name,
        u.email AS student_email,
        s.roll_number,
        s.course,
        s.year
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE c.status = ?
      ORDER BY c.created_at DESC
    `;

    const [rows] = await pool.execute(query, [PENDING_STATUS]);
    return rows;
  } catch (error) {
    console.error("Error in getPendingComplaints:", error);
    throw error;
  }
};

const getComplaintById = async (complaintId) => {
  try {
    const complaintQuery = `
      SELECT 
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
        c.created_at,
        u.name AS student_name,
        u.email AS student_email,
        s.roll_number,
        s.course,
        s.year
      FROM complaints c
      JOIN students s ON c.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE c.id = ?
    `;

    const [complaintRows] = await pool.execute(complaintQuery, [complaintId]);

    if (complaintRows.length === 0) {
      return null;
    }

    const historyQuery = `
      SELECT 
        id,
        user_id,
        old_status,
        new_status,
        remark,
        created_at
      FROM complaint_updates
      WHERE complaint_id = ?
      ORDER BY created_at ASC
    `;

    const [historyRows] = await pool.execute(historyQuery, [complaintId]);

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
      "SELECT id, status FROM complaints WHERE id = ? FOR UPDATE",
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
      "UPDATE complaints SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, complaintId]
    );

    // 2. Insert into complaint_updates with user_id
    const historyQuery = `
      INSERT INTO complaint_updates (complaint_id, user_id, old_status, new_status, remark, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await connection.execute(historyQuery, [
      complaintId,
      teacherUserId,
      currentStatus,
      status,
      remark,
    ]);

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