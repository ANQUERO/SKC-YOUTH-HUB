# Local setup and moving SKC Youth Hub to another computer

This guide supports two cases:

1. Start a new installation with an empty database.
2. Move the current installation, including its PostgreSQL data, to another
   computer.

Commands below use PowerShell. Run them from the repository root unless a step
says otherwise.

## 1. Install the prerequisites

Install:

- Git
- Node.js 22 or 24 and npm
- PostgreSQL 15 or newer, including `psql`, `createdb`, `pg_dump`, and
  `pg_restore`
- A Cloudinary account for profile pictures, post media, and attachments
- An SMTP account if password-reset emails are required

Confirm the command-line tools are available:

```powershell
git --version
node --version
npm.cmd --version
psql --version
```

If `psql` is not recognized on Windows, add PostgreSQL's `bin` directory to
`PATH`, such as `C:\Program Files\PostgreSQL\17\bin`, and open a new terminal.
You can also perform the database steps with pgAdmin.

## 2. Copy or clone the repository

```powershell
git clone <your-repository-url> SKC-YOUTH-HUB
Set-Location SKC-YOUTH-HUB
```

Do not copy `node_modules`, `client/dist`, or either real `.env` file from a
public repository. Dependencies are restored from the lockfiles.

## 3. Create local environment files

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Edit `server/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skc
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password

JWT_SECRET=replace_with_a_long_random_secret

PORT=4521
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Generate a JWT secret in PowerShell instead of inventing a short password:

```powershell
$secretBytes = New-Object byte[] 48
$randomGenerator = [Security.Cryptography.RandomNumberGenerator]::Create()
$randomGenerator.GetBytes($secretBytes)
[Convert]::ToBase64String($secretBytes)
$randomGenerator.Dispose()
```

Copy the printed value into `JWT_SECRET`. A different value invalidates tokens
created on the previous computer, so copy the old secret only when existing
sessions must remain valid and you can transfer it securely.

Edit `client/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:4521
```

In development, browser requests go to `/api` on Vite and Vite proxies them to
this backend URL. Do not add `/api` to `VITE_BACKEND_URL`.

### Variables that should not be copied from the old README

- `DATABASE_URI` is not used.
- `JWT_EXPIRES_IN` is currently not used; tokens expire after the duration in
  `server/src/utils/jwt.js`.
- `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` are not used by the current
  application. The current client does not contain Google OAuth login code.

### SMTP and Cloudinary

SMTP is used by the forgot-password flow. For Gmail, enable 2-Step Verification
and create an App Password; do not use the normal Gmail password. See Google's
[App Password documentation](https://support.google.com/mail/answer/185833).

The server reads the three separate Cloudinary values shown above. Find them in
the Cloudinary console and keep the API secret server-side. See the
[Cloudinary Node.js configuration documentation](https://cloudinary.com/documentation/node_integration).

The application can start without SMTP or Cloudinary values, but forgot-password
email or file uploads will fail when those features are used.

## 4A. Create a fresh PostgreSQL database

Create the database and apply the schema:

```powershell
createdb -U postgres skc
psql -U postgres -d skc -v ON_ERROR_STOP=1 -f schema.sql
```

With pgAdmin instead:

1. Connect to the local PostgreSQL server.
2. Create a database named `skc`.
3. Select the `skc` database and open Query Tool.
4. Open `schema.sql` and execute the entire file once.

Do not execute `schema.sql` repeatedly against an initialized database because
it uses `CREATE TABLE` without `IF NOT EXISTS`.

## 4B. Move the existing database instead

On the old computer, create a custom-format backup:

```powershell
pg_dump -U postgres -d skc -Fc -f skc.backup
```

Transfer `skc.backup` privately. It can contain passwords, email addresses, and
other personal information; never commit it to Git.

On the new computer, create an empty database and restore:

```powershell
createdb -U postgres skc
pg_restore -U postgres -d skc --no-owner --no-privileges skc.backup
```

Do not run `schema.sql` before restoring a full database backup because the
backup already contains the schema.

Uploaded files are stored in Cloudinary, not PostgreSQL. Keep the old
Cloudinary account and credentials if restored database rows should continue to
point to the existing media. Moving to a different Cloudinary account requires
copying the assets and updating their stored URLs.

## 5. Install dependencies

```powershell
Set-Location server
npm ci

Set-Location ../client
npm ci

Set-Location ..
```

Use `npm ci` for a reproducible installation from `package-lock.json`. Use
`npm install` only when intentionally changing dependencies.

## 6. Start the application

Backend terminal:

```powershell
Set-Location server
npm run dev
```

Expected output includes a successful database connection and:

```text
Server is running at http://localhost:4521
```

Frontend terminal:

```powershell
Set-Location client
npm run dev
```

Open `http://localhost:5173`.

## 7. Create the first official account

The first official can be created without authentication only while
`sk_official` is empty. It is always created as `super_official`. Later official
accounts must be created by an authenticated super official.

Example PowerShell request:

```powershell
$adminBody = @{
  email = "admin@example.com"
  password = "ChangeMe123!"
  role = "super_official"
  official_position = "SK Chairperson"
  first_name = "Admin"
  middle_name = ""
  last_name = "User"
  suffix = ""
  contact_number = "09000000000"
  gender = "Male"
  age = 25
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:4521/api/auth/adminSignup" `
  -ContentType "application/json" `
  -Body $adminBody
```

Replace the example email and password. Values such as `age` must be valid
numbers; do not append punctuation to numeric values.

Youth signup is available in the web application. Despite an older success
message mentioning email verification, the current code requires an official to
approve new youth accounts from the Verification page.

## 8. Verify the installation

```powershell
Set-Location server
npm test
npm run lint

Set-Location ../client
npm test
npm run lint
npm run build
```

Then manually test:

1. Official login.
2. Youth registration and official approval.
3. Youth login.
4. Profile-picture upload for both account types.
5. Post creation, comments, reactions, and page refresh.
6. Forgot-password email if SMTP is configured.

## Common local problems

### `Not Found` from `/api/auth/adminSignup`

Use `POST http://localhost:4521/api/auth/adminSignup` and restart the backend
after route changes. `/api/auth` is registered in `server/app.js`.

### `403 Forbidden` during login

The youth account may still be awaiting official verification, may be inactive,
or the credentials are invalid. Check the response JSON and backend terminal.

### `500` from `/api/profile`

Confirm that the backend is running, `schema.sql` was applied to the configured
database, and all `DB_*` values point to that same database.

### Browser requests go to port 5173

This is normal during development. Vite receives `/api` requests at port 5173
and proxies them to the backend configured by `VITE_BACKEND_URL`.

### `Backend server is unavailable`

Start the backend on port 4521 and ensure `VITE_BACKEND_URL` has the same origin.

### CORS error

Set `CLIENT_URL` to the exact frontend origin, including scheme and port but no
path, for example `http://localhost:5173`. Restart the backend after changing it.
