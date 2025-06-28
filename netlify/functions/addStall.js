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
    // Start transaction
    await client.query('BEGIN')
    
    // Create stall
    const stallResult = await client.query(
      'INSERT INTO stalls (name, address, state, latitude, longitude, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, address, state, latitude, longitude, phone]
    )
    
    const stallId = stallResult.rows[0].id
    
    // Insert varieties if provided
    if (varieties && varieties.length > 0) {
      await client.query(
        'INSERT INTO daily_updates (stall_id, varieties) VALUES ($1, $2)',
        [stallId, varieties]
      )
    }
    
    // Commit transaction
    await client.query('COMMIT')
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        message: 'Stall created successfully',
        stallId: stallId
      }) 
    }
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK')
    console.error('Add stall error:', error)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Failed to create stall' }) 
    }
  } finally {
    client.release()
  }
} 