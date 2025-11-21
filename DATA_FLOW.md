# Data Flow Documentation

## 🔄 Complete System Data Flow

### End-to-End Alert Pipeline

```
┌──────────────┐
│ CCTV Camera  │
│ (Live Feed)  │
└──────┬───────┘
       │ Video Stream
       ▼
┌─────────────────────────────┐
│   AI Detection Backend      │
│   (FastAPI + YOLO ONNX)     │
├─────────────────────────────┤
│ 1. Frame Capture            │
│    • Webcam: 30 FPS         │
│    • IP Camera: 10 FPS      │
│                             │
│ 2. YOLO Inference           │
│    • Weapon detection       │
│    • Confidence scoring     │
│    • Motion analysis        │
│                             │
│ 3. Alert Generation         │
│    • Save JSON metadata     │
│    • Save JPEG image        │
│    • Local storage          │
└──────┬──────────────────────┘
       │
       │ Alert Data
       ▼
┌─────────────────────────────┐
│   Admin Verification        │
│   (Manual Review)           │
├─────────────────────────────┤
│ • Review alert details      │
│ • Check image evidence      │
│ • Mark as verified/rejected │
└──────┬──────────────────────┘
       │
       │ Verified Alerts Only
       ▼
┌─────────────────────────────┐
│   Supabase Cloud            │
│   (Backend as a Service)    │
├─────────────────────────────┤
│ PostgreSQL:                 │
│   • verified_alerts table   │
│   • metadata (JSONB)        │
│                             │
│ Storage:                    │
│   • alert-images bucket     │
│   • verified_alerts/images/ │
└──────┬──────────────────────┘
       │
       │ HTTPS Read-Only
       ▼
┌─────────────────────────────┐
│   Frontend Dashboard        │
│   (React Application)       │
├─────────────────────────────┤
│ • Poll every 30 seconds     │
│ • Display alert cards       │
│ • Highlight recent alerts   │
│ • Show images & metadata    │
└─────────────────────────────┘
       │
       │ Visual Display
       ▼
┌─────────────────────────────┐
│   End User                  │
│   (Security Personnel)      │
└─────────────────────────────┘
```

---

## 📋 Detailed Flow Descriptions

### 1. User Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication                       │
└─────────────────────────────────────────────────────────────┘

Step 1: User Registration
    User → Register Page → Enter credentials
         → POST to Supabase Auth API
         → Create user account
         → Return JWT token

Step 2: User Login
    User → Login Page → Enter credentials
         → POST to Supabase Auth API
         → Validate credentials
         → Generate JWT token
         → Store in localStorage
         → Redirect to Dashboard

Step 3: Session Management
    Dashboard Load → Check localStorage for token
                  → Validate token with Supabase
                  → If valid: Allow access
                  → If invalid: Redirect to Login

Step 4: Logout
    User → Click Logout → Clear localStorage
         → Redirect to Login page
```

### 2. Alert Display Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Alert Display Cycle                       │
└─────────────────────────────────────────────────────────────┘

Initial Load:
    1. Dashboard mounts
    2. Show loading state
    3. Fetch alerts from Supabase
    4. Parse metadata (JSON)
    5. Load images from storage
    6. Display alert cards
    7. Hide loading state

Polling Cycle (Every 30 seconds):
    1. Silent fetch (no loading indicator)
    2. Query verified_alerts table
    3. Compare with current alerts
    4. Update state if new alerts found
    5. Re-render alert cards
    6. Maintain scroll position

Alert Card Rendering:
    For each alert:
        1. Extract metadata (weapons count, timestamp, etc.)
        2. Format timestamp (dd/mm/yyyy HH:MM:SS)
        3. Check if alert < 1 hour old
        4. Apply red border if recent
        5. Construct image URL
        6. Display alert info
        7. Handle image load errors (fallback to base64)
```

### 3. Image Loading Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Image Loading Process                     │
└─────────────────────────────────────────────────────────────┘

Step 1: Extract Image Path
    alert.metadata → JSON.parse()
                  → metadata.image_file
                  → Example: "CRIME_20251115_165805_658.jpg"

Step 2: Construct Storage Path
    Base path: "verified_alerts/images/"
    Filename: metadata.image_file
    Full path: "verified_alerts/images/CRIME_20251115_165805_658.jpg"

Step 3: Get Public URL
    Supabase Storage API
        → getPublicUrl('alert-images', fullPath)
        → Returns: https://<project>.supabase.co/storage/v1/object/public/...

Step 4: Load Image
    <img src={publicURL} />
        → Browser requests image
        → If success: Display image
        → If error: Trigger onError handler

Step 5: Fallback (on error)
    Extract base64 from alert.image_base64
        → If available: Display base64 image
        → If not: Show placeholder/error icon
```

### 4. Data Synchronization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                Backend to Supabase Sync                      │
└─────────────────────────────────────────────────────────────┘

Alert Verification:
    1. Admin verifies alert in backend system
    2. Backend reads JSON metadata file
    3. Backend reads JPEG image file
    4. Prepare data for Supabase:
        • alert_id (unique)
        • timestamp
        • threat_score
        • confidence
        • weapons_detected
        • image_base64 (encoded)
        • metadata (JSONB)
    5. Insert into verified_alerts table
    6. Upload image to alert-images bucket
    7. Update local verification status

Frontend Consumption:
    1. Frontend polls Supabase every 30s
    2. Query: SELECT * FROM verified_alerts ORDER BY timestamp DESC
    3. Parse each row
    4. Map to Alert interface
    5. Update React state
    6. Trigger re-render
```

---

## 📊 Data Structures

### Alert Data Structure (Database)

```typescript
interface Alert {
  id: number;                    // Database primary key
  alert_id: string;              // Unique alert identifier
  timestamp: string;             // ISO 8601 timestamp
  threat_score: number;          // 0.0 - 1.0
  confidence: number;            // 0.0 - 1.0
  weapons_detected: number;      // Count
  image_base64: string;          // Base64 encoded JPEG (fallback)
  metadata: {
    alert_type: string;          // "Crime Detection Alert"
    image_file: string;          // "CRIME_20251115_165805_658.jpg"
    detection_details: {
      weapons_detected: number;
      crime_score: number;
      motion_score: number;
      cluster_score: number;
    };
  };
  created_at: string;            // Auto-generated timestamp
}
```

### Image Storage Structure

```
Bucket: alert-images (Public)
Path: verified_alerts/images/

Files:
├── CRIME_20251115_165805_658.jpg
├── CRIME_20251115_165905_789.jpg
├── CRIME_20251115_170005_123.jpg
└── ...

Access:
https://<project>.supabase.co/storage/v1/object/public/alert-images/verified_alerts/images/<filename>.jpg
```

---

## ⏱️ Timing & Performance

### Polling Intervals
- **Frontend Dashboard**: 30 seconds
- **Backend Detection**: Real-time (30 FPS webcam, 10 FPS IP camera)
- **Alert Verification**: Manual (on-demand)
- **Cloud Sync**: Immediate after verification

### Response Times
- **Authentication**: < 500ms
- **Alert Query**: < 200ms (typical)
- **Image Load**: < 1s (depends on network)
- **Dashboard Refresh**: < 300ms (silent poll)

### Data Sizes
- **Alert JSON**: ~1-2 KB
- **Alert Image**: ~50-200 KB (JPEG compressed)
- **Database Row**: ~5-10 KB (with base64)
- **Total per alert**: ~55-210 KB

---

## 🔄 State Management

### Frontend State Flow

```
User Action → Event Handler → API Call → Update State → Re-render

Example: Login Flow
1. User clicks "Login" button
2. handleLogin() captures form data
3. auth.login() calls Supabase
4. Supabase returns JWT token
5. Store token in localStorage
6. Update auth state
7. React Router navigates to /dashboard
8. Dashboard component mounts
9. useEffect triggers getAlerts()
10. Update alerts state
11. Render alert cards
```

### Backend State Flow

```
Camera Frame → Detection → Alert Decision → Storage → Verification → Sync

Example: Alert Creation Flow
1. Camera captures frame
2. YOLO processes frame
3. Weapon detected (confidence > threshold)
4. Create alert object
5. Save JSON to alerts/metadata/
6. Save JPEG to alerts/images/
7. Admin reviews in backend UI
8. Admin marks as verified
9. Move to verified_alerts/ folder
10. Sync to Supabase database
11. Upload image to Supabase storage
```

---

**Last Updated:** November 21, 2025  
**Version:** 2.0
