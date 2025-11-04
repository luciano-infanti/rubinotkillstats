# RubinOT Kill Stats Dashboard

A clean, minimal dashboard for tracking boss kills and spawn predictions for RubinOT Lunarian server. Built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- 📊 **Dashboard**: View global stats and searchable/sortable table of all bosses
- 📝 **Data Upload**: Simple textarea interface to paste daily boss kill dumps
- 🔍 **Search & Sort**: Client-side filtering and sorting of boss data
- 📈 **Spawn Prediction**: Calculates average days between spawns and next expected spawn
- 🎨 **Clean UI**: Minimal, Swiss-inspired design with light mode

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/luciano-infanti/rubinotkillstats.git
cd rubinotkillstats
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `schema.sql` into the SQL Editor
4. Run the query to create all tables, policies, and seed data

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory (already provided with the correct values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://eunxdvyphptpnnmryyze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bnhkdnlwaHB0cG5ubXJ5eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc2MzUsImV4cCI6MjA3Nzc3MzYzNX0.DZbnWSn8_bN7wJ9ecb1I9S8eglCZNseuWhZVxRktFUg
```

**Optional** (for server-side operations):
```env
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

### 5. Run Locally

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/luciano-infanti/rubinotkillstats)

### Manual Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Usage

### Uploading Data

1. Navigate to the **Upload** page
2. Paste the complete output from your RubinOT Boss Kill Tracker
3. Click **Parse & Save**
4. The system will automatically parse boss names, dates, and kill counts

### Data Format

The parser expects text in this format:

```
RubinOT Boss Kill Tracker - Lunarian
Last Updated: 03/11/2025, 10:25:24
...

Boss: Mahatheb
Status: ✅ KILLED TODAY (1 kills)
Total Days Spawned: 1
Total Kills: 1
History: 03/11/2025 (1x)
---

Boss: Raxias
Status: ✅ KILLED TODAY (4 kills)
Total Days Spawned: 2
Total Kills: 6
History: 02/11/2025 (2x), 03/11/2025 (4x)
---
```

### Dashboard Features

- **Total Bosses**: Count of all tracked bosses
- **Killed Today**: Number of bosses killed on the current date
- **World**: Currently tracked world (Lunarian)
- **Last Updated**: Timestamp of the most recent data upload
- **Boss Table**: 
  - Searchable by boss name
  - Sortable by any column (click column headers)
  - Shows last kill date, today's kills, total kills, average spawn interval, and predicted next spawn

## Database Schema

### Tables

- **worlds**: Game world names
- **bosses**: Boss names
- **boss_daily_kills**: Daily kill records (boss + world + date + kill count)
- **raw_uploads**: Audit log of uploaded data

### Row Level Security (RLS)

All tables have RLS enabled with:
- Public read access for all users
- Anonymous insert access for data uploads

## Project Structure

```
├── app/
│   ├── api/ingest/route.ts    # API endpoint for data ingestion
│   ├── upload/page.tsx         # Upload page
│   ├── page.tsx                # Dashboard page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── StatsCards.tsx          # Stats display component
│   └── MonstersTable.tsx       # Boss table component
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   ├── parse.ts                # Text parser utility
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── schema.sql                  # Database schema
└── package.json
```

## Future Enhancements

- [ ] Multi-world support with dropdown selector
- [ ] CSV export functionality
- [ ] Historical charts (kills per day per boss)
- [ ] Server actions for more secure writes
- [ ] Automated scraping via edge function
- [ ] Dark mode toggle
- [ ] Mobile-responsive improvements

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
