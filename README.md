<div align="center">
  <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 16px; display: inline-block; padding: 14px 28px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(79,70,229,0.3);">
    <h1 style="color: white; margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 900; letter-spacing: -0.5px;">HOLLOW</h1>
  </div>
  
  <h3>Production-Grade Financial Intelligence, Expense Tracker & Mobile App</h3>
  
  <p>
    A high-performance, full-stack financial operating system built with React, Vite, Tailwind CSS, and Node.js/Express. Complete with real-time liquidity analytics, monthly budget tracking, income management, category customization, receipt attachments, PDF/CSV reporting, and native mobile readiness (PWA + Capacitor).
  </p>
  
  <div>
    <img src="https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7.3-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js" alt="Node" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PWA-Ready-orange.svg?style=for-the-badge" alt="PWA" />
    <img src="https://img.shields.io/badge/Capacitor-Mobile-blue.svg?style=for-the-badge&logo=capacitor" alt="Capacitor" />
  </div>
</div>

---

## ✨ Features Overview

### 1. 💼 Dashboard & Visual Analytics
- **Net Liquidity & Asset Cycle**: Instant overview of Total Balance, Total Inflow, Total Outflow, and Monthly Savings Velocity.
- **Interactive Visualizations**: Interactive Recharts Donut chart for category capital allocation and Monthly Inflow vs Outflow trend bars.
- **Recent Ledger Records**: Live activity stream with type icons, category tags, amounts, and receipt attachments.
- **Active Budget Alerts**: Visual alert banners when monthly budget thresholds are approached or exceeded.

### 2. 💸 Advanced Expense Management
- **Full CRUD**: Add, Edit, Delete, and View expenses.
- **Multi-Filter Engine**: Filter expenses by Category, Payment Method (UPI, Credit Card, Debit Card, Net Banking, Cash, Bank Transfer), Date Range (Start & End), and Search keywords.
- **Multi-Field Support**: Title, Amount, Category, Date, Payment Method, Notes/Remarks, and Invoice/Receipt image attachments.
- **Receipt Image Attachment**: Built-in support for uploading and previewing receipt images directly inside the app.
- **Data Export**: One-click CSV export of filtered expenses.

### 3. 💰 Income Stream Tracking
- **Multi-Source Management**: Track Salary, Freelance projects, Investments, Rental income, Bonuses, and custom inflows.
- **Dedicated Ledger**: Inflow summaries, category filtering, search, and CSV export.

### 4. 🎯 Budget Target Control
- **Category Monthly Limits**: Set specific spending limits per category (e.g., Food: ₹12,000, Shopping: ₹8,000).
- **Live Spending Progress Bars**: Automatically calculates spent vs remaining budget.
- **Visual Threshold Warnings**: Subtle warning indicators when approaching limit (>= 80%) and prominent red alert states when exceeded (> 100%).

### 5. 🏷️ Category Management
- **Default & Custom Categories**: Includes comprehensive pre-configured categories and allows adding custom categories with custom emoji icons and accent colors.
- **Live Expense Summaries**: Real-time calculation of total outflow and transaction count per category.

### 6. 📊 Intelligence Reports & Exports
- **Timeframe Filtering**: All Time, This Month, Last 30 Days, This Year, or Custom Date Range.
- **Exporting**:
  - **CSV Export**: Direct spreadsheet download.
  - **Print / PDF Briefing**: Dedicated print styles optimized for clean PDF statements (`window.print()`).

### 7. 📱 Mobile Experience (PWA + Capacitor)
- **PWA (Progressive Web App)**: Installable directly on Android, iOS, Windows, and macOS with manifest and service worker caching.
- **Capacitor Configuration**: Configured with `capacitor.config.json` for one-command compilation into native Android APK / iOS projects.
- **Mobile-First Layout**: Bottom navigation bar on mobile, slide-out drawer menu, touch-friendly 44px+ targets, and safe-area notch padding.

### 8. 🔐 Authentication & Backend Architecture
- **JWT Authentication**: Register, Login, Token persistence, and Protected API routes.
- **Password Security**: Strong hashing with `bcryptjs`.
- **Hybrid Offline Resilience**: Seamless fallback to local storage if backend is disconnected or when using the app offline.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 7, Tailwind CSS 3.4, Recharts, Lucide React |
| **Backend** | Node.js, Express, JWT (`jsonwebtoken`), `bcryptjs`, CORS |
| **Mobile & PWA**| Web App Manifest, Service Worker, Capacitor 6/7 |
| **Storage / DB** | Persistent Atomic JSON DB Engine (Pluggable with MongoDB Atlas) + LocalStorage Cache |

---

## 📁 Project Structure

```text
Hollow/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & JWT configuration
│   │   ├── controllers/     # Auth, Expense, Income, Budget, Category, Report controllers
│   │   ├── middleware/      # JWT auth, error handling, validator
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Main Express server entry point
│   ├── .env.example         # Backend environment variables template
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend API documentation
│
├── public/
│   ├── manifest.json        # PWA Web App Manifest
│   ├── sw.js                # Offline Service Worker
│   └── icon-192.png         # PWA app icons
│
├── src/
│   ├── components/
│   │   ├── common/          # StatCard, Badge, EmptyState, ConfirmDialog
│   │   ├── layout/          # Sidebar, Header, MobileNav, MobileDrawer
│   │   └── modals/          # TransactionModal, BudgetModal, CategoryModal, ReceiptViewer
│   ├── constants/           # Categories, Currencies, Payment Methods
│   ├── context/             # AuthContext, ThemeContext, TransactionContext
│   ├── hooks/               # useLocalStorage, useDarkMode
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── ExpensesPage.jsx
│   │   ├── IncomePage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/            # api.js client with offline fallback
│   ├── utils/               # financialCalculations, exportUtils
│   ├── App.jsx              # Application Root & Routing
│   ├── index.css            # Tailwind & print styles
│   └── main.jsx             # React entry point
│
├── capacitor.config.json    # Capacitor Mobile App configuration
├── index.html               # Main HTML with PWA meta & fonts
├── package.json             # Root scripts & frontend dependencies
├── tailwind.config.js       # Tailwind theme configuration
├── test_api.js              # Automated backend test suite
└── vite.config.js           # Vite build & proxy configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: Version 18 or higher installed on your system.

### 2. Installation

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### 3. Running Locally

#### Run Backend Server:
```bash
npm run backend
```
The REST API will start on `http://localhost:5000`.

#### Run Frontend Dev Server:
In another terminal:
```bash
npm run dev
```
The web application will open on `http://localhost:5173`.

### 4. Testing All APIs
To execute automated verification across all endpoints:
```bash
npm run test:api
```

---

## 📱 Mobile App Conversion

### Option A: Progressive Web App (PWA)
1. Build the production app:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` directory to any static host (Vercel, Netlify, GitHub Pages).
3. On your phone (Chrome on Android or Safari on iOS), visit the site and tap **"Install App"** or **"Add to Home Screen"**.
4. The application opens as a standalone native-feeling full-screen app with offline support.

### Option B: Native Mobile App via Capacitor (Android & iOS)
1. Install Capacitor dependencies:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```
2. Build the web app bundle:
   ```bash
   npm run build
   ```
3. Add Android platform:
   ```bash
   npx cap add android
   npx cap copy android
   ```
4. Open the project in Android Studio to run on physical device or build APK:
   ```bash
   npx cap open android
   ```

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify / GitHub Pages)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL=https://your-backend.railway.app/api`

### Backend (Render / Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `JWT_SECRET=your_production_secret_key`
  - `CORS_ORIGIN=*`

---

## 🔒 Security Best Practices
- Passwords hashed with `bcryptjs` (salt rounds: 10).
- Stateless JWT verification with configurable token expiration.
- No plain-text passwords or secret keys stored in client source code.
- Sanitized input validation on all expense, income, budget, and authentication endpoints.
- Atomic file persistence preventing data corruption on server restarts.
