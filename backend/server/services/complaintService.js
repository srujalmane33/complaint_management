const pool = require("../config/db");

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
      `SELECT id
       FROM students
       WHERE user_id = ?`,
      [userId]
    );

    if (students.length === 0) {
      throw new Error("Student profile not found");
    }

    const studentId = students[0].id;


    // -----------------------------------------------
    // Check category
    // -----------------------------------------------

    const [categories] = await connection.execute(
      `SELECT id
       FROM complaint_categories
       WHERE id = ?`,
      [categoryId]
    );

    if (categories.length === 0) {
      throw new Error("Invalid complaint category");
    }


    // -----------------------------------------------
    // Generate complaint number
    // -----------------------------------------------

    const complaintNumber =
      generateComplaintNumber();


    // -----------------------------------------------
    // Set default priority
    // -----------------------------------------------

    const complaintPriority =
      priority || COMPLAINT_PRIORITY.MEDIUM;


    // -----------------------------------------------
    // Insert complaint
    // -----------------------------------------------

    const [result] = await connection.execute(
      `INSERT INTO complaints
      (
        complaint_number,
        student_id,
        category_id,
        title,
        description,
        location,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        complaintNumber,
        studentId,
        categoryId,
        title.trim(),
        description.trim(),
        location || null,
        complaintPriority,
        COMPLAINT_STATUS.PENDING_REVIEW,
      ]
    );


    // -----------------------------------------------
    // Create complaint history
    // -----------------------------------------------

    await connection.execute(
      `INSERT INTO complaint_updates
      (
        complaint_id,
        user_id,
        old_status,
        new_status,
        remark
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        result.insertId,
        userId,
        null,
        COMPLAINT_STATUS.PENDING_REVIEW,
        "Complaint submitted by student",
      ]
    );


    // -----------------------------------------------
    // Commit transaction
    // -----------------------------------------------

    await connection.commit();


    // -----------------------------------------------
    // Return created complaint
    // -----------------------------------------------

    const [complaints] = await connection.execute(
      `SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
        c.created_at,

        cc.name AS category

      FROM complaints c

      JOIN complaint_categories cc
        ON c.category_id = cc.id

      WHERE c.id = ?`,
      [result.insertId]
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
    `SELECT id
     FROM students
     WHERE user_id = ?`,
    [userId]
  );

  if (students.length === 0) {
    throw new Error("Student profile not found");
  }

  const studentId = students[0].id;


  const [complaints] = await pool.execute(
    `SELECT

      c.id,
      c.complaint_number,
      c.title,
      c.description,
      c.location,
      c.priority,
      c.status,
      c.created_at,
      c.updated_at,

      cc.name AS category

    FROM complaints c

    JOIN complaint_categories cc
      ON c.category_id = cc.id

    WHERE c.student_id = ?

    ORDER BY c.created_at DESC`,
    [studentId]
  );


  return complaints;
};


// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (
  userId,
  complaintId
) => {

  const [students] = await pool.execute(
    `SELECT id
     FROM students
     WHERE user_id = ?`,
    [userId]
  );

  if (students.length === 0) {
    throw new Error("Student profile not found");
  }

  const studentId = students[0].id;


  const [complaints] = await pool.execute(
    `SELECT

      c.id,
      c.complaint_number,
      c.title,
      c.description,
      c.location,
      c.priority,
      c.status,
      c.created_at,
      c.updated_at,

      cc.name AS category

    FROM complaints c

    JOIN complaint_categories cc
      ON c.category_id = cc.id

    WHERE c.id = ?
      AND c.student_id = ?`,
    [
      complaintId,
      studentId,
    ]
  );


  if (complaints.length === 0) {
    throw new Error("Complaint not found");
  }


  // -----------------------------------------------
  // Get complaint history
  // -----------------------------------------------

  const [updates] = await pool.execute(
    `SELECT

      cu.id,
      cu.old_status,
      cu.new_status,
      cu.remark,
      cu.created_at,

      u.name AS updated_by,
      u.role

    FROM complaint_updates cu

    JOIN users u
      ON cu.user_id = u.id

    WHERE cu.complaint_id = ?

    ORDER BY cu.created_at ASC`,
    [complaintId]
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