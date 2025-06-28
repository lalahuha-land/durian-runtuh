-- DurianRuntuh Database Schema
-- PostgreSQL Schema for DurianRuntuh Application

-- Create stalls table
CREATE TABLE IF NOT EXISTS stalls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_updates table
CREATE TABLE IF NOT EXISTS daily_updates (
  id SERIAL PRIMARY KEY,
  stall_id INTEGER NOT NULL,
  varieties JSONB NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stall_id) REFERENCES stalls (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stalls_location ON stalls(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_daily_updates_stall ON daily_updates(stall_id);
CREATE INDEX IF NOT EXISTS idx_daily_updates_date ON daily_updates(last_updated);

-- Insert sample data
INSERT INTO stalls (name, address, phone) VALUES 
  ('Durian King Stall', 'Jalan Sultan, Kuala Lumpur', '+60 12-345 6789')
ON CONFLICT DO NOTHING;

-- Insert sample daily update
INSERT INTO daily_updates (stall_id, varieties) 
SELECT 
  s.id,
  '[
    {"name": "Musang King", "price": 45, "stock": "high"},
    {"name": "Black Thorn", "price": 35, "stock": "medium"},
    {"name": "D24 Sultan", "price": 25, "stock": "low"}
  ]'::jsonb
FROM stalls s 
WHERE s.name = 'Durian King Stall'
ON CONFLICT DO NOTHING; 