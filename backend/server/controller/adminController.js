const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @desc    Register a new Admin
// @route   POST /api/admin/auth/register
// @access  Protected by Admin Secret Key
exports.registerAdmin = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and the admin secret key",
      });
    }

    if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin registration secret key. Unauthorized.",
      });
    }

    const [existingUsers] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'ADMIN')`,
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const adminUserId = userResult.insertId;

    // Insert into admins table if it exists (non-blocking)
    try {
      await connection.query(
        `INSERT INTO admins (user_id) VALUES (?)`,
        [adminUserId]
      );
    } catch (_) {
      // admins table may not exist — role column in users is sufficient
    }

    await connection.commit();

    const userPayload = {
      id: adminUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "ADMIN",
    };
    const token = generateToken(userPayload);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      user: userPayload,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Admin Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register admin",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// @desc    Admin Login
// @route   POST /api/admin/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const [users] = await db.query(
      `SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND role = 'ADMIN'`,
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials or unauthorized role",
      });
    }

    const adminUser = users[0];
    const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const userPayload = {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    };
    const token = generateToken(userPayload);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login admin",
      error: error.message,
    });
  }
};

// @desc    Get dashboard metrics & summary counts
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Complaint status breakdown
    const [statusStats] = await db.query(`
      SELECT 
        COUNT(*) AS total_complaints,
        SUM(CASE WHEN status = 'PENDING_REVIEW' THEN 1 ELSE 0 END) AS pending_review,
        SUM(CASE WHEN status = 'GENUINE'        THEN 1 ELSE 0 END) AS genuine_complaints,
        SUM(CASE WHEN status = 'NOT_GENUINE'    THEN 1 ELSE 0 END) AS rejected_complaints,
        SUM(CASE WHEN status = 'IN_PROGRESS'    THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'RESOLVED'       THEN 1 ELSE 0 END) AS resolved
      FROM complaints
    `);

    // 2. User counts
    const [userStats] = await db.query(`
      SELECT 
        SUM(CASE WHEN role = 'STUDENT' THEN 1 ELSE 0 END) AS total_students,
        SUM(CASE WHEN role = 'TEACHER' THEN 1 ELSE 0 END) AS total_teachers
      FROM users
    `);

    // 3. Priority distribution
    const [priorityStats] = await db.query(`
      SELECT priority, COUNT(*) AS count 
      FROM complaints 
      GROUP BY priority
    `);

    // 4. Department breakdown via students table
    //    complaints → students (student_id = students.id) → departments
    const [departmentStats] = await db.query(`
      SELECT 
        d.id,
        d.name,
        COUNT(c.id) AS complaint_count
      FROM departments d
      LEFT JOIN students s ON s.department_id = d.id
      LEFT JOIN complaints c ON c.student_id = s.id
      GROUP BY d.id, d.name
      ORDER BY complaint_count DESC
    `);

    return res.status(200).json({
      success: true,
      data: {
        complaints: statusStats[0],
        users: userStats[0],
        priorities: priorityStats,
        departments: departmentStats,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
};

// @desc    Get all complaints with filters
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, priority, category_id, search } = req.query;

    // Schema:
    //   complaints: id, complaint_number, student_id→students.id, category_id, title, description, location, priority, status, created_at, updated_at
    //   students:   id, user_id→users.id, roll_number, course, year, department_id→departments.id
    //   complaint_updates: complaint_id, user_id→users.id, old_status, new_status, remark, created_at
    let query = `
      SELECT 
        c.id,
        c.complaint_number,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
        c.image_url,
        c.created_at,
        c.updated_at,
        cc.name        AS category,
        u.name         AS student_name,
        u.email        AS student_email,
        s.roll_number,
        s.course,
        s.year,
        d.name         AS department_name,
        (
          SELECT cu2.remark
          FROM complaint_updates cu2
          WHERE cu2.complaint_id = c.id
          ORDER BY cu2.created_at DESC
          LIMIT 1
        ) AS latest_remark,
        (
          SELECT u2.name
          FROM complaint_updates cu3
          JOIN users u2 ON u2.id = cu3.user_id
          WHERE cu3.complaint_id = c.id
            AND u2.role = 'TEACHER'
          ORDER BY cu3.created_at DESC
          LIMIT 1
        ) AS verified_by_teacher
      FROM complaints c
      JOIN students s           ON c.student_id = s.id
      JOIN users u              ON s.user_id = u.id
      LEFT JOIN departments d   ON s.department_id = d.id
      LEFT JOIN complaint_categories cc ON c.category_id = cc.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ` AND c.status = ?`;
      params.push(status);
    }
    if (priority) {
      query += ` AND c.priority = ?`;
      params.push(priority);
    }
    if (category_id) {
      query += ` AND c.category_id = ?`;
      params.push(category_id);
    }
    if (search) {
      query += ` AND (c.title LIKE ? OR c.complaint_number LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY c.created_at DESC`;

    const [complaints] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve complaints",
      error: error.message,
    });
  }
};

// @desc    Update complaint status / add admin remarks
// @route   PUT /api/admin/complaints/:id/resolve
// @access  Private (Admin only)
exports.assignAndResolveComplaint = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const { status, admin_remarks } = req.body;
    const adminId = req.user.userId;

    const [existing] = await db.query(
      `SELECT id, status FROM complaints WHERE id = ?`,
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const oldStatus = existing[0].status;

    await connection.beginTransaction();

    // Build dynamic update
    let setParts = [`updated_at = NOW()`];
    const params = [];

    if (status) {
      setParts.push(`status = ?`);
      params.push(status);
    }

    params.push(id);
    await connection.query(
      `UPDATE complaints SET ${setParts.join(", ")} WHERE id = ?`,
      params
    );

    // Log the update in complaint_updates
    if (status && status !== oldStatus) {
      const remark = admin_remarks || `Status updated to ${status} by Admin`;
      await connection.query(
        `INSERT INTO complaint_updates (complaint_id, user_id, old_status, new_status, remark, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, adminId, oldStatus, status, remark]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Resolve Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private (Admin only)
exports.getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        t.employee_id,
        t.department_id,
        d.name AS department_name
      FROM users u
      JOIN teachers t     ON u.id = t.user_id
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE u.role = 'TEACHER'
      ORDER BY u.name ASC
    `);

    return res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    console.error("Get Teachers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load teachers list",
      error: error.message,
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        s.roll_number, 
        s.course, 
        s.year, 
        d.name AS department_name
      FROM users u
      JOIN students s         ON u.id = s.user_id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE u.role = 'STUDENT'
      ORDER BY u.name ASC
    `);

    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("Get Students Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load students list",
      error: error.message,
    });
  }
};