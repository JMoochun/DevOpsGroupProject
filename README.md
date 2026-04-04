# COMP231 - Section 401 - Team 3 W25 - Inventory Management System

Inventory app: **Express + MongoDB** API (`server/`) and **React (Vite)** UI (`client/`).

## Prerequisites

- Node.js 20+ recommended
- MongoDB (local or Atlas)

## Setup

1. **Server**
   - `cd server`
   - Copy `server/.env.example` to `server/.env` and set `MONGO_URI`, `JWT_SECRET`, and optionally `CLIENT_ORIGIN` (comma-separated origins allowed).
   - `npm install`
   - `npm run dev`

2. **Client**
   - `cd client`
   - `npm install`
   - `npm run dev` (default: http://localhost:5173)

3. **Tests**
   - Server: `cd server && npm test`
   - Client: `cd client && npm test`

## Mirror to your personal GitHub

After creating a new empty repository under your account (for example `your-username/inventory-management`):

```bash
cd comp231-inventory-team3
git remote rename origin upstream
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Use `upstream` to pull occasional updates from the team repo, and `origin` for your fork for course / DevOps work.
