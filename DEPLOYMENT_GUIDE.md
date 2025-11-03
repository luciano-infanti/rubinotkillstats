# RubinOT Boss Tracker - Deployment Guide 🎮

A modern, full-stack boss tracking dashboard with MongoDB persistence and Vercel deployment.

## 📋 What You'll Need

- GitHub account (free)
- MongoDB Atlas account (free)
- Vercel account (free)
- Git installed on your computer

---

## 🚀 Step-by-Step Deployment Guide

### **STEP 1: Set Up MongoDB Atlas (Database)**

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
   - Sign up with your email (no credit card needed)
   - Choose the FREE tier (M0 Sandbox)

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you (e.g., São Paulo for Brazil)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Set Up Database Access**:
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `bossadmin` (or whatever you want)
   - Password: Click "Autogenerate Secure Password" and SAVE IT somewhere safe!
   - Database User Privileges: Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or enter `0.0.0.0/0`)
   - Click "Confirm"

5. **Get Your Connection String**:
   - Go back to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://bossadmin:<password>@cluster0.xxxxx.mongodb.net/`)
   - **IMPORTANT**: Replace `<password>` with your actual password from step 3
   - Save this string - you'll need it later!

---

### **STEP 2: Set Up GitHub (Code Repository)**

1. **Install Git** (if you don't have it):
   - Windows: Download from https://git-scm.com/download/win
   - Mac: Open Terminal and type `git --version` (it will install automatically)
   - Linux: `sudo apt-get install git`

2. **Create a GitHub Account**:
   - Go to https://github.com/join
   - Sign up (free account)

3. **Create a New Repository**:
   - Click the "+" icon in top right → "New repository"
   - Repository name: `boss-tracker`
   - Keep it Public (or Private if you prefer)
   - Don't initialize with README
   - Click "Create repository"

4. **Upload Your Code to GitHub**:
   
   Open your terminal/command prompt and navigate to the folder with all the files I created:
   
   ```bash
   # Navigate to your project folder
   cd path/to/your/boss-tracker-folder
   
   # Initialize git
   git init
   
   # Add all files
   git add .
   
   # Commit files
   git commit -m "Initial commit"
   
   # Add your GitHub repository as remote
   # Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repo name
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

   **Alternative (easier) way using GitHub Desktop**:
   - Download GitHub Desktop: https://desktop.github.com/
   - Sign in with your GitHub account
   - Click "Add" → "Add Existing Repository"
   - Select your boss-tracker folder
   - Click "Publish repository"

---

### **STEP 3: Deploy to Vercel (Hosting)**

1. **Create Vercel Account**:
   - Go to https://vercel.com/signup
   - Sign up with your GitHub account (easiest option)
   - This will link Vercel to your GitHub

2. **Import Your Project**:
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find `boss-tracker` and click "Import"

3. **Configure Build Settings**:
   - Framework Preset: Select "Vite"
   - Root Directory: Leave as `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add a new variable:
     - Name: `MONGODB_URI`
     - Value: Paste your MongoDB connection string from Step 1
   - Click "Add"

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://boss-tracker-xxxxx.vercel.app`
   - Click the URL to see your live dashboard! 🎉

---

## 🎯 How to Use Your Dashboard

1. **Access Your Dashboard**: Go to your Vercel URL
2. **Update Boss Data**:
   - Click "Update Data" button
   - Paste your boss tracker text
   - Click "Update Dashboard"
3. **Share the URL**: Anyone with the URL can see the data!

---

## 🔄 How to Update Your Dashboard Daily

Every day when you have new boss data:

1. Go to your dashboard URL
2. Click "Update Data"
3. Paste the new data
4. Click "Update Dashboard"

That's it! Everyone with the URL will see the updated data instantly.

---

## 🛠️ Local Development (Optional)

If you want to run this on your computer for testing:

1. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd api
   npm install
   cd ..
   ```

2. **Create .env file** in the `api` folder:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3001
   ```

3. **Run the backend**:
   ```bash
   cd api
   npm start
   ```

4. **Run the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173

---

## 📱 Access From Anywhere

Once deployed:
- ✅ Works on mobile devices
- ✅ Works on any computer
- ✅ Updates sync for everyone
- ✅ No need to re-deploy when updating data

---

## 💡 Troubleshooting

**Problem: "Cannot connect to database"**
- Check your MongoDB IP whitelist (should be 0.0.0.0/0)
- Verify your MONGODB_URI in Vercel environment variables
- Make sure you replaced `<password>` with your actual password

**Problem: "Build failed"**
- Check that all files are in the correct folders
- Verify package.json exists in the root directory
- Check Vercel build logs for specific errors

**Problem: "Page not loading"**
- Clear your browser cache
- Check the Vercel deployment status
- Try accessing in incognito/private mode

---

## 🎉 You're Done!

Your boss tracker is now:
- ✅ Live on the internet
- ✅ Connected to a database
- ✅ Accessible from anywhere
- ✅ Completely FREE

Share your URL with friends and enjoy tracking those bosses! 🎮

---

## 📞 Need Help?

If you get stuck:
1. Check the Vercel deployment logs
2. Check the MongoDB Atlas connection
3. Make sure all environment variables are set correctly
4. Try redeploying from Vercel dashboard

Good luck and happy boss hunting! 🎯
