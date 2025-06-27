const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { username, password } = JSON.parse(event.body);

  // Use environment variable for admin password
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: 'admin', username: ADMIN_USERNAME },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '2h' }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' }),
    };
  }
}; 