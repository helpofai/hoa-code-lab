
Recommended Tech Stack (Final)
🌐 Frontend

React + Vite → fast, modern UI

Monaco Editor → VS Code-level editor experience

iframe sandbox → secure live preview

Tailwind CSS → quick, clean UI styling

Zustand → simple state management

🖥 Backend

Node.js + Express

Socket.IO → live sync / autosave

JWT Authentication

PM2 → keep backend running on VPS

🗄 Database

MySQL (best with aaPanel) db-name=codepen-clone, user=codepen-clone, password=codepen-clone.

**Full Project Structure (Single Root)**
codepen-clone/
│
├── frontend/                     # React + Vite app
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── assets/               # Images, icons
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Editor/
│   │   │   │   ├── HtmlEditor.jsx
│   │   │   │   ├── CssEditor.jsx
│   │   │   │   └── JsEditor.jsx
│   │   │   │
│   │   │   ├── Preview/
│   │   │   │   └── LivePreview.jsx
│   │   │   │
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   └── UI/               # Buttons, Modals, Tabs
│   │   │       ├── Button.jsx
│   │   │       └── Modal.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── EditorPage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── store/                # Zustand / Redux
│   │   │   └── editorStore.js
│   │   │
│   │   ├── services/             # API calls
│   │   │   ├── api.js
│   │   │   └── pen.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── iframeBuilder.js
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Pen.model.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── pen.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── pen.routes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── services/
│   │   │   └── pen.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── response.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
├── nginx/                        # Optional (for VPS)
│   └── codepen.conf
│
├── .env                          # Shared env vars
├── .gitignore
├── package.json                  # Root scripts (optional)
└── README.md


