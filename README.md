<div align="center">

# 💎 HOA Code Lab
### The Ultimate Full-Stack IDE for the Modern Web

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![WebContainers](https://img.shields.io/badge/Runtime-WebContainers-blue?style=for-the-badge)](https://webcontainers.io/)

**Build. Run. Ship. Entirely in your browser.**  
HOA Code Lab is a high-performance development environment that bridges the gap between local power and cloud flexibility.

[Explore Templates](https://github.com/helpofai/HOA-Code-Lab) • [Documentation](#-getting-started) • [Report Bug](https://github.com/helpofai/HOA-Code-Lab/issues)

</div>

---

## 🏗️ The Vision
HOA Code Lab isn't just another code editor. It’s a **Full-Stack Runtime** powered by the latest WebContainer technology. By executing a real Node.js environment directly in your browser's microkernel, we provide a zero-latency, secure, and infinitely scalable development experience.

> "A professional-grade workspace that lives where your users do—in the browser."

---

## ✨ Premium Features

#### 🖥️ Pro-Grade Interface (VS Code Mirror)
*   **Intelligent Workspace:** Industry-standard **Monaco Editor** with multi-cursor support and advanced syntax highlighting.
*   **Hierarchical Explorer:** Recursive tree structure with **vertical indentation guides**, animated chevrons, and specialized file icons.
*   **Activity Command Center:** Quick-switch between File Explorer, Global Search, Source Control, and Network monitoring.
*   **Integrated Terminal:** A low-latency, fully interactive **`jsh` shell** supporting NPM, Node, and standard Linux utilities.

#### ⚡ Full-Stack Runtime Engine
*   **Zero-Install Node.js:** Boot a full Node environment in seconds. Install dependencies and start servers without ever leaving the tab.
*   **Intelligent Port Forwarding:** Automatic detection of running servers with secure, shareable **Preview URLs**.
*   **Filesystem Mirroring:** A high-speed server-side disk cache that keeps your environment synchronized across sessions.

#### 🐙 Deep GitHub Integration
*   **Automated Backups:** Every project is backed by a **Private GitHub Repository**, automatically created and linked on launch.
*   **Source Control Dashboard:** A dedicated UI for manual Commits, Pushes, and Pulls with a visual **Version History Timeline**.
*   **Verification Wizard:** Real-time token health checks, API rate-limit tracking, and granular scope verification.

#### 🧪 Elite Template Engine
*   **Curated Blueprints:** 9+ high-fidelity boilerplates including **React + Tailwind v4**, **Fastify**, **Next.js**, and **Drizzle ORM**.
*   **One-Click Scaffolding:** Instant project initialization with professional file structures and pre-configured toolchains.

---

## 🛠️ Technological Foundation

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, Vite 7, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **Runtime** | WebContainers API, Xterm.js |
| **State Management** | Zustand (Persistent & Ephemeral) |
| **Backend API** | Node.js, Express, MySQL |
| **Data Layer** | Drizzle ORM, MySQL2 |
| **Integrations** | Socket.IO, Octokit (GitHub API) |

---

## 🚀 Professional Setup

### 1️⃣ Clone & Initialize
```bash
git clone https://github.com/helpofai/HOA-Code-Lab.git
cd HOA-Code-Lab
```

### 2️⃣ Configure Environment
Navigate to `/server` and create a `.env` file:
```env
DB_HOST=localhost
DB_USER=hoa-code-lab
DB_PASSWORD=hoa-code-lab
DB_NAME=hoa-code-lab
JWT_SECRET=your_secure_random_key
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
```

### 3️⃣ Synchronize Database
```bash
cd server
npm install
npm run db:generate
npm run db:migrate
```

### 4️⃣ Launch Workspace
**Terminal A (Server):**
```bash
npm run dev
```
**Terminal B (Client):**
```bash
cd client
npm install
npm run dev
```

---

## 📂 Project Architecture

```text
📂 HOA-Code-Lab
├── 📂 client             # React 19 Frontend (Vite)
│   ├── 📂 src/components # Reusable UI & IDE Widgets
│   ├── 📂 src/hooks      # Custom Socket & Auth Logic
│   ├── 📂 src/pages      # High-end View Layouts
│   └── 📂 src/store      # Global Zustand State
├── 📂 server             # Node.js / Express API
│   ├── 📂 ProjectStore   # Physical Disk Cache for Projects
│   ├── 📂 src/db         # Drizzle Schema & Migrations
│   └── 📂 src/routes     # Auth, Projects & Git Endpoints
└── 📂 drizzle            # Generated SQL Migrations
```

---

## 🤝 Contribution & Community
We are building the future of web development. Contributions are what make the open-source community such an amazing place to learn, inspire, and create. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Built with ❤️ for the Developer Community by **Help of AI**

</div>