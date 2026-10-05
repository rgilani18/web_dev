# Simple Clothing Store (Netlify + Supabase)

A simple full-stack clothing store for a university assignment using plain HTML/CSS/JavaScript on the frontend, a Netlify Function backend, and Supabase PostgreSQL for storage.

## Project structure

- `/index.html` - Frontend page
- `/style.css` - Frontend styles
- `/script.js` - Frontend logic (fetch GET/POST/DELETE)
- `/netlify/functions/products.js` - Backend API (GET, POST, DELETE)
- `/database.sql` - SQL schema + sample data
- `/netlify.toml` - Netlify configuration
- `/package.json` - Node dependencies
- `/.gitignore` - Prevents secrets and dependencies from being committed

## Create the Supabase database

1. Create a Supabase project.
2. Open the **SQL Editor** in Supabase.
3. Copy the contents of `/database.sql`.
4. Run the script.

This creates the `products` table with:
- `id`
- `name`
- `price`
- `category`
- `created_at`

It also inserts sample products.

## How to run database.sql

- In Supabase SQL Editor, run the full contents of `/database.sql`.
- Verify records by running:
  ```sql
  select * from public.products order by created_at desc;
  ```

## Configure Netlify environment variables

In Netlify (Site settings → Environment variables), add:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

> Keep these server-side only. Do not expose service role keys in frontend code.

## Deploy from GitHub to Netlify

1. Push this repository to GitHub.
2. In Netlify, click **Add new site → Import an existing project**.
3. Choose GitHub and select this repository.
4. Confirm settings from `netlify.toml`:
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Add required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
6. Deploy.

## Local development (optional)

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env` with the same environment variables.
3. Start Netlify dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown by Netlify CLI.
