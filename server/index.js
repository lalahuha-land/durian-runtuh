import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import routes
import authRoutes from './routes/auth.js'
import stallRoutes from './routes/stalls.js'

// Import database initialization
import { initDatabase } from './database/init.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize database
initDatabase()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/stalls', stallRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DurianRuntuh API is running',
    timestamp: new Date().toISOString()
  })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 DurianRuntuh server running on port ${PORT}`)
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
}) 