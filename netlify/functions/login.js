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
    const { email, password } = JSON.parse(event.body);
    const client = await pool.connect();
    try {
      // Find user by email
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Invalid email or password' })
        };
      }
      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Invalid email or password' })
        };
      }
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Login successful',
          token,
          user: userWithoutPassword
        })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Login failed', error: error.message })
    };
  }
}; 