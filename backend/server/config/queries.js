// =============================================================
// queries.js — Central SQL Query Registry
// All SQL queries used across the application are defined here.
// =============================================================

const QUERIES = {

  // -----------------------------------------------------------
  // AUTH QUERIES
  // -----------------------------------------------------------

  AUTH: {
    /** Check if a user exists by email */
    FIND_USER_BY_EMAIL: `
      SELECT id FROM users
      WHERE email = ?
    `,

    /** Check if a student exists by roll number */
    FIND_STUDENT_BY_ROLL_NUMBER: `
      SELECT id FROM students
      WHERE roll_number = ?
    `,

    /** Check if a department exists by ID */
    FIND_DEPARTMENT_BY_ID: `
      SELECT id FROM departments
      WHERE id = ?
    `,

    /** Insert a new user (STUDENT role) */
    INSERT_STUDENT_USER: `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'STUDENT')
    `,

    /** Insert a new user (TEACHER role) */
    INSERT_TEACHER_USER: `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'TEACHER')
    `,

    /** Insert a new student profile */
    INSERT_STUDENT_PROFILE: `
      INSERT INTO students (user_id, roll_number, course, year, department_id)
      VALUES (?, ?, ?, ?, ?)
    `,

    /** Insert a new teacher profile */
    INSERT_TEACHER_PROFILE: `
      INSERT INTO teachers (user_id, department_id, employee_id)
      VALUES (?, ?, ?)
    `,

    /** Get user credentials for login */
    GET_USER_FOR_LOGIN: `
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE email = ?
    `,

    /** Get current logged-in user details */
    GET_CURRENT_USER: `
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = ?
    `,
  },

  // -----------------------------------------------------------
  // COMPLAINT QUERIES
  // -----------------------------------------------------------

  COMPLAINT: {
    /** Find student ID from user ID */
    FIND_STUDENT_BY_USER_ID: `
      SELECT id
      FROM students
      WHERE user_id = ?
    `,

    /** Check if complaint category exists */
    FIND_CATEGORY_BY_ID: `
      SELECT id
      FROM complaint_categories
      WHERE id = ?
    `,

    /** Insert a new complaint */
    INSERT_COMPLAINT: `
      INSERT INTO complaints
<<<<<<< HEAD
        (complaint_number, student_id, category_id, title, description, location, priority, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
=======
        (complaint_number, student_id, category_id, title, description, location, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
    `,

    /** Insert initial complaint history entry */
    INSERT_COMPLAINT_UPDATE: `
      INSERT INTO complaint_updates
        (complaint_id, user_id, old_status, new_status, remark)
      VALUES (?, ?, ?, ?, ?)
    `,

    /** Insert complaint history with explicit timestamp */
    INSERT_COMPLAINT_UPDATE_WITH_TIMESTAMP: `
      INSERT INTO complaint_updates (complaint_id, user_id, old_status, new_status, remark, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `,

    /** Get a single complaint by ID with category info */
    GET_COMPLAINT_BY_ID_WITH_CATEGORY: `
      SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
<<<<<<< HEAD
        c.image_url,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        c.created_at,
        cc.name AS category
      FROM complaints c
      JOIN complaint_categories cc ON c.category_id = cc.id
      WHERE c.id = ?
    `,

    /** Get all complaints belonging to a specific student */
    GET_COMPLAINTS_BY_STUDENT_ID: `
      SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
<<<<<<< HEAD
        c.image_url,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        c.created_at,
        c.updated_at,
        cc.name AS category
      FROM complaints c
      JOIN complaint_categories cc ON c.category_id = cc.id
      WHERE c.student_id = ?
      ORDER BY c.created_at DESC
    `,

    /** Get a single complaint belonging to a specific student */
    GET_COMPLAINT_BY_ID_AND_STUDENT: `
      SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
<<<<<<< HEAD
        c.image_url,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
        c.created_at,
        c.updated_at,
        cc.name AS category
      FROM complaints c
      JOIN complaint_categories cc ON c.category_id = cc.id
      WHERE c.id = ?
        AND c.student_id = ?
    `,

    /** Get complaint update history for a complaint */
    GET_COMPLAINT_UPDATES: `
      SELECT
        cu.id,
        cu.old_status,
        cu.new_status,
        cu.remark,
        cu.created_at,
        u.name AS updated_by,
        u.role
      FROM complaint_updates cu
      JOIN users u ON cu.user_id = u.id
      WHERE cu.complaint_id = ?
      ORDER BY cu.created_at ASC
    `,
  },

  // -----------------------------------------------------------
  // TEACHER QUERIES
  // -----------------------------------------------------------

  TEACHER: {
    /** Get all complaints with PENDING_REVIEW status */
    GET_PENDING_COMPLAINTS: `
      SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
<<<<<<< HEAD
        c.image_url,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
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
    `,

    /** Get a complaint by ID with student info (for teacher view) */
    GET_COMPLAINT_BY_ID_FOR_TEACHER: `
      SELECT
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
<<<<<<< HEAD
        c.image_url,
=======
>>>>>>> 1d2e705fdfb04a709876f9cc0482ffc24466a7a2
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
    `,

    /** Get complaint history for teacher view */
    GET_COMPLAINT_HISTORY_FOR_TEACHER: `
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
    `,

    /** Lock and fetch complaint for status update */
    LOCK_COMPLAINT_FOR_UPDATE: `
      SELECT id, status FROM complaints
      WHERE id = ?
      FOR UPDATE
    `,

    /** Update complaint status */
    UPDATE_COMPLAINT_STATUS: `
      UPDATE complaints
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `,
  },

};

module.exports = QUERIES;
