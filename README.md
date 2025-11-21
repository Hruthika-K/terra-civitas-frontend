# Terra-Civitas Crime Detection System

🔍 CCTV AI Crime Detection System  
Real-time Multi-Camera Weapon Detection with Dual Streaming, Alert Verification, and Cloud Sync

A professional-grade CCTV surveillance system powered by AI/ML for real-time weapon detection. Features dual independent camera streams (local webcam + IP camera), React frontend, FastAPI backend, and intelligent alert management with cloud synchronization.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

### 📚 Additional Documentation

- [**Architecture**](./ARCHITECTURE.md) - System architecture, components, and integration
- [**Data Flow**](./DATA_FLOW.md) - Complete data flow diagrams and processes
- [**Database Schema**](./DATABASE_SCHEMA.md) - Database structure, queries, and storage

---

## 🎯 Overview

Terra-Civitas is a web application that displays real-time crime detection alerts from surveillance systems. Users can register, login, and view alerts with images, timestamps, and threat information. The system highlights recent alerts (less than 1 hour old) for quick attention.

### 🌟 Key Features

#### Frontend Dashboard (This Application)
- ✅ **User Registration** - Create account with email/password
- ✅ **Secure Login** - JWT-based authentication via Supabase
- ✅ **Dashboard** - View all verified crime detection alerts
- ✅ **Real-time Updates** - Auto-refresh every 30 seconds
- ✅ **Alert Highlighting** - Red border for alerts < 1 hour old
- ✅ **Logout** - Clear session and return to login

#### AI Detection Backend (Separate System)
- 🎥 **Dual Camera Streaming** - Local webcam (30 FPS) + IP camera (10 FPS)
- 🤖 **YOLO ONNX Model** - Real-time weapon detection with threat scoring
- 🚨 **Alert Management** - Automatic logging, verification workflow
- 📊 **Dashboard & Monitoring** - Live stats, threat threshold tuning
- 🔐 **Authentication** - SQLite-based user auth with role-based access
- ⚡ **Performance Optimized** - Dual FPS strategy, JPEG compression

---

## ✨ Alert Information Displayed
- 📸 **Alert Image** - Visual evidence from camera
- ⏰ **Timestamp** - When the alert was detected (dd/mm/yyyy HH:MM:SS)
- 🔫 **Weapons Count** - Number of weapons detected
- 🏷️ **Alert Type** - Critical/Warning/Info badge
- 🆔 **Alert ID** - Unique identifier

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool & dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3.4** - Styling framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon system
- **Sonner** - Toast notifications

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage (image hosting)
- **Vercel** - Hosting & deployment

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Hruthika-K/terra-civitas-frontend.git
cd terra-civitas-frontend/frontend-terra-civitas
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
# Create .env.local file in the root directory
```

4. **Add environment variables** (see [Environment Variables](#environment-variables))

5. **Run development server**
```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables**
   - In Vercel project settings
   - Go to Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get deployment URL

5. **Update Supabase Settings**
   - Supabase Dashboard → Authentication → URL Configuration
   - Set "Site URL" to your Vercel URL
   - Add redirect URL: `https://your-app.vercel.app/**`

---

## 📁 Project Structure

```
frontend-terra-civitas/
├── public/
│   └── robots.txt
├── src/
│   ├── assets/              # Images, fonts
│   │   └── terra-civitas.png
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AlertCard.tsx
│   │   ├── RecentAlertCard.tsx
│   │   └── NotificationSidebar.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts
│   ├── lib/                # Utilities & API
│   │   ├── api.ts         # Alert data fetching
│   │   ├── auth.ts        # Authentication functions
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Helper functions
│   ├── pages/              # Route pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   ├── Index.tsx       # Landing page
│   │   └── NotFound.tsx    # 404 page
│   ├── App.tsx             # Route configuration
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & theme
├── .env.local              # Environment variables (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
├── vite.config.ts          # Vite config
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

---

## 🔑 Key Files Explained

### `src/lib/auth.ts`
Handles all authentication logic:
- `register()` - Create new user
- `login()` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get logged-in user
- `isAuthenticated()` - Check auth status

### `src/lib/api.ts`
Fetches alert data from Supabase:
- Queries `verified_alerts` table
- Retrieves images from storage
- Maps database fields to UI format
- Handles errors gracefully

### `src/lib/supabase.ts`
Initializes Supabase client with environment variables

### `src/pages/Dashboard.tsx`
Main dashboard component:
- Fetches alerts every 30 seconds
- Displays alert cards
- Handles logout
- Shows loading/error states

### `src/components/RecentAlertCard.tsx`
Individual alert display:
- Shows alert image
- Displays timestamp and weapons count
- Applies red border for alerts < 1 hour old
- Handles image loading errors with fallback

---

## 🎨 Theme & Styling

The application uses a custom navy blue theme matching the Terra-Civitas logo:

- **Primary Color**: `hsl(215 30% 25%)` - Dark navy blue
- **Typography**: System fonts with Tailwind defaults
- **Layout**: Responsive grid system
- **Components**: shadcn/ui with custom theming

---

## 🔒 Security Notes

- ✅ Environment variables not committed to git
- ✅ JWT tokens for authentication
- ✅ Protected routes require login
- ✅ Supabase Row Level Security (RLS) should be configured
- ✅ HTTPS enforced in production
- ⚠️ Ensure Supabase RLS policies are set up for production

---

## 📝 Common Issues & Solutions

### Issue: "Supabase not configured" error
**Solution**: Check that environment variables are set correctly in `.env.local`

### Issue: Images not loading
**Solution**: 
1. Verify images exist in Supabase Storage bucket `alert-images`
2. Check bucket is set to "Public"
3. Verify path: `verified_alerts/images/{filename}.jpg`

### Issue: Login fails on deployed site
**Solution**: Add your Vercel URL to Supabase Authentication → URL Configuration

### Issue: Alerts not appearing
**Solution**: 
1. Check Supabase database has data in `verified_alerts` table
2. Verify Supabase credentials in environment variables
3. Check browser console for errors

---


