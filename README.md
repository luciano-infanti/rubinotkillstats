# Boss Tracker - Folder Structure

Here's how your project should be organized:

```
boss-tracker/
├── api/
│   ├── index.js           # Backend API (Express + MongoDB)
│   └── package.json       # Backend dependencies
├── src/
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS imports
├── index.html             # HTML template
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vercel.json            # Vercel deployment configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── DEPLOYMENT_GUIDE.md    # Step-by-step deployment guide
└── README.md              # This file
```

## Quick Start

1. Follow the DEPLOYMENT_GUIDE.md for complete setup instructions
2. Or run locally:
   - `npm install` in root directory
   - `cd api && npm install` for backend
   - Create `.env` file in `api/` folder with your MongoDB URI
   - `npm run dev` in root for frontend
   - `cd api && npm start` for backend

## Important Files

- **DEPLOYMENT_GUIDE.md**: Complete step-by-step instructions for deployment
- **.env.example**: Shows what environment variables you need
- **vercel.json**: Configures Vercel to host both frontend and API

## After Deployment

Your app will have two parts:
- Frontend: React dashboard (visible to users)
- Backend: API at `/api/boss-data` (handles database operations)

Both are hosted together on Vercel!
