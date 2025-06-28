const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
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

  const { 
    name, 
    address, 
    state, 
    latitude, 
    longitude, 
    phone, 
    varieties
  } = JSON.parse(event.body)
  
  const client = await pool.connect()
  try {
    // Create stall without owner_id
    await client.query(
      'INSERT INTO stalls (name, address, state, latitude, longitude, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, address, state, latitude, longitude, phone]
    )
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        message: 'Stall created successfully'
      }) 
    }
  } catch (error) {
    console.error('Add stall error:', error)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Failed to create stall' }) 
    }
  } finally {
    client.release()
  }
} 