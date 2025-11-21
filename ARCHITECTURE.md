# System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌───────────┐  ┌──────────┐  ┌─────────────────────────┐  │
│  │  Login/   │  │Dashboard │  │   Alert Cards           │  │
│  │ Register  │→ │          │→ │  - Image Display        │  │
│  │   Pages   │  │  (30s    │  │  - Timestamp            │  │
│  └───────────┘  │  polling)│  │  - Weapons Count        │  │
│                 └──────────┘  │  - Red Border (< 1hr)   │  │
│                                └─────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS (Read Only)
                         ▼
         ┌───────────────────────────────────┐
         │         Supabase Cloud            │
         │  ┌────────────┐  ┌─────────────┐ │
         │  │   Auth     │  │  PostgreSQL │ │
         │  │ (Users)    │  │  Database   │ │
         │  └────────────┘  │             │ │
         │                  │ verified_   │ │
         │  ┌────────────┐  │ alerts      │ │
         │  │  Storage   │  │ table       │ │
         │  │  (Images)  │  │             │ │
         │  └────────────┘  └─────────────┘ │
         └───────────────────────────────────┘
                         ▲
                         │
                         │ Write Access
                         │ (After Verification)
                         │
         ┌───────────────────────────────────┐
         │   AI Detection Backend            │
         │   (FastAPI + YOLO)                │
         │   • Processes CCTV feeds          │
         │   • Detects weapons/threats       │
         │   • Generates alerts              │
         │   • Admin verifies alerts         │
         │   • Syncs to Supabase             │
         └───────────────────────────────────┘
```

## 🎯 System Integration

This frontend is part of a **two-system architecture**:

### 1. AI Detection Backend (Separate FastAPI System)
- Runs YOLO ONNX model for real-time weapon detection from CCTV cameras
- Processes dual camera feeds: local webcam (30 FPS) + IP camera (10 FPS)
- Generates crime detection alerts with JSON metadata and JPEG images
- Admin reviews and verifies alerts through verification workflow
- Verified alerts are synced to Supabase `verified_alerts` table and storage

### 2. Frontend Dashboard (This Application - React)
- Reads verified alerts from Supabase (read-only access)
- Displays alerts with images, timestamps, threat scores, and metadata
- Allows users to view and monitor verified threats
- Does NOT have write access to alerts or detection controls

## 📊 Component Architecture

### Frontend Components

```
src/
├── pages/
│   ├── Login.tsx              # Authentication entry
│   ├── Register.tsx           # User registration
│   ├── Dashboard.tsx          # Main alert display
│   └── Index.tsx              # Landing page
├── components/
│   ├── RecentAlertCard.tsx    # Individual alert card
│   ├── AlertCard.tsx          # Alert card variant
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # Supabase authentication
│   ├── api.ts                 # Alert data fetching
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Helper functions
└── hooks/
    └── use-toast.ts           # Toast notifications
```

### Backend Components (AI Detection System)

```
Backend System/
├── Detection Layer
│   ├── Worker Thread 1 (Webcam - 30 FPS)
│   ├── Worker Thread 2 (IP Camera - 10 FPS)
│   └── Alert Logger (JSON Storage)
├── ML Model Layer
│   └── CCTVCrimeDetector (YOLO ONNX)
│       ├── Weapon detection & classification
│       ├── Motion region tracking
│       └── Threat scoring & smoothing
└── Data Layer
    ├── SQLite DB (Users)
    ├── Alerts/ JSON FS
    └── Cloud Sync (Supabase)
```

## 🔄 Data Flow

**Alert Creation Flow:**
```
CCTV Camera → YOLO Detection → Admin Verification → Supabase Cloud → Frontend Display
```

**User Authentication Flow:**
```
User → Login/Register → Supabase Auth → JWT Token → Dashboard Access
```

**Alert Polling Flow:**
```
Dashboard → 30s Interval → Supabase Query → Parse & Display → Highlight Recent
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **React Router 6** - Routing
- **Supabase JS** - Backend client

### Backend (AI Detection System)
- **FastAPI 0.121** - Web framework
- **ONNX Runtime** - YOLO inference
- **OpenCV** - Video processing
- **SQLite** - User authentication
- **Supabase Python** - Cloud sync

### Infrastructure
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage
- **Vercel** - Frontend hosting

## 🔐 Security Architecture

### Authentication Layer
- JWT tokens via Supabase Auth
- Token stored in localStorage
- Protected routes check authentication
- Session management with automatic refresh

### Data Access
- **Frontend**: Read-only access to verified_alerts
- **Backend**: Full CRUD access with admin verification
- **Supabase RLS**: Row-level security policies
- **CORS**: Configured for secure cross-origin requests

## ⚡ Performance Architecture

### Frontend Optimization
- 30-second polling interval (not 33ms like backend)
- Lazy loading for images
- Component memoization
- Efficient re-render strategy

### Backend Optimization
- Dual FPS strategy: 30 FPS (webcam) / 10 FPS (IP camera)
- JPEG compression for bandwidth reduction
- Frame skipping for network sources
- Connection recovery with automatic retry

### Database Optimization
- Indexed queries on timestamp
- JSONB for flexible metadata storage
- Efficient image storage in Supabase Storage
- Base64 fallback for reliability

---

**Last Updated:** November 21, 2025  
**Version:** 2.0
