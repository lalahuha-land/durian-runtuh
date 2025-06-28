import express from 'express'
import { getDatabase } from '../database/init.js'

const router = express.Router()

// Get all stalls with their latest update (for map)
router.get('/', async (req, res) => {
  try {
    const pool = await getDatabase()
    const result = await pool.query(`
      SELECT s.*,
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
    `)
    
    const stalls = result.rows.map(stall => ({
      id: stall.id,
      name: stall.name,
      address: stall.address,
      latitude: stall.latitude || 3.1390, // Default to KL if not set
      longitude: stall.longitude || 101.6869, // Default to KL if not set
      phone: stall.phone,
      latestUpdate: stall.latest_varieties ? {
        varieties: stall.latest_varieties,
        lastUpdated: stall.last_updated
      } : null
    }))
    
    res.json(stalls)
  } catch (error) {
    console.error('Get stalls error:', error)
    res.status(500).json({ message: 'Failed to get stalls' })
  }
})

export default router 