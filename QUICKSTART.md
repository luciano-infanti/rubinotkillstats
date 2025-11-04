# RubinOT Kill Stats Dashboard - Quick Start

Your complete Next.js dashboard is ready! 🎉

## What's Been Created

A full-stack application with:
- ✅ Next.js 15 with App Router
- ✅ Supabase integration for database
- ✅ Clean, minimal UI with Tailwind CSS
- ✅ shadcn/ui components
- ✅ Boss kill tracking and spawn prediction
- ✅ Data upload and parsing system
- ✅ Searchable and sortable table

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd rubinotkillstats
pnpm install
# or: npm install
```

### 2. Set Up Supabase Database
1. Go to your Supabase project: https://supabase.com/dashboard/project/eunxdvyphptpnnmryyze
2. Click "SQL Editor" in the left sidebar
3. Open `schema.sql` from this project
4. Copy all the SQL and paste it into the SQL Editor
5. Click "Run" to create all tables and policies

### 3. Environment Variables
Your `.env.local` file is already configured with the correct Supabase credentials!

### 4. Run Locally
```bash
pnpm dev
```

Open http://localhost:3000 and you're live! 🚀

## Deploy to Vercel

### Option A: GitHub + Vercel (Recommended)
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/luciano-infanti/rubinotkillstats.git
git push -u origin main
```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy!

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts and add your env variables
```

## Using the Dashboard

### Upload Data
1. Go to http://localhost:3000/upload
2. Paste your RubinOT boss kill tracker output
3. Click "Parse & Save"
4. Data is automatically parsed and stored!

### View Dashboard
- See global stats (total bosses, killed today, etc.)
- Search bosses by name
- Sort by any column (click column headers)
- View spawn predictions based on historical data

## File Structure

```
rubinotkillstats/
├── app/
│   ├── api/ingest/route.ts    # Data ingestion endpoint
│   ├── upload/page.tsx         # Upload interface
│   ├── page.tsx                # Main dashboard
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── StatsCards.tsx          # Stats display
│   └── MonstersTable.tsx       # Boss table with search/sort
├── lib/
│   ├── supabase/               # Database clients
│   ├── parse.ts                # Text parser
│   └── types.ts                # TypeScript types
├── schema.sql                  # Database schema
└── README.md                   # Full documentation
```

## Key Features

### Dashboard (`/`)
- Global statistics cards
- Searchable boss table
- Sortable columns
- Spawn prediction algorithm
- Real-time data from Supabase

### Upload (`/upload`)
- Simple textarea interface
- Automatic parsing of boss kill data
- Success/error feedback
- Data validation

### Parser
- Extracts world name from header
- Parses boss blocks separated by `---`
- Handles date format DD/MM/YYYY
- Converts to ISO format for database
- Supports multiple kills per day

### Database
- Row Level Security (RLS) enabled
- Public read access
- Anonymous insert for uploads
- Audit trail in `raw_uploads` table
- Efficient indexing for queries

## Troubleshooting

### "Missing environment variables"
Make sure `.env.local` exists with your Supabase credentials.

### "Database connection failed"
1. Check your Supabase URL and keys in `.env.local`
2. Ensure you've run the `schema.sql` in Supabase SQL Editor
3. Verify RLS policies are created

### "No data showing"
1. Upload data via the `/upload` page first
2. Check Supabase Table Editor to verify data exists
3. Check browser console for errors

## Next Steps

- ✨ Add more worlds to track
- 📊 Create historical charts
- 🌙 Add dark mode
- 📱 Improve mobile responsiveness
- 🔒 Add authentication for admin features

## Support

For issues or questions, check the full README.md or open an issue on GitHub!

Enjoy tracking your boss kills! 🎮
