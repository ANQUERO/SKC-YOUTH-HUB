# SKC Youth Hub

SKC Youth Hub is a PERN application for youth registration and verification,
official administration, posts, comments, reactions, notifications, feedback,
and profile management.

## Project structure

```text
SKC-YOUTH-HUB/
|-- client/        React 19 and Vite frontend
|-- server/        Express 5 API
|-- schema.sql     PostgreSQL schema for a new database
`-- docs/          Setup and deployment guides
```

## Documentation

- [Local setup and moving to another computer](docs/LOCAL_SETUP.md)
- [Cloud deployment](docs/CLOUD_DEPLOYMENT.md)

## Quick start

You need Node.js, npm, PostgreSQL, Cloudinary credentials, and optionally SMTP
credentials for password-reset emails.

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Create a PostgreSQL database named `skc`, run `schema.sql`, update both `.env`
files, and install dependencies:

```powershell
Set-Location server
npm ci
Set-Location ../client
npm ci
```

Start the API and client in separate terminals:

```powershell
Set-Location server
npm run dev
```

```powershell
Set-Location client
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4521` by
default.

## Verification commands

```powershell
Set-Location server
npm test
npm run lint

Set-Location ../client
npm test
npm run lint
npm run build
```

Never commit `server/.env`, `client/.env`, database backups, API secrets, or
real user data.
