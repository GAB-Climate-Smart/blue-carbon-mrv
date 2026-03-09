# Blue Carbon MRV

An integrated platform for Blue Carbon Monitoring, Reporting, and Verification (MRV).

## Architecture

- **Frontend**: Next.js (React) + TailwindCSS — deployed on [Vercel](https://vercel.com)
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL + PostGIS, Auth, Storage, Edge Functions)

## Quick Start

### 1. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API** copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 2. Apply database migrations

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your remote project (get the project ref from the dashboard URL)
supabase link --project-ref <your-project-ref>

# Push all migrations to your Supabase project
supabase db push
```

### 3. Configure the frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local and fill in your Supabase credentials
```

### 4. Run locally

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Deployment (Vercel)

1. Import the repository in Vercel and set **Root Directory** to `frontend`.
2. Add the following environment variables in **Vercel → Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

## Documents

The original project requirements and blueprints are located in the `docs/` directory.
