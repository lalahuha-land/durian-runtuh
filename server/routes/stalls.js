import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all stalls with their latest update (for map)
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase()
    const stalls = await db.all(`
      SELECT s.*, u.name as owner_name, u.phone as owner_phone,
        (
          SELECT varieties FROM daily_updates du
          WHERE du.stall_id = s.id
          ORDER BY du.last_updated DESC
          LIMIT 1
        ) as latest_varieties,
        (
          SELECT last_updated FROM daily_updates du
          WHERE du.stall_id = s.id
          ORDER BY du.last_updated DESC
          LIMIT 1
        ) as last_updated
      FROM stalls s
      LEFT JOIN users u ON s.owner_id = u.id
    `)
    const result = stalls.map(stall => ({
      id: stall.id,
      name: stall.name,
      address: stall.address,
      latitude: stall.latitude || 3.1390, // Default to KL if not set
      longitude: stall.longitude || 101.6869, // Default to KL if not set
      phone: stall.phone || stall.owner_phone,
      latestUpdate: stall.latest_varieties ? {
        varieties: JSON.parse(stall.latest_varieties),
        lastUpdated: stall.last_updated
      } : null
    }))
    res.json(result)
  } catch (error) {
    console.error('Get stalls error:', error)
    res.status(500).json({ message: 'Failed to get stalls' })
  }
})

// Get current user's stall (for dashboard)
router.get('/my-stall', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase()
    const userId = req.user.userId
    const stall = await db.get('SELECT * FROM stalls WHERE owner_id = ?', [userId])
    if (!stall) return res.status(404).json({ message: 'Stall not found' })
    // Get latest update
    const update = await db.get('SELECT * FROM daily_updates WHERE stall_id = ? ORDER BY last_updated DESC LIMIT 1', [stall.id])
    res.json({
      ...stall,
      latestUpdate: update ? {
        varieties: JSON.parse(update.varieties),
        lastUpdated: update.last_updated
      } : null
    })
  } catch (error) {
    console.error('Get my stall error:', error)
    res.status(500).json({ message: 'Failed to get stall' })
  }
})

// Update stall information (protected)
router.put('/update-stall', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase()
    const userId = req.user.userId
    const { name, address, latitude, longitude, phone } = req.body
    
    const stall = await db.get('SELECT * FROM stalls WHERE owner_id = ?', [userId])
    if (!stall) return res.status(404).json({ message: 'Stall not found' })
    
    await db.run(`
      UPDATE stalls 
      SET name = ?, address = ?, latitude = ?, longitude = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE owner_id = ?
    `, [name, address, latitude, longitude, phone, userId])
    
    res.json({ message: 'Stall updated successfully' })
  } catch (error) {
    console.error('Update stall error:', error)
    res.status(500).json({ message: 'Failed to update stall' })
  }
})

// Post daily stock update (protected)
router.post('/update-stock', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase()
    const userId = req.user.userId
    const { varieties } = req.body
    if (!Array.isArray(varieties) || varieties.length === 0) {
      return res.status(400).json({ message: 'Varieties are required' })
    }
    const stall = await db.get('SELECT * FROM stalls WHERE owner_id = ?', [userId])
    if (!stall) return res.status(404).json({ message: 'Stall not found' })
    await db.run('INSERT INTO daily_updates (stall_id, varieties) VALUES (?, ?)', [stall.id, JSON.stringify(varieties)])
    res.json({ message: 'Stock updated successfully' })
  } catch (error) {
    console.error('Update stock error:', error)
    res.status(500).json({ message: 'Failed to update stock' })
  }
})

export default router 