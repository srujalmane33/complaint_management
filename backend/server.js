require("dotenv").config();

const app = require("./app");
const pool = require("./server/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test MySQL connection
    const connection = await pool.getConnection();

    console.log("✅ MySQL connected successfully");

    // Test database query
    const [rows] = await connection.query(
      "SELECT DATABASE() AS database_name"
    );

    console.log("📦 Connected database:", rows[0].database_name);

    connection.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MySQL connection failed:");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();