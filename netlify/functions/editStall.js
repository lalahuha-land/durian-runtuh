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

  const { 
    id, 
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
    
    // Update stall information
    await client.query(
      'UPDATE stalls SET name=$1, address=$2, state=$3, latitude=$4, longitude=$5, phone=$6 WHERE id=$7',
      [name, address, state, latitude, longitude, phone, id]
    )
    
    // Update or insert daily update with varieties
    if (varieties && varieties.length > 0) {
      // Check if daily_updates table exists, create if not
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_updates (
          id SERIAL PRIMARY KEY,
          stall_id INTEGER REFERENCES stalls(id) ON DELETE CASCADE,
          varieties JSONB NOT NULL,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // Insert new daily update
      await client.query(
        'INSERT INTO daily_updates (stall_id, varieties) VALUES ($1, $2)',
        [id, JSON.stringify(varieties)]
      )
    }
    
    // Commit transaction
    await client.query('COMMIT')
    
    return { statusCode: 200, body: JSON.stringify({ message: 'Stall updated successfully' }) }
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK')
    console.error('Edit stall error:', error)
    return { statusCode: 500, body: JSON.stringify({ message: 'Failed to update stall', error: error.message }) }
  } finally {
    client.release()
  }
} 