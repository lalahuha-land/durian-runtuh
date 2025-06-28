const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Needed for many cloud providers
});

exports.handler = async (event, context) => {
  try {
    const client = await pool.connect();
    try {
      // Get all stalls with their latest daily updates (varieties)
      const result = await client.query(`
        SELECT 
          s.*,
          du.varieties,
          du.last_updated as latest_update
        FROM stalls s
        LEFT JOIN (
          SELECT 
            stall_id,
            varieties,
            last_updated,
            ROW_NUMBER() OVER (PARTITION BY stall_id ORDER BY last_updated DESC) as rn
          FROM daily_updates
        ) du ON s.id = du.stall_id AND du.rn = 1
        ORDER BY s.name
      `);

      // Transform the data to match the expected format
      const stalls = result.rows.map(stall => ({
        id: stall.id,
        name: stall.name,
        address: stall.address,
        state: stall.state,
        latitude: stall.latitude,
        longitude: stall.longitude,
        phone: stall.phone,
        latestUpdate: {
          varieties: stall.varieties || [],
          lastUpdated: stall.latest_update || new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(stalls)
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get stalls error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get stalls', error: error.message })
    };
  }
};
