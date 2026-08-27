# Cloud deployment guide

This guide uses a managed PostgreSQL database, a Render Web Service for the
Express API, Netlify for the Vite client, and Cloudinary for uploaded media. The
same settings map to other providers, but field names differ.

Recommended production layout:

```text
Browser
  |-- HTTPS --> Netlify static site (client/dist)
  `-- HTTPS --> Render web service (server/)
                    |-- PostgreSQL connection --> managed database
                    `-- HTTPS uploads ----------> Cloudinary
```

Official provider references:

- [Render: deploy a Node/Express app](https://render.com/docs/deploy-node-express-app)
- [Render: monorepo root directories and deploy settings](https://render.com/docs/your-first-deploy)
- [Netlify: monorepo build configuration](https://docs.netlify.com/build/configure-builds/monorepos/)
- [Netlify: SPA rewrite rules](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
- [Neon: connect using `psql`](https://neon.com/docs/connect/query-with-psql-editor)
- [Cloudinary: Node.js configuration](https://cloudinary.com/documentation/node_integration)

## 1. Production checklist before deployment

1. Push the repository to a private or appropriately secured Git host.
2. Confirm `server/.env` and `client/.env` are not tracked:

   ```powershell
   git ls-files server/.env client/.env
   ```

   The command should print nothing.
3. Run all tests, lint checks, and the production client build.
4. Back up the local database if deploying existing data.
5. Create production Cloudinary and SMTP credentials.
6. Generate a new production `JWT_SECRET`; do not reuse an example value.

Vite variables are embedded into public browser JavaScript during the build.
Only put public configuration such as the API origin in `VITE_*` variables.
Never put database passwords, JWT secrets, SMTP passwords, or Cloudinary API
secrets in the client environment.

## 2. Create the production PostgreSQL database

Create a PostgreSQL database with Render Postgres, Neon, or another managed
provider. Copy the provider's connection string, typically:

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

The server supports this as `DATABASE_URL`. When `DATABASE_URL` is set, it takes
priority over `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.
Keep any provider-supplied SSL query parameters in the URL.

Initialize an empty cloud database from the repository root:

```powershell
psql "<production-database-url>" -v ON_ERROR_STOP=1 -f schema.sql
```

Alternatively, paste `schema.sql` into the provider's SQL editor and execute it
once.

### Moving existing local data to production

Back up locally:

```powershell
pg_dump -U postgres -d skc -Fc -f skc-production.backup
```

Restore into an empty cloud database:

```powershell
pg_restore `
  --dbname="<production-database-url>" `
  --no-owner `
  --no-privileges `
  skc-production.backup
```

Do not apply `schema.sql` before a full restore. Store the backup securely and
delete unnecessary copies after verifying the migration.

## 3. Reserve the Netlify site name

Create the Netlify site from the Git repository first so its permanent URL is
known, for example:

```text
https://skc-youth-hub.netlify.app
```

The first client build can wait until the backend URL is available.

## 4. Deploy the Express backend on Render

Create a new Render **Web Service** connected to the repository and set:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Root Directory | `server` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | leave empty unless a health endpoint is added |

Render supplies `PORT` for web services, so do not hardcode port 4521 in cloud
settings. The application already reads `process.env.PORT`.

Set these Render environment variables:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
JWT_SECRET=your_long_random_production_secret
NODE_ENV=production
CLIENT_URL=https://your-netlify-site.netlify.app

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Do not set fake values for optional services. Missing SMTP prevents password
reset email; missing Cloudinary values prevent media uploads.

Deploy and copy the Render service URL, for example:

```text
https://skc-youth-hub-api.onrender.com
```

The backend URL is an origin. API routes begin with `/api`, such as
`https://skc-youth-hub-api.onrender.com/api/auth/login`.

## 5. Deploy the Vite client on Netlify

Configure the reserved Netlify site:

| Setting | Value |
| --- | --- |
| Base directory | `client` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |

Add this build environment variable:

```dotenv
VITE_API_URL=https://skc-youth-hub-api.onrender.com
```

Use the real Render origin. `VITE_API_URL` may omit `/api` because the client
adds it. If `/api` is included, the client normalizes it without duplicating the
path.

Deploy the client. `client/public/_redirects` is copied into `dist` during the
Vite build and makes React Router pages work after a direct visit or refresh.

## 6. Finalize CORS

In Render, ensure `CLIENT_URL` exactly matches the deployed frontend origin:

```dotenv
CLIENT_URL=https://skc-youth-hub.netlify.app
```

Do not include a route or trailing slash. If both a Netlify URL and a custom
domain must work, separate origins with commas:

```dotenv
CLIENT_URL=https://skc-youth-hub.netlify.app,https://youth.example.gov.ph
```

Save the variable and redeploy/restart the backend. CORS configuration is read
when the server starts.

## 7. Configure a custom domain

If using custom domains:

1. Add the frontend domain in Netlify and configure its DNS records.
2. Add the API domain in Render and configure its DNS records.
3. Change Netlify's `VITE_API_URL` to the final API origin and rebuild the
   client.
4. Change Render's `CLIENT_URL` to the final frontend origin and redeploy.
5. Use HTTPS for both origins.

Environment changes to `VITE_API_URL` require a new client build because Vite
injects the value at build time.

## 8. Production smoke test

Test in this order:

1. Open the landing page and refresh a nested route such as `/signin`.
2. Open the backend login endpoint in the browser. A GET may return `404`, which
   is expected because login is POST; the backend must still respond over HTTPS.
3. Log in as an official.
4. Create or approve a youth account and log in as youth.
5. Confirm official and youth avatars remain different.
6. Create a post with media and confirm it appears after refresh.
7. Add a comment and reaction.
8. Trigger forgot-password and confirm SMTP delivery.
9. Inspect Render logs and browser Network responses for unexpected 4xx/5xx
   responses.

## 9. Cloud troubleshooting

### Render reports a database connection failure

- Confirm `DATABASE_URL` belongs to the intended database.
- Preserve `sslmode=require` when the provider requires TLS.
- Confirm the database accepts connections from Render.
- Apply `schema.sql` and verify the tables exist.
- Do not also rely on stale `DB_*` variables; `DATABASE_URL` takes priority.

### Render returns 502

- Do not set a local-only `PORT`; let Render supply it.
- Confirm Root Directory is `server` and Start Command is `npm start`.
- Read the deployment logs for missing environment variables or database errors.

### Netlify builds but API calls go to the Netlify domain

`VITE_API_URL` was absent during the build. Add the Render backend origin to
Netlify's environment variables and trigger a new deploy.

### Browser reports a CORS error or backend returns 403

Set Render's `CLIENT_URL` to the exact Netlify/custom-domain origin and restart
the backend. Do not put the API URL in `CLIENT_URL`.

### Refreshing a client route returns 404

Confirm `_redirects` exists in the deployed output and contains:

```text
/*  /index.html  200
```

### Images or uploads fail

Confirm all three Cloudinary server variables are configured. Do not put the
Cloudinary API secret in Netlify.

### Password-reset email fails

Confirm all four SMTP variables are configured. With Gmail, use an App Password
created after enabling 2-Step Verification.

## 10. Backups, updates, and rollback

- Schedule managed PostgreSQL backups appropriate for the sensitivity of youth
  data.
- Back up before schema or application updates.
- Deploy the backend before a client release that depends on new API behavior.
- Keep the previous successful deployment available for rollback.
- Treat database backups, `.env` files, SMTP credentials, JWT secrets, and user
  attachments as sensitive data.
- Rotate a secret immediately if it is committed or exposed. Rotating
  `JWT_SECRET` signs all users out.
