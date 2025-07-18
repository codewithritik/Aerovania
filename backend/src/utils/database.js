const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/drone_analytics',
});

// Initialize database with all tables
async function initDatabase() {
  try {
    // Users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Check if reports table exists and if it has uploaded_by column
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'reports'
      );
    `);

    const columnExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reports' 
        AND column_name = 'uploaded_by'
      );
    `);

    if (!tableExists.rows[0].exists) {
      // Create reports table with uploaded_by column
      await pool.query(`
        CREATE TABLE reports (
          id SERIAL PRIMARY KEY,
          drone_id VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          location VARCHAR(255) NOT NULL,
          uploaded_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else if (!columnExists.rows[0].exists) {
      // Add uploaded_by column to existing reports table
      await pool.query(`
        ALTER TABLE reports 
        ADD COLUMN uploaded_by INTEGER REFERENCES users(id);
      `);
    }

    // Violations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS violations (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        violation_id VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        timestamp TIME NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance (only if columns exist)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_drone_id ON reports(drone_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(date);`);
    
    // Only create uploaded_by index if column exists
    const uploadedByExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reports' 
        AND column_name = 'uploaded_by'
      );
    `);
    
    if (uploadedByExists.rows[0].exists) {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_uploaded_by ON reports(uploaded_by);`);
    }
    
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_violations_type ON violations(type);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_violations_report_id ON violations(report_id);`);

    // Create default admin user if no users exist
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@aerovania.com', hashedPassword, 'admin']
      );
      
      console.log('Default admin user created (admin@aerovania.com / admin123)');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() as db_time');
    return { connected: true, timestamp: result.rows[0].db_time };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { connected: false, error: error.message };
  }
}

module.exports = {
  pool,
  initDatabase,
  testConnection
};
