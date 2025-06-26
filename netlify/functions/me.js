const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  try {
    const authHeader = event.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No token provided' })
      };
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' })
      };
    }
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, name, email, phone FROM users WHERE id = $1', [decoded.userId]);
      const user = result.rows[0];
      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'User not found' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ user })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' })
    };
  }
}; 