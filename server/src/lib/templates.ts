export const PROJECT_TEMPLATES: Record<string, Record<string, any>> = {
    html: {
        'index.html': { 
            name: 'index.html', 
            path: 'index.html', 
            type: 'file', 
            content: `<!DOCTYPE html>
<html>
<head>
  <title>Static Site</title>
</head>
<body>
  <h1>Welcome to HOA Code Lab</h1>
</body>
</html>` 
        },
        'style.css': { 
            name: 'style.css', 
            path: 'style.css', 
            type: 'file', 
            content: `body { 
  font-family: sans-serif; 
  background: #111; 
  color: white; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
  margin: 0; 
}` 
        },
        'script.js': { 
            name: 'script.js', 
            path: 'script.js', 
            type: 'file', 
            content: `console.log("Static project loaded!");` 
        }
    },
    'react-tailwind': {
        'src/App.tsx': { 
            name: 'App.tsx', 
            path: 'src/App.tsx', 
            type: 'file', 
            content: `import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
      <h1 className="text-4xl font-bold text-blue-400 border-b-2 border-blue-500 pb-2">
        React + Tailwind v4
      </h1>
    </div>
  );
}` 
        },
        'src/main.tsx': { 
            name: 'main.tsx', 
            path: 'src/main.tsx', 
            type: 'file', 
            content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
` 
        },
        'src/index.css': { 
            name: 'index.css', 
            path: 'src/index.css', 
            type: 'file', 
            content: `@import "tailwindcss";` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-react-tailwind",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "tailwindcss": "next",
    "@tailwindcss/vite": "next"
  }
}` 
        },
        'index.html': { 
            name: 'index.html', 
            path: 'index.html', 
            type: 'file', 
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HOA React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>` 
        },
        'vite.config.ts': { 
            name: 'vite.config.ts', 
            path: 'vite.config.ts', 
            type: 'file', 
            content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});` 
        }
    },
    node: {
        'server.js': { 
            name: 'server.js', 
            path: 'server.js', 
            type: 'file', 
            content: `import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "HOA Node.js API is active",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-node-api",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}` 
        }
    },
    'fullstack-auth': {
        'server/index.js': { 
            name: 'index.js', 
            path: 'server/index.js', 
            type: 'file', 
            content: `console.log("Fullstack Auth Backend Initialized");` 
        },
        'client/src/App.tsx': { 
            name: 'App.tsx', 
            path: 'client/src/App.tsx', 
            type: 'file', 
            content: `export default function App() {
  return <div>Secure Fullstack Application</div>;
}` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-fullstack-auth",
  "version": "1.0.0",
  "type": "module"
}` 
        }
    },
    'nextjs': {
        'app/page.tsx': { 
            name: 'page.tsx', 
            path: 'app/page.tsx', 
            type: 'file', 
            content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Next.js + HOA</h1>
    </main>
  );
}` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.3"
  }
}` 
        }
    },
    'fastify': {
        'app.js': { 
            name: 'app.js', 
            path: 'app.js', 
            type: 'file', 
            content: `import Fastify from "fastify";
const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return { hello: "world", engine: "fastify" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-fastify-api",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "fastify": "^4.26.0"
  }
}` 
        }
    },
    'admin-dashboard': {
        'src/Dashboard.tsx': { 
            name: 'Dashboard.tsx', 
            path: 'src/Dashboard.tsx', 
            type: 'file', 
            content: `import React from "react";
export default function Dashboard() {
  return <div className="p-8">Admin Metrics Overview</div>;
}` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-admin-ui",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.1",
    "recharts": "^2.12.7"
  }
}` 
        }
    },
    'ts-lib': {
        'src/index.ts': { 
            name: 'index.ts', 
            path: 'src/index.ts', 
            type: 'file', 
            content: `export const version = "1.0.0";
export const add = (a: number, b: number): number => a + b;` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-typescript-library",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "typescript": "^5.5.3",
    "vitest": "^1.6.0"
  }
}` 
        }
    },
    'drizzle-orm': {
        'src/db/schema.ts': { 
            name: 'schema.ts', 
            path: 'src/db/schema.ts', 
            type: 'file', 
            content: `import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 })
});` 
        },
        'package.json': { 
            name: 'package.json', 
            path: 'package.json', 
            type: 'file', 
            content: `{
  "name": "hoa-drizzle-starter",
  "version": "1.0.0",
  "dependencies": {
    "drizzle-orm": "latest",
    "mysql2": "latest"
  }
}` 
        }
    }
};

export function getTemplateFiles(type: string) {
    return PROJECT_TEMPLATES[type] || PROJECT_TEMPLATES['html'];
}