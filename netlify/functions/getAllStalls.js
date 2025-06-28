const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

exports.handler = async (event) => {
  // Check admin JWT
  const authHeader = event.headers.authorization || ''
  const token = authHeader.split(' ')[1]
  if (!token) return { statusCode: 401, body: JSON.stringify({ message: 'No token' }) }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    if (decoded.role !== 'admin') throw new Error('Not admin')
  } catch {
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid token' }) }
  }

  // Fetch all stalls with their latest varieties
  const client = await pool.connect()
  try {
    // First, ensure daily_updates table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id SERIAL PRIMARY KEY,
        stall_id INTEGER NOT NULL,
        varieties JSONB NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stall_id) REFERENCES stalls (id) ON DELETE CASCADE
      )
    `)
    
    const result = await client.query(`
      SELECT s.*, 
        (
          SELECT varieties FROM daily_updates du
          WHERE du.stall_id = s.id
          ORDER BY du.last_updated DESC
          LIMIT 1
        ) as latest_varieties
      FROM stalls s
    `)
    
    const stalls = result.rows.map(stall => ({
      ...stall,
      varieties: stall.latest_varieties || []
    }))
    
    return { statusCode: 200, body: JSON.stringify(stalls) }
  } finally {
    client.release()
  }
} 