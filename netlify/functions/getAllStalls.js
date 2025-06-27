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

  // Fetch all stalls
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM stalls')
    const stalls = result.rows.map(stall => ({
      ...stall,
      varieties: stall.varieties ? JSON.parse(stall.varieties) : []
    }))
    return { statusCode: 200, body: JSON.stringify(stalls) }
  } finally {
    client.release()
  }
} 