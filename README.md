# NoteSync 

**NoteSync** is a real-time collaborative note-taking web application inspired by Notion-style block editing. It allows users to create, edit, and share notes securely, with every change broadcast live to collaborators in real time.

The project is fully authenticated, supports multiple access modes, and is built as a modern **monorepo** for scalability and clear separation of concerns.

---


## 💻 DEMO
<div>
    <a href="https://www.loom.com/share/4c3e245075664bb9bce10d5942fb7c51">
      <p>Showcasing NoteSync: A Real-Time Collaborative Note-Taking Tool - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/4c3e245075664bb9bce10d5942fb7c51">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/4c3e245075664bb9bce10d5942fb7c51-62d553b25600ea9d-full-play.gif#t=0.1">
    </a>
  </div>


## ✨ Features

- 🧱 **Block-based Editor** - Notion-like editing experience with BlockNote
- 🔄 **Real-time Collaboration** - Live edits synced across all users instantly
- 👥 **Note Sharing** - Share notes with granular access control
- ✍️ **Two Access Modes**
  - **Editor** – Full edit permissions
  - **Viewer** – Read-only access
- 🔐 **Secure Authentication** - No unauthorized access to notes
- 🧩 **Monorepo Architecture** - Scalable and maintainable codebase
- 💾 **Automatic Persistence** - All changes saved to database in real-time
- ⚡ **Built with Modern Tech** - Leveraging the latest web technologies

---

## 🏗️ Architecture Overview

This repository is a **PNPM monorepo** structured as follows:
```text
notesync/
├── apps/
│   ├── web-app/           # Frontend (TanStack Start)
│   └── hono-server/       # Backend (Hono + Hocuspocus)
│
├── packages/
│   └── db/                # Neon DB + Drizzle ORM setup
│
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # PNPM workspace definition
└── README.md
```

---

## 📦 Applications

### `apps/web-app`

**Frontend Application** built with **TanStack Start**

**Responsibilities:**
- 🎨 UI rendering and user interface
- 🔑 Authentication flows
- 📝 Block-based editor (BlockNote)
- 🔄 Real-time collaboration client
- 🎭 State management and routing

### `apps/hono-server`

**Backend Server** built with **Hono** running a **Hocuspocus** collaboration server

**Responsibilities:**
- 🔐 Authentication (`onAuth`)
- 📄 Document fetching and management
- 🔄 Real-time update broadcasting via WebSockets
- 💾 Persisting editor state to the database
- 🛡️ Authorization and access control

---

## 📚 Shared Packages

### `packages/db`

**Centralized Database Layer**

- 🐘 **Neon** PostgreSQL database
- 🔧 **Drizzle ORM** schema & migrations
- 📦 Shared across all services for consistency

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [TanStack Start](https://tanstack.com/start)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Editor:** [BlockNote](https://www.blocknotejs.org/)
- **Real-time:** Yjs + Hocuspocus Client

### Backend
- **Framework:** [Hono](https://hono.dev/)
- **Collaboration:** [Hocuspocus](https://tiptap.dev/hocuspocus) (Yjs-based)
- **Language:** TypeScript

### Database
- **Database:** [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)

### Authentication
- **Auth Provider:** [Better-Auth](https://www.better-auth.com/)

### Tooling
- **Package Manager:** [PNPM](https://pnpm.io/) Workspaces
- **Language:** TypeScript
- **Migrations:** Drizzle Kit

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18
- **PNPM** >= 8
- A [Neon](https://neon.tech/) database account

---

## 📦 Installation
```bash
git clone https://github.com/BodaNabeel/notesync.git
cd notesync
pnpm install
```

---

## 🔐 Environment Variables

Both applications require **separate `.env` files**:

- `apps/web-app/.env`
- `apps/hono-server/.env`

Refer to the corresponding **`.env.example`** files in each app directory for all required variables.

> ⚠️ **Important:** Never commit `.env` files to version control.

---

## 🗄️ Database Setup

Run all database commands from the **repository root**:
```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema to database
pnpm db:push
```

---

## 🧪 Development

### Start the Backend Server

From the root directory:
```bash
pnpm dev:hono
```

The Hocuspocus server will start and listen for WebSocket connections.

### Start the Frontend App

In a new terminal, from the root directory:
```bash
pnpm dev:app
```

The web application will be available at `http://localhost:3000` (or your configured port).

---

## 🏁 Production Build

### Build the Web App

From `apps/web-app`:
```bash
pnpm build
pnpm start
```

### Build the Server

From `apps/hono-server`:
```bash
pnpm build
pnpm start
```

### Build Everything (from root)
```bash
pnpm build
```

---

## 📜 Available Scripts

### Root Level
- `pnpm install` - Install all dependencies
- `pnpm dev:app` - Start frontend development server
- `pnpm dev:hono` - Start backend development server
- `pnpm build` - Build all packages and applications
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database

---

## 🗂️ Project Structure
```
notesync/
├── apps/
│   ├── web-app/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── hono-server/
│       ├── src/
│       ├── package.json
│       └── .env.example
│
├── packages/
│   └── db/
│       ├── src/
│       │   ├── schema/
│       │   └── migrations/
│       ├── drizzle.config.ts
│       └── package.json
│
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [BlockNote](https://www.blocknotejs.org/) for the amazing block-based editor
- [Hocuspocus](https://tiptap.dev/hocuspocus) for real-time collaboration infrastructure
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [TanStack](https://tanstack.com/) for the modern React framework

---

Made with ❤️ using TanStack Start, Hono, and Yjs
