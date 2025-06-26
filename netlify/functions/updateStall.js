const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
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
    const { name, address, latitude, longitude, phone } = JSON.parse(event.body);
    const client = await pool.connect();
    try {
      // Update the stall for the authenticated user
      const result = await client.query(
        'UPDATE stalls SET name = $1, address = $2, latitude = $3, longitude = $4, phone = $5 WHERE owner_id = $6 RETURNING *',
        [name, address, latitude, longitude, phone, decoded.userId]
      );
      if (result.rowCount === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Stall not found for this user' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Stall information updated successfully!' })
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update stall error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update stall information', error: error.message })
    };
  }
}; 