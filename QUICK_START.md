# 🚀 Quick Start Checklist

Follow these steps in order. Each should take 5-10 minutes.

## ☐ Step 1: MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free, no credit card)
3. Create a FREE cluster (M0)
4. Create database user (save password!)
5. Whitelist all IPs (0.0.0.0/0)
6. Get connection string
7. Replace `<password>` in connection string with your password
8. **Save this string - you'll need it!**

**Result**: You should have a string like:
```
mongodb+srv://bossadmin:YourPassword123@cluster0.xxxxx.mongodb.net/boss-tracker
```

---

## ☐ Step 2: GitHub (Code Storage)
1. Create account at https://github.com/join
2. Create new repository called `boss-tracker`
3. Upload all your project files to GitHub

**Two ways to upload:**
- **Easy**: Use GitHub Desktop app
- **Terminal**: Run these commands in your project folder:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/boss-tracker.git
  git push -u origin main
  ```

**Result**: Your code is now on GitHub!

---

## ☐ Step 3: Vercel (Hosting)
1. Go to https://vercel.com/signup
2. Sign up with your GitHub account
3. Click "Add New..." → "Project"
4. Select your `boss-tracker` repository
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string from Step 1
7. Click "Deploy"
8. Wait 2-3 minutes

**Result**: You get a live URL like `https://boss-tracker-xxxxx.vercel.app`

---

## ✅ You're Done!

Your dashboard is now:
- 🌐 Live on the internet
- 💾 Connected to MongoDB database
- 🔄 Updates sync for everyone
- 💯 100% FREE

## 📝 Daily Use

1. Go to your Vercel URL
2. Click "Update Data"
3. Paste new boss data
4. Click "Update Dashboard"

Everyone with the URL sees the update instantly!

---

## 🆘 Need Help?

Common issues:
- **Can't connect to database**: Check IP whitelist (0.0.0.0/0) and password in connection string
- **Build failed**: Make sure all files are uploaded to GitHub
- **Page not loading**: Wait a few minutes and refresh

Full guide: See `DEPLOYMENT_GUIDE.md` for detailed instructions with screenshots.
