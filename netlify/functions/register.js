const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { name, email, password, phone, stall } = JSON.parse(event.body);
    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'User with this email already exists' })
        };
      }
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Create user
      const userResult = await client.query(
        'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
        [name, email, hashedPassword, phone]
      );
      const newUser = userResult.rows[0];
      // Create stall
      await client.query(
        'INSERT INTO stalls (name, address, latitude, longitude, phone, owner_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [stall.name, stall.address, null, null, phone, newUser.id]
      );
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'User registered successfully',
          token,
          user: newUser
        })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Registration failed', error: error.message })
    };
  }
}; 