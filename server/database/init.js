import { Pool } from 'pg'

let pool = null

export async function getDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
    
    await createTables()
    await insertSampleData()
  }
  
  return pool
}

async function createTables() {
  const client = await pool.connect()
  try {
    // Stalls table (no owner_id needed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS stalls (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Daily updates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id SERIAL PRIMARY KEY,
        stall_id INTEGER NOT NULL,
        varieties JSONB NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stall_id) REFERENCES stalls (id) ON DELETE CASCADE
      )
    `)

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_stalls_location ON stalls(latitude, longitude)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_daily_updates_stall ON daily_updates(stall_id)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_daily_updates_date ON daily_updates(last_updated)')
    
    console.log('✅ Database tables created successfully')
  } finally {
    client.release()
  }
}

async function insertSampleData() {
  const client = await pool.connect()
  try {
    // Check if sample data already exists
    const existingStall = await client.query('SELECT id FROM stalls WHERE name = $1', ['Durian King Stall'])
    
    if (existingStall.rows.length > 0) {
      console.log('🎯 Sample data already exists, skipping...')
      return
    }

    // Insert sample stall
    const stallResult = await client.query(`
      INSERT INTO stalls (name, address, phone) 
      VALUES ($1, $2, $3) RETURNING id
    `, ['Durian King Stall', 'Jalan Sultan, Kuala Lumpur', '+60 12-345 6789'])

    // Insert sample daily update
    const sampleVarieties = [
      { name: 'Musang King', price: 45, stock: 'high' },
      { name: 'Black Thorn', price: 35, stock: 'medium' },
      { name: 'D24 Sultan', price: 25, stock: 'low' }
    ]

    await client.query(`
      INSERT INTO daily_updates (stall_id, varieties) 
      VALUES ($1, $2)
    `, [stallResult.rows[0].id, sampleVarieties])

    console.log('🎯 Sample data inserted for development')
  } finally {
    client.release()
  }
} 