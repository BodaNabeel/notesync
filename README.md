# NoteSync

**NoteSync** is a real-time collaborative note-taking web application inspired by Notion-style block editing. It allows users to create, edit, and share notes securely, with every change broadcast live to collaborators in real time.

The project is fully authenticated, supports multiple access modes, and is built as a modern **monorepo** for scalability and clear separation of concerns.

---

## ✨ Features

- 🧱 **Block-based editor** (Notion-like editing experience)
- 🔄 **Real-time collaboration** (live edits synced across users)
- 👥 **Note sharing** with access control
- ✍️ **Two access modes**
  - **Editor** – full edit permissions
  - **Viewer** – read-only access
- 🔐 **Authentication & authorization**
  - No unauthorized access to notes
- 🧩 **Monorepo architecture** for maintainability and scale

---

## 🏗️ Architecture Overview

This repository is a **PNPM monorepo** structured as follows:

```text
├── apps
│   ├── web-app        # Frontend (TanStack Start)
│   └── hono-server    # Backend (Hono + Hocuspocus)
│
├── packages
│   └── db             # Neon DB + Drizzle ORM setup
│
├── package.json       # Root workspace config
└── pnpm-workspace.yaml
```

---

## 📦 Applications

### `apps/web-app`
- Built with **TanStack Start**
- Responsibilities:
  - UI rendering
  - Authentication flows
  - Block-based editor (BlockNote)
  - Realtime collaboration client

### `apps/hono-server`
- Built with **Hono**
- Runs a **Hocuspocus** collaboration server
- Responsibilities:
  - Authentication (\`onAuth\`)
  - Document fetching
  - Real-time update broadcasting
  - Persisting editor state to the database

---

## 📚 Shared Packages

### `packages/db`
- **Neon** PostgreSQL database
- **Drizzle ORM** schema & migrations
- Centralized database layer shared across services

---

## 🧰 Tech Stack

### Frontend
- TanStack Start
- TypeScript
- BlockNote


### Backend
- Hono
- Hocuspocus (Yjs-based collaboration)

### Database
- Neon (PostgreSQL)
- Drizzle ORM

### Authentication
- Better-Auth

### Tooling
- PNPM Workspaces
- TypeScript
- Drizzle Kit

---

## 🚀 Getting Started

### Prerequisites

- Node.js **>= 18**
- PNPM

---

## 📦 Installation

```bash
git clone git@github.com:BodaNabeel/notesync.git
cd notesync
pnpm install
```

---

## 🔐 Environment Variables

Both applications require **separate \`.env\` files**.

- `apps/web-app/.env`
- `apps/hono-server/.env`

Refer to the corresponding **`.env.example`** files in each app for required variables.

> ⚠️ Never commit `.env` files to version control.

---

## 🗄️ Database Setup

Run all database commands from the **repository root**:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
```

---

## 🧪 Running the Project (Development)

From the root:

```bash
pnpm dev:hono
pnpm dev:app
```

---

## 🏁 Production Build

### Web App
Run from `apps/web-app`:

```bash
pnpm build
pnpm start
```

### Server
Run from `apps/hono-server`:

```bash
pnpm build
pnpm start
```

---

## 📄 License

MIT License

---

## 👤 Maintainer

Maintained by **Nabeel Boda**

