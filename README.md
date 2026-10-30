# FILMFOLIO

> **"Your Cinema. Your Collection. Your Story."**

Filmfolio is a multi-user movie collection management and cinephile journaling platform. Built with a dark cinematic design aesthetic (obsidian backgrounds and champagne-gold accents), Filmfolio enables cinema enthusiasts to discover films via TMDB, maintain isolated personal movie libraries, track viewing history in a chronological diary, author critical reviews, curate custom movie collections, analyze viewing habits with interactive charts, and connect with a community of film lovers.

---

## 🌟 Brand Identity & Aesthetic

- **Design System:** Obsidian Deep Dark (`#101014`, `#1B1B21`, `#222229`) with subtle Champagne-Gold accents (`#C5A46D`, `#E0C18B`) and Crisp Cinematic Cream typography (`#F5F1E8`).
- **Typography:** Playfair Display for editorial headings; Geist / Inter for application UI.
- **Logo:** Original minimalist film cell vector frame with director's aperture play beam.

---

## 🚀 Key Features

### 🎬 Movie Discovery & TMDB Integration
- Real-time TMDB API v3 integration with server-side caching and client proxy.
- Browse **Trending Films**, **Popular Films**, **Top Rated Classics**, and **Upcoming Releases**.
- Instant live debounced search across millions of films.
- Filter by genre (Action, Sci-Fi, Drama, Noir, Crime, Animation, etc.) and release year.
- Dynamic movie detail pages featuring high-resolution backdrops, cast profiles, runtime, language, official trailer video embeds, and similar recommendations.

### 📚 Personal Movie Library
- Complete CRUD operations for your personal film archive.
- Mark films as **Watched**, **Unwatched**, or **Planning**.
- Score films from **1 to 10** with personal decimal precision.
- Record watch dates and personal screening impressions.
- Instant search, status filtering, and sorting (by rating, release date, date added, or title).
- In-place quick editing modal.
- **CSV Data Export** of your personal library for offline spreadsheet archiving.

### 🔖 Prioritized Watchlist
- Queue films with **High**, **Medium**, or **Low** priority tags.
- Attach viewing intent notes (e.g. "Screen on IMAX", "Recommended by friend").
- One-click **Mark as Watched** action that transitions the film directly into your personal library while removing it from the queue.

### 📅 Chronological Movie Diary
- Log viewings on specific calendar dates.
- Multiple diary entries for the same movie are explicitly permitted (re-watch tracking).
- Re-watch indicators and chronological timeline view.
- In-place editing and deletion of diary entries.

### ✍️ Critical Ratings & Reviews
- Author in-depth critiques with 1-10 numerical ratings.
- Set review visibility to **Public** (shared with community) or **Private** (personal notes only).
- Community members can **Like** public critiques.
- Movie-specific critique views and author profiles.

### 🗂️ Curated Custom Collections
- Assemble themed movie anthologies (e.g., *70s Neo-Noir*, *Villeneuve Sci-Fi*, *Studio Ghibli Masterworks*).
- Dynamic cover backdrop collage generation from included films.
- Public collections can be shared with direct URLs.
- Add or remove films from collections seamlessly.

### 📊 Personal Viewing Analytics (Recharts)
- Monthly viewing velocity bar chart.
- Genre distribution donut chart.
- Personal rating frequency distribution chart (1-4, 5-6, 7-8, 9-10).
- Dominant genre and average score calculations based on genuine user records.

### ⚖️ Cinema Comparison Tool
- Side-by-side comparative analysis of two selected films.
- Compare directors, TMDB consensus scores, your personal scores, runtimes, release years, and genres.

### ✨ Filmfolio Wrapped
- Yearly cinema retrospective report.
- Highlights total films screened, most active viewing month, top-rated film, and top 5 masterworks.
- Shareable summary export.

### 👥 Cinephile Community
- Public user profiles with avatars, bios, and favorite genres.
- Follow and unfollow other film enthusiasts.
- Live public activity feed and review stream.
- Strict privacy protection: email addresses are never exposed, and private diary entries remain strictly isolated.

### 🛡️ Administrative Console
- Server-side verified administrator dashboard.
- Total accounts, library entries, and platform activity metrics.
- User management: search users, inspect permissions, suspend or reactivate accounts.
- Review moderation queue: **Approve**, **Flag**, or **Remove** reviews.
- System activity audit log.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, Server Components, Route Handlers) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Database** | Supabase PostgreSQL, Row Level Security (RLS) |
| **Authentication** | Supabase Auth (`@supabase/ssr`) |
| **Data Visualization** | Recharts |
| **External API** | The Movie Database (TMDB API v3) |
| **Notifications** | Sonner |
| **Deployment** | Vercel, GitHub |

---

## 🗄️ Database Architecture

The database schema is defined in SQL migrations under `supabase/migrations/`:

1. `20261030000001_initial_schema.sql`:
   - `profiles`: User profile data referencing `auth.users(id)`.
   - `movies`: Shared metadata cache of TMDB movie details.
   - `user_movies`: Personal user collection records with unique `(user_id, movie_id)`.
   - `watchlist`: Queued films with priority and notes.
   - `favorites`: User-starred films.
   - `reviews`: User reviews with ratings and moderation statuses.
   - `custom_collections`: Custom movie collections.
   - `collection_movies`: Collection to movie relational links.
   - `diary_entries`: Chronological viewing log (supports multiple viewings per movie).
   - `follows`: Social follow relationships (with `check (follower_id <> following_id)`).
   - `review_likes`: Like counts on public reviews.
   - `activity_logs`: Public audit log for community feed.
   - `notifications`: User notification queue.
2. `20261030000002_rls_policies.sql`:
   - Comprehensive Row Level Security (RLS) policies enforcing multi-user isolation.
   - Helper function `is_admin(user_uid UUID)` with `SECURITY DEFINER` preventing recursive policy evaluation.
3. `20261030000003_triggers_and_functions.sql`:
   - Auto-creation of user profiles upon `auth.users` registration (strictly assigning `role = 'USER'`).
   - Automated `updated_at` timestamps on table updates.
4. `seed.sql`:
   - Seed data containing initial real TMDB classics (Inception, Interstellar, The Godfather, Parasite, Pulp Fiction, Spirited Away).

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root of the project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# TMDB Read Access Token (from https://www.themoviedb.org/settings/api)
TMDB_ACCESS_TOKEN=your-tmdb-access-token
```

> **Note:** If TMDB or Supabase credentials are not provided during development, Filmfolio automatically operates in **Resilient Curated Mode**, utilizing high-fidelity real TMDB film metadata and a localized persistent store so that all UI, CRUD, and analytics workflows function seamlessly without crashing.

---

## 🚦 Local Development Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Execute Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🚀 Deployment Guide (Vercel & Supabase)

### Step 1: Set Up Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. In the **SQL Editor**, run the SQL files in order:
   - `supabase/migrations/20261030000001_initial_schema.sql`
   - `supabase/migrations/20261030000002_rls_policies.sql`
   - `supabase/migrations/20261030000003_triggers_and_functions.sql`
   - `supabase/seed.sql`
3. Retrieve your project URL, anon key, and service role key under **Project Settings > API**.

### Step 2: Set Up TMDB API
1. Create a free account on [The Movie Database](https://www.themoviedb.org).
2. Go to **Settings > API** and request an API key.
3. Copy your **API Read Access Token**.

### Step 3: Deploy to Vercel
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), import the Git repository.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TMDB_ACCESS_TOKEN`
4. Click **Deploy**. Vercel will build and deploy the Next.js application.
5. In Supabase **Authentication > URL Configuration**, add your production Vercel domain as a Redirect URL (e.g. `https://your-filmfolio-app.vercel.app/auth/callback`).

---

## 🎬 TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

All film metadata, high-resolution backdrops, poster assets, release details, and cast listings are supplied via [The Movie Database (TMDB)](https://www.themoviedb.org).

---

## 📄 License

MIT License. Designed and developed with cinematic care.
