import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db

export async function initDatabase() {
  try {
    // Open database
    db = await open({
      filename: join(__dirname, '../../durian-runtuh.db'),
      driver: sqlite3.Database
    })

    console.log('📊 Database connection established')

    // Create tables
    await createTables()
    console.log('✅ Database tables created successfully')

    // Insert sample data
    await insertSampleData()
    console.log('✅ Sample data inserted successfully')

    return db
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

async function createTables() {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Stalls table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stalls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      phone TEXT,
      owner_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id)
    )
  `)

  // Daily updates table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS daily_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stall_id INTEGER NOT NULL,
      varieties TEXT NOT NULL,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stall_id) REFERENCES stalls (id)
    )
  `)

  // Create indexes for better performance
  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
  await db.exec('CREATE INDEX IF NOT EXISTS idx_stalls_owner ON stalls(owner_id)')
  await db.exec('CREATE INDEX IF NOT EXISTS idx_daily_updates_stall ON daily_updates(stall_id)')
  await db.exec('CREATE INDEX IF NOT EXISTS idx_daily_updates_date ON daily_updates(last_updated)')
}

async function insertSampleData() {
  // Check if sample data already exists
  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', ['demo@durianruntuh.com'])
  
  if (existingUser) {
    console.log('🎯 Sample data already exists, skipping...')
    return
  }

  // Insert sample user
  const userResult = await db.run(`
    INSERT INTO users (name, email, password, phone) 
    VALUES (?, ?, ?, ?)
  `, ['Demo Owner', 'demo@durianruntuh.com', '$2a$10$demo.hash.for.testing', '+60 12-345 6789'])

  // Insert sample stall (without coordinates for MVP)
  const stallResult = await db.run(`
    INSERT INTO stalls (name, address, phone, owner_id) 
    VALUES (?, ?, ?, ?)
  `, ['Durian King Stall', 'Jalan Sultan, Kuala Lumpur', '+60 12-345 6789', userResult.lastID])

  // Insert sample daily update
  const sampleVarieties = JSON.stringify([
    { name: 'Musang King', price: 45, stock: 'high' },
    { name: 'Black Thorn', price: 35, stock: 'medium' },
    { name: 'D24 Sultan', price: 25, stock: 'low' }
  ])

  await db.run(`
    INSERT INTO daily_updates (stall_id, varieties) 
    VALUES (?, ?)
  `, [stallResult.lastID, sampleVarieties])

  console.log('🎯 Sample data inserted for development')
}

export async function getDatabase() {
  if (!db) {
    await initDatabase()
  }
  return db
} 