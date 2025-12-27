# 🚀 CodePen Pro Clone - Full Stack Development Platform

![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/Frontend-React%2018-cyan.svg)
![Node](https://img.shields.io/badge/Backend-Node.js%20Express-brightgreen.svg)
![Database](https://img.shields.io/badge/Database-MySQL-orange.svg)

A professional-grade, high-performance web development environment. This platform allows developers to build, test, and share code snippets (Pens) in real-time, featuring a premium UI/UX, robust authentication, and an advanced administrative control system.

---

## 💎 Advanced Features

### 💻 The Editor Experience
- **Monaco Engine:** VS Code-level features including Bracket Pair Colorization, IntelliSense, and Auto-Formatting.
- **Intelligent Resizing:** Multi-pane adjustable layout with vertical/horizontal drag support.
- **Instant Preview:** Real-time rendering with isolated script execution protection.
- **Dynamic Assets:** Support for external CDN libraries (Three.js, GSAP, etc.) without conflicts.

### 📊 Professional Dashboards
- **System Overview:** High-level analytics, traffic graphs, and server health monitoring.
- **User Insights:** Individual engagement metrics (Views, Likes, Shares) and activity heatmaps.
- **Project Management:** Visual card-based project organization with live high-res thumbnails.

### 🛡️ Secure Infrastructure
- **JWT Authentication:** Stateful user sessions with secure Bcrypt password hashing.
- **Role-Based Access Control (RBAC):** Distinct permission tiers for `user`, `paid-user`, and `admin`.
- **Global Broadcast:** Real-time notification system allowing admins to alert all users instantly.

---

## 🛠️ Architecture & Tech Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, Socket.io, JSON Web Tokens (JWT) |
| **Database** | MySQL (Relational Schema with JSON support for virtual file systems) |
| **Utilities** | Axios, Date-fns, MySQL2, Bcrypt.js |

---

## 🚀 Installation & Setup

### 1. Environment Configuration
Create a `.env` file in the project root:

```env
# Server Config
PORT=5000
NODE_ENV=development

# Database Config
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=codepen-clone

# Security
JWT_SECRET=generate_a_random_long_string
```

### 2. Database Initialization
Run the following commands in the `backend` directory to prepare your data environment:

```bash
# Install backend dependencies
npm install

# Step 1: Create Tables
npm run db:init

# Step 2: Sync New Columns (Views, Likes, etc.)
npm run db:sync

# Step 3: Initialize Global Site Settings
npm run db:settings
```

### 3. Running Development Servers
You need to run both the API and the UI simultaneously.

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 User Management & Admin Access

### Roles Overview
| Role | Permissions |
| :--- | :--- |
| **User** | Create/Edit Pens, View Insights, Profile Settings, Receive Notifications |
| **Paid User** | *Extended Features (Asset Hosting, Private Pens)* |
| **Admin** | Access System Overview, User Management, Broadcast Alerts, Frontend Config |

### Promoting to Admin
To grant administrative privileges to a user, run this command in the `backend` folder:
```bash
npm run db:promote YOUR_USERNAME
```

---

## 📦 Production Deployment

### Frontend (Static Files)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your static host (Vercel, Netlify, or Nginx).

### Backend (Process Manager)
It is recommended to use **PM2** to ensure the API stays online:
```bash
npm install -g pm2
pm2 start server.js --name codepen-api
```

---

## 📂 Project Directory Structure

```text
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI, Layout, & View Components
│   │   ├── pages/          # Full-page View components
│   │   ├── store/          # Zustand State Management
│   │   └── services/       # API Integration Layer
├── backend/                # Node.js API
│   ├── src/
│   │   ├── controllers/    # Business Logic
│   │   ├── models/         # Database Queries
│   │   └── routes/         # API Endpoints
├── init.sql                # Initial Database Schema
└── README.md               # Project Documentation
```

---

## 📝 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---
Built with ⚡ and ❤️ for developers.