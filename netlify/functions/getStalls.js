const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Needed for many cloud providers
});

exports.handler = async (event, context) => {
  try {
    // Get JWT from Authorization header
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
      // Get the stall(s) for the authenticated user
      const result = await client.query(
        'SELECT * FROM stalls WHERE owner_id = $1',
        [decoded.userId]
      );
      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'No stall found for this user' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows[0]) // or result.rows if you expect multiple
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get stall error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get stall', error: error.message })
    };
  }
};
