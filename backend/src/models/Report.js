const { pool } = require('../utils/database');

class Report {
  static async create({ drone_id, date, location, violations, uploadedBy }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert report
      const reportResult = await client.query(
        'INSERT INTO reports (drone_id, date, location, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING id',
        [drone_id, date, location, uploadedBy]
      );
      
      const reportId = reportResult.rows[0].id;
      
      // Insert violations
      for (const violation of violations) {
        await client.query(
          'INSERT INTO violations (report_id, violation_id, type, timestamp, latitude, longitude, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [reportId, violation.id, violation.type, violation.timestamp, violation.latitude, violation.longitude, violation.image_url]
        );
      }
      
      await client.query('COMMIT');
      
      return {
        reportId,
        violationsCount: violations.length
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getViolations(filters = {}) {
    const { drone_id, date, type, limit = 1000, offset = 0 } = filters;
    
    let query = `
      SELECT 
        v.violation_id,
        v.type,
        v.timestamp,
        v.latitude,
        v.longitude,
        v.image_url,
        r.drone_id,
        r.date,
        r.location,
        v.created_at,
        u.username as uploaded_by
      FROM violations v
      JOIN reports r ON v.report_id = r.id
      LEFT JOIN users u ON r.uploaded_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (drone_id) {
      params.push(drone_id);
      query += ` AND r.drone_id = $${++paramCount}`;
    }
    
    if (date) {
      params.push(date);
      query += ` AND r.date = $${++paramCount}`;
    }
    
    if (type) {
      params.push(type);
      query += ` AND v.type = $${++paramCount}`;
    }
    
    query += ` ORDER BY r.date DESC, v.timestamp DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getKPIs(filters = {}) {
    const { drone_id, date } = filters;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (drone_id) {
      params.push(drone_id);
      whereClause += ` AND r.drone_id = $${++paramCount}`;
    }
    
    if (date) {
      params.push(date);
      whereClause += ` AND r.date = $${++paramCount}`;
    }
    
    // Execute all queries in parallel for better performance
    const [totalResult, typeResult, droneResult, locationResult, timeResult] = await Promise.all([
      // Total violations
      pool.query(`
        SELECT COUNT(*) as total
        FROM violations v
        JOIN reports r ON v.report_id = r.id
        ${whereClause}
      `, params),
      
      // Violations by type
      pool.query(`
        SELECT v.type, COUNT(*) as count
        FROM violations v
        JOIN reports r ON v.report_id = r.id
        ${whereClause}
        GROUP BY v.type
        ORDER BY count DESC
      `, params),
      
      // Violations by drone
      pool.query(`
        SELECT r.drone_id, COUNT(*) as count
        FROM violations v
        JOIN reports r ON v.report_id = r.id
        ${whereClause}
        GROUP BY r.drone_id
        ORDER BY count DESC
      `, params),
      
      // Violations by location
      pool.query(`
        SELECT r.location, COUNT(*) as count
        FROM violations v
        JOIN reports r ON v.report_id = r.id
        ${whereClause}
        GROUP BY r.location
        ORDER BY count DESC
      `, params),
      
      // Violations over time
      pool.query(`
        SELECT r.date, COUNT(*) as count
        FROM violations v
        JOIN reports r ON v.report_id = r.id
        ${whereClause}
        GROUP BY r.date
        ORDER BY r.date
      `, params)
    ]);
    
    return {
      total: parseInt(totalResult.rows[0].total),
      byType: typeResult.rows,
      byDrone: droneResult.rows,
      byLocation: locationResult.rows,
      overTime: timeResult.rows
    };
  }

  static async getFilterOptions() {
    const [droneIds, dates, types] = await Promise.all([
      pool.query('SELECT DISTINCT drone_id FROM reports ORDER BY drone_id'),
      pool.query('SELECT DISTINCT date FROM reports ORDER BY date DESC'),
      pool.query('SELECT DISTINCT type FROM violations ORDER BY type')
    ]);
    
    return {
      droneIds: droneIds.rows.map(row => row.drone_id),
      dates: dates.rows.map(row => row.date),
      types: types.rows.map(row => row.type)
    };
  }

  static async getReportById(id) {
    const result = await pool.query(
      `SELECT r.*, u.username as uploaded_by 
       FROM reports r 
       LEFT JOIN users u ON r.uploaded_by = u.id 
       WHERE r.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }

    const violationsResult = await pool.query(
      'SELECT * FROM violations WHERE report_id = $1 ORDER BY timestamp',
      [id]
    );

    return {
      ...result.rows[0],
      violations: violationsResult.rows
    };
  }

  static async deleteReport(id) {
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  }
}

module.exports = Report;
