const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

const registerStudent = async ({
  name,
  email,
  password,
  roll_number,
  course,
  year,
  department_id,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Email already registered");
    }

    const [existingStudents] = await connection.execute(
      "SELECT id FROM students WHERE roll_number = ?",
      [roll_number]
    );

    if (existingStudents.length > 0) {
      throw new Error("Roll number already registered");
    }

    const [departments] = await connection.execute(
      "SELECT id FROM departments WHERE id = ?",
      [department_id]
    );

    if (departments.length === 0) {
      throw new Error("Invalid department");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await connection.execute(
      `INSERT INTO users
       (name, email, password_hash, role)
       VALUES (?, ?, ?, 'STUDENT')`,
      [name, email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.execute(
      `INSERT INTO students
       (user_id, roll_number, course, year, department_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, roll_number, course, year, department_id]
    );

    await connection.commit();

    const user = {
      id: userId,
      name,
      email,
      role: "STUDENT",
    };

    const token = generateToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const registerTeacher = async ({
  name,
  email,
  password,
  employee_id,
  department_id,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Email already registered");
    }

    const [departments] = await connection.execute(
      "SELECT id FROM departments WHERE id = ?",
      [department_id]
    );

    if (departments.length === 0) {
      throw new Error("Invalid department");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await connection.execute(
      `INSERT INTO users
       (name, email, password_hash, role)
       VALUES (?, ?, ?, 'TEACHER')`,
      [name, email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.execute(
      `INSERT INTO teachers
       (user_id, department_id, employee_id)
       VALUES (?, ?, ?)`,
      [userId, department_id, employee_id]
    );

    await connection.commit();

    const user = {
      id: userId,
      name,
      email,
      role: "TEACHER",
    };

    const token = generateToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const login = async ({ email, password }) => {
  const [users] = await pool.execute(
    `SELECT
        id,
        name,
        email,
        password_hash,
        role
     FROM users
     WHERE email = ?`,
    [email]
  );

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const [users] = await pool.execute(
    `SELECT
        id,
        name,
        email,
        role,
        created_at
     FROM users
     WHERE id = ?`,
    [userId]
  );

  if (users.length === 0) {
    throw new Error("User not found");
  }

  return users[0];
};

module.exports = {
  registerStudent,
  registerTeacher,
  login,
  getCurrentUser,
};