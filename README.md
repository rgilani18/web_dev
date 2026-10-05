# Simple Clothing Store (Full-Stack)

This project is a simple university assignment app built with plain HTML/CSS/JavaScript on the frontend and a Netlify Function + Supabase PostgreSQL on the backend.

## Project structure

- `/index.html` - homepage UI (product list + add form)
- `/style.css` - responsive styling
- `/script.js` - frontend logic using `fetch()`
- `/netlify/functions/products.js` - API endpoints (GET, POST, DELETE)
- `/database.sql` - SQL schema and sample data for Supabase
- `/netlify.toml` - Netlify build/function configuration
- `/package.json` - Node dependencies (`@supabase/supabase-js`)
- `/.gitignore` - prevents secrets and dependencies from being committed

## 1) Create Supabase database/table

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase.
3. Copy and run the SQL from `/database.sql`.

This creates a `products` table with:
- `id`
- `name`
- `price`
- `category`
- `created_at`

and inserts sample products.

## 2) Run `database.sql`

From Supabase SQL Editor:
- Open `database.sql`
- Execute the entire script
- Confirm the `products` table has rows in **Table Editor**

## 3) Configure Netlify environment variables

In Netlify site settings, add:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

> Important: Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend files.

## 4) Deploy from GitHub to Netlify

1. Push this repository to GitHub.
2. In Netlify, click **Add new site** > **Import an existing project**.
3. Select this GitHub repository.
4. Netlify will read `netlify.toml` automatically.
5. Add the environment variables above.
6. Deploy the site.

## Local development

```bash
npm install
npm run dev
```

Then open the local Netlify URL and test:
- Product listing (GET)
- Add product form (POST)
- Delete button (DELETE)
