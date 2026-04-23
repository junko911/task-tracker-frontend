# Task Tracker Web

React **SPA** (Vite + TypeScript + Tailwind) that talks to the **Task Tracker API** over GraphQL via Apollo Client.

## Stack

| Layer   | Technology        |
|---------|-------------------|
| UI      | React 18          |
| Build   | Vite 5            |
| Styling | Tailwind CSS      |
| Data    | Apollo Client     |

## Prerequisites

The GraphQL API must be running (see **`../backend/`** in this workspace), typically at **http://localhost:3001/graphql**.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default the app calls **`http://localhost:3001/graphql`**. Override with:

```bash
export VITE_GRAPHQL_URL=https://your-api.example.com/graphql
npm run dev
```

### Vite proxy (optional)

If you set **`VITE_GRAPHQL_URL=/graphql`**, requests go to the dev server and are proxied to **`API_PROXY_TARGET`** (default `http://127.0.0.1:3001`). Useful when the page is opened as `127.0.0.1` or a LAN IP so the API URL stays same-origin.

## Docker (frontend only)

Useful when you want the UI in a container while Rails runs on the host (port **3001**):

```bash
docker compose up --build
```

The compose file sets **`API_PROXY_TARGET=http://host.docker.internal:3001`** and **`extra_hosts`** so `host.docker.internal` resolves on Linux as well as Docker Desktop.

Start the backend on the host first, then run this compose.

## Production build

```bash
npm run build
```

Set **`VITE_GRAPHQL_URL`** at build time to your deployed API URL. The production Docker image serves static files with `serve` on port **3000**.

## Features

- Create, view, update, and delete tasks
- Filter by status (client-side list filter)
- Quick status advance on cards
