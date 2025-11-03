# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🔴 "Cannot connect to database" or "Error fetching data"

**Problem**: The app can't reach your MongoDB database.

**Solutions**:
1. **Check IP Whitelist** (most common issue):
   - Go to MongoDB Atlas → Network Access
   - Make sure you have `0.0.0.0/0` in the list
   - If not, add it and wait 2 minutes

2. **Check your connection string**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Make sure `MONGODB_URI` is set correctly
   - Common mistake: Forgot to replace `<password>` with actual password
   - Should look like: `mongodb+srv://username:PASSWORD@cluster0.xxxxx.mongodb.net/boss-tracker`

3. **Redeploy**:
   - Go to Vercel → Your Project → Deployments
   - Click the three dots on latest deployment → Redeploy

---

### 🔴 "Build failed" or "Deployment failed"

**Problem**: Vercel can't build your project.

**Solutions**:
1. **Check GitHub upload**:
   - Go to your GitHub repository
   - Make sure ALL files are there, especially:
     - `package.json` (in root)
     - `api/package.json`
     - `api/index.js`
     - `src/App.jsx`
     - `vercel.json`

2. **Check build settings**:
   - Go to Vercel → Your Project → Settings → General
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./`

3. **Check the logs**:
   - Go to Vercel → Your Project → Deployments
   - Click on failed deployment
   - Check the error message

---

### 🔴 Dashboard loads but shows "Loading..." forever

**Problem**: Frontend can't reach the backend API.

**Solutions**:
1. **Check Environment Variables**:
   - Vercel → Settings → Environment Variables
   - Make sure `MONGODB_URI` is set for "Production"

2. **Check API endpoint**:
   - Visit: `https://your-app-url.vercel.app/api/health`
   - Should show: `{"status":"ok","timestamp":"..."}`
   - If you get 404, your API isn't deployed correctly

3. **Redeploy with fresh build**:
   - Vercel → Deployments → Redeploy

---

### 🔴 Updates not saving

**Problem**: You update data but it doesn't persist.

**Solutions**:
1. **Check browser console**:
   - Press F12 in your browser
   - Go to Console tab
   - Look for red error messages
   - Common error: "Failed to fetch" means API isn't responding

2. **Check MongoDB connection**:
   - Go to MongoDB Atlas → Database
   - Make sure cluster is running (green icon)
   - Check that your user has "Read and write" permissions

3. **Test the API directly**:
   - Open: `https://your-app-url.vercel.app/api/boss-data`
   - Should show your boss data or an error message

---

### 🔴 "Module not found" errors

**Problem**: Missing dependencies.

**Solutions**:
1. **Clear and reinstall**:
   ```bash
   # Delete node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   rm -rf api/node_modules api/package-lock.json
   
   # Reinstall
   npm install
   cd api && npm install
   ```

2. **Push to GitHub and redeploy**:
   ```bash
   git add .
   git commit -m "Fix dependencies"
   git push
   ```

---

### 🔴 Vercel URL returns 404

**Problem**: Deployment exists but URL doesn't work.

**Solutions**:
1. **Wait 2-3 minutes** after deployment
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try incognito/private mode**
4. **Check Vercel dashboard**:
   - Make sure deployment shows "Ready"
   - If it shows "Building" or "Error", wait or investigate

---

### 🔴 MongoDB says "Cluster paused"

**Problem**: Free tier clusters pause after inactivity.

**Solutions**:
1. Go to MongoDB Atlas → Database
2. Click "Resume" on your cluster
3. Wait 1-2 minutes
4. Try accessing your dashboard again

---

### 🔴 GitHub says "Permission denied"

**Problem**: Can't push to GitHub.

**Solutions**:
1. **Use GitHub Desktop** (easier):
   - Download from https://desktop.github.com
   - Sign in and add your repository

2. **Or configure Git credentials**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Use HTTPS (not SSH)**:
   ```bash
   git remote set-url origin https://github.com/username/repo.git
   ```

---

## 🆘 Still Having Issues?

### Check these resources:
1. **Vercel Logs**: Vercel Dashboard → Deployments → Click deployment → View logs
2. **MongoDB Logs**: Atlas → Database → Browse Collections → Check data
3. **Browser Console**: F12 → Console tab → Check for errors

### What to check:
- [ ] MongoDB cluster is running
- [ ] IP whitelist includes 0.0.0.0/0
- [ ] Connection string has correct password
- [ ] Environment variable is set in Vercel
- [ ] All files are on GitHub
- [ ] Latest deployment is "Ready" in Vercel

### Quick Reset (if all else fails):
1. Delete deployment in Vercel
2. Re-import project from GitHub
3. Re-add environment variable
4. Deploy again

---

## 📞 Getting Help

If you're still stuck:
1. Check Vercel's error message carefully
2. Search the error message on Google
3. Check MongoDB Atlas cluster status
4. Make sure you completed all steps in DEPLOYMENT_GUIDE.md

Most issues are related to:
- Wrong MongoDB connection string (70%)
- Missing IP whitelist (20%)
- Missing files on GitHub (10%)
