# Database Schema Documentation

## 🗄️ Supabase PostgreSQL Schema

### Table: `verified_alerts`

Primary table for storing verified crime detection alerts.

```sql
CREATE TABLE verified_alerts (
  id SERIAL PRIMARY KEY,
  alert_id TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  threat_score FLOAT,
  confidence FLOAT,
  weapons_detected INTEGER DEFAULT 0,
  image_base64 TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 Column Definitions

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | SERIAL | NOT NULL | Auto-incrementing primary key |
| `alert_id` | TEXT | NOT NULL | Unique alert identifier (e.g., "CRIME_20251115_165805_658") |
| `timestamp` | TIMESTAMPTZ | NOT NULL | When the alert was detected (with timezone) |
| `threat_score` | FLOAT | YES | Overall threat level (0.0 - 1.0) |
| `confidence` | FLOAT | YES | Detection confidence (0.0 - 1.0) |
| `weapons_detected` | INTEGER | YES | Number of weapons found in the frame |
| `image_base64` | TEXT | YES | Base64 encoded JPEG (fallback for storage failures) |
| `metadata` | JSONB | YES | Additional structured data (detection details, etc.) |
| `created_at` | TIMESTAMPTZ | YES | Record creation timestamp (auto-generated) |

---

## 🔍 Indexes

Recommended indexes for optimal query performance:

```sql
-- Index on timestamp for chronological queries
CREATE INDEX idx_verified_alerts_timestamp 
ON verified_alerts(timestamp DESC);

-- Index on alert_id for unique lookups
CREATE INDEX idx_verified_alerts_alert_id 
ON verified_alerts(alert_id);

-- Index on created_at for recent alerts
CREATE INDEX idx_verified_alerts_created_at 
ON verified_alerts(created_at DESC);
```

---

## 📋 Metadata Structure (JSONB)

The `metadata` column stores flexible JSON data with the following structure:

```json
{
  "alert_type": "Crime Detection Alert",
  "image_file": "CRIME_20251115_165805_658.jpg",
  "detection_details": {
    "weapons_detected": 2,
    "crime_score": 0.95,
    "motion_score": 0.87,
    "cluster_score": 0.92
  }
}
```

### Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `alert_type` | string | Classification of alert (e.g., "Crime Detection Alert") |
| `image_file` | string | Filename of the associated image in storage |
| `detection_details` | object | Nested object with detection metrics |
| `detection_details.weapons_detected` | number | Count of weapons detected |
| `detection_details.crime_score` | number | Crime probability (0.0 - 1.0) |
| `detection_details.motion_score` | number | Motion detection score (0.0 - 1.0) |
| `detection_details.cluster_score` | number | Clustering analysis score (0.0 - 1.0) |

---

## 🖼️ Storage Schema

### Bucket: `alert-images`

Configuration:
- **Access**: Public
- **File Size Limit**: 50 MB
- **Allowed MIME Types**: `image/jpeg`, `image/jpg`

### Directory Structure

```
alert-images/
└── verified_alerts/
    └── images/
        ├── CRIME_20251115_165805_658.jpg
        ├── CRIME_20251115_165905_789.jpg
        ├── CRIME_20251115_170005_123.jpg
        └── ...
```

### File Naming Convention

Format: `CRIME_YYYYMMDD_HHMMSS_mmm.jpg`

Example: `CRIME_20251115_165805_658.jpg`
- `CRIME`: Prefix
- `20251115`: Date (November 15, 2025)
- `165805`: Time (16:58:05 / 4:58:05 PM)
- `658`: Milliseconds
- `.jpg`: JPEG format

---

## 🔐 Row Level Security (RLS)

Recommended RLS policies for production:

### Policy 1: Allow authenticated users to read alerts

```sql
CREATE POLICY "Allow authenticated read access"
ON verified_alerts
FOR SELECT
TO authenticated
USING (true);
```

### Policy 2: Restrict write access to service role only

```sql
CREATE POLICY "Service role only can insert"
ON verified_alerts
FOR INSERT
TO service_role
WITH CHECK (true);
```

### Policy 3: No public access (optional)

```sql
-- Remove public access if needed
ALTER TABLE verified_alerts ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Sample Data

### Example Row

```sql
INSERT INTO verified_alerts (
  alert_id,
  timestamp,
  threat_score,
  confidence,
  weapons_detected,
  image_base64,
  metadata
) VALUES (
  'CRIME_20251115_165805_658',
  '2025-11-15T16:58:05.658Z',
  0.95,
  0.92,
  2,
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBg...', -- Base64 string (truncated)
  '{
    "alert_type": "Crime Detection Alert",
    "image_file": "CRIME_20251115_165805_658.jpg",
    "detection_details": {
      "weapons_detected": 2,
      "crime_score": 0.95,
      "motion_score": 0.87,
      "cluster_score": 0.92
    }
  }'::jsonb
);
```

---

## 🔍 Common Queries

### Get Recent Alerts (Last 24 Hours)

```sql
SELECT 
  alert_id,
  timestamp,
  weapons_detected,
  metadata
FROM verified_alerts
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### Get Alerts by Threat Score

```sql
SELECT 
  alert_id,
  timestamp,
  threat_score,
  weapons_detected
FROM verified_alerts
WHERE threat_score >= 0.8
ORDER BY threat_score DESC
LIMIT 10;
```

### Get Alert with Metadata Details

```sql
SELECT 
  alert_id,
  timestamp,
  weapons_detected,
  metadata->>'image_file' AS image_filename,
  (metadata->'detection_details'->>'crime_score')::float AS crime_score
FROM verified_alerts
WHERE alert_id = 'CRIME_20251115_165805_658';
```

### Count Alerts by Date

```sql
SELECT 
  DATE(timestamp) AS alert_date,
  COUNT(*) AS alert_count,
  AVG(threat_score) AS avg_threat_score,
  SUM(weapons_detected) AS total_weapons
FROM verified_alerts
GROUP BY DATE(timestamp)
ORDER BY alert_date DESC;
```

---

## 📈 Data Growth Estimates

### Storage Projections

| Alerts/Day | Days | DB Size | Storage Size | Total |
|------------|------|---------|--------------|-------|
| 10 | 30 | ~300 KB | ~60 MB | ~60 MB |
| 50 | 30 | ~1.5 MB | ~300 MB | ~300 MB |
| 100 | 30 | ~3 MB | ~600 MB | ~600 MB |
| 100 | 365 | ~36 MB | ~7.3 GB | ~7.3 GB |

### Retention Considerations

- Archive alerts older than 90 days to reduce database size
- Implement automatic cleanup for low-priority alerts
- Consider separate cold storage for historical data

---

## 🔧 Maintenance Tasks

### Weekly
```sql
-- Analyze table for query optimization
ANALYZE verified_alerts;
```

### Monthly
```sql
-- Vacuum table to reclaim space
VACUUM ANALYZE verified_alerts;
```

### Quarterly
```sql
-- Archive old alerts (example: move to archive table)
INSERT INTO verified_alerts_archive
SELECT * FROM verified_alerts
WHERE timestamp < NOW() - INTERVAL '90 days';

DELETE FROM verified_alerts
WHERE timestamp < NOW() - INTERVAL '90 days';
```

---

## 🚨 Backup Strategy

### Supabase Automatic Backups
- Daily backups (retained for 7 days on free tier)
- Point-in-time recovery available on Pro tier

### Manual Backup (Optional)
```bash
# Export to CSV
psql -h <host> -U <user> -d <database> \
  -c "COPY verified_alerts TO STDOUT WITH CSV HEADER" > alerts_backup.csv

# Export images from storage
supabase storage download alert-images --recursive
```

---

**Last Updated:** November 21, 2025  
**Version:** 2.0
