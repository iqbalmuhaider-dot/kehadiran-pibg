-- D1 Database Schema for Kehadiran PIBG
-- Run this to create the database table

CREATE TABLE IF NOT EXISTS kehadiran_pibg (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendee_count INTEGER DEFAULT 1,
  students TEXT NOT NULL,  -- JSON array of {name, class}
  event_id TEXT DEFAULT 'pibg-hari-raya-2026',
  submitted_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_id ON kehadiran_pibg(event_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON kehadiran_pibg(created_at);
CREATE INDEX IF NOT EXISTS idx_parent_name ON kehadiran_pibg(parent_name);

-- Insert sample data (optional)
-- INSERT INTO kehadiran_pibg (parent_name, phone, attendee_count, students, event_id, submitted_at)
-- VALUES 
--   ('Ahmad bin Abu', '012-345 6789', 2, '[{"name":"Ali bin Ahmad","class":"1 Anggerik"}]', 'pibg-hari-raya-2026', datetime('now')),
--   ('Siti binti Hassan', '013-456 7890', 1, '[{"name":"Fatimah binti Siti","class":"3 Cempaka"}]', 'pibg-hari-raya-2026', datetime('now'));

-- Useful queries:

-- Get all registrations for an event
-- SELECT * FROM kehadiran_pibg WHERE event_id = 'pibg-hari-raya-2026' ORDER BY created_at DESC;

-- Get total count by class
-- SELECT 
--   json_extract(value, '$.class') as class,
--   COUNT(*) as count
-- FROM kehadiran_pibg, json_each(students)
-- WHERE event_id = 'pibg-hari-raya-2026'
-- GROUP BY class
-- ORDER BY count DESC;

-- Get total adult attendees
-- SELECT SUM(attendee_count) as total_adults FROM kehadiran_pibg WHERE event_id = 'pibg-hari-raya-2026';

-- Export to CSV format
-- SELECT 
--   parent_name as "Nama Ibu Bapa",
--   phone as "No. Telefon",
--   attendee_count as "Bilangan Hadir",
--   students as "Maklumat Murid",
--   created_at as "Tarikh Daftar"
-- FROM kehadiran_pibg 
-- WHERE event_id = 'pibg-hari-raya-2026';
