const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) }
  }
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

  const { id, name, address, state, latitude, longitude, phone, varieties } = JSON.parse(event.body)
  const client = await pool.connect()
  try {
    await client.query(
      'UPDATE stalls SET name=$1, address=$2, state=$3, latitude=$4, longitude=$5, phone=$6, varieties=$7 WHERE id=$8',
      [name, address, state, latitude, longitude, phone, JSON.stringify(varieties), id]
    )
    return { statusCode: 200, body: JSON.stringify({ message: 'Stall updated' }) }
  } finally {
    client.release()
  }
} 