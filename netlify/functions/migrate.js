const { Pool } = require('pg')

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
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    if (decoded.role !== 'admin') throw new Error('Not admin')
  } catch {
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid token' }) }
  }

  const client = await pool.connect()
  try {
    console.log('🔄 Starting database migration...')
    
    // Check if state column exists
    const columnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'stalls' AND column_name = 'state'
    `)
    
    if (columnExists.rows.length === 0) {
      console.log('📝 Adding state column to stalls table...')
      await client.query('ALTER TABLE stalls ADD COLUMN state VARCHAR(100)')
      console.log('✅ State column added successfully')
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Migration completed successfully',
          addedColumn: 'state'
        })
      }
    } else {
      console.log('ℹ️ State column already exists')
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Migration completed - no changes needed',
          addedColumn: null
        })
      }
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Migration failed',
        error: error.message
      })
    }
  } finally {
    client.release()
  }
} 