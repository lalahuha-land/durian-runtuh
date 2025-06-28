import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function migrate() {
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
    } else {
      console.log('ℹ️ State column already exists')
    }
    
    console.log('🎉 Migration completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(console.error)
}

export { migrate } 