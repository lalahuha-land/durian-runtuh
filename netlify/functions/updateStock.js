const { Pool } = require('pg');
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
    const { varieties } = JSON.parse(event.body);
    const client = await pool.connect();
    try {
      // Get the user's stall id
      const stallResult = await client.query('SELECT id FROM stalls WHERE owner_id = $1', [decoded.userId]);
      const stall = stallResult.rows[0];
      if (!stall) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Stall not found for this user' })
        };
      }
      // Insert new daily update
      await client.query(
        'INSERT INTO daily_updates (stall_id, varieties) VALUES ($1, $2)',
        [stall.id, JSON.stringify(varieties)]
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Stock updated successfully!' })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update stock error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update stock', error: error.message })
    };
  }
}; 