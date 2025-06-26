import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '../database/init.js'

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, stall } = req.body
    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email])
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userResult = await db.run(`
      INSERT INTO users (name, email, password, phone) 
      VALUES (?, ?, ?, ?)
    `, [name, email, hashedPassword, phone])

    // Create stall
    const stallResult = await db.run(`
      INSERT INTO stalls (name, address, latitude, longitude, phone, owner_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [stall.name, stall.address, null, null, phone, userResult.lastID])

    // Get the created user
    const newUser = await db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [userResult.lastID])

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const db = await getDatabase()

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    const db = await getDatabase()

    const user = await db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [decoded.userId])
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })

  } catch (error) {
    console.error('Auth check error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router 