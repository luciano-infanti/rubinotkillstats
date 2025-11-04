# Deployment Checklist - RubinOT Kill Stats Dashboard

Follow this checklist to deploy your dashboard to production.

## Pre-Deployment Setup

### ☐ 1. Local Testing Complete
- [ ] Installed dependencies with `pnpm install`
- [ ] Created Supabase database with `schema.sql`
- [ ] Environment variables set in `.env.local`
- [ ] Tested locally with `pnpm dev`
- [ ] Uploaded test data successfully
- [ ] Verified dashboard displays correctly
- [ ] Tested search functionality
- [ ] Tested sorting on all columns

## GitHub Setup

### ☐ 2. Initialize Git Repository
```bash
cd rubinotkillstats
git init
git add .
git commit -m "Initial commit: RubinOT Kill Stats Dashboard"
```

### ☐ 3. Push to GitHub
```bash
git remote add origin https://github.com/luciano-infanti/rubinotkillstats.git
git branch -M main
git push -u origin main
```

## Supabase Database Setup

### ☐ 4. Verify Supabase Configuration
- [ ] Project exists at: https://supabase.com/dashboard/project/eunxdvyphptpnnmryyze
- [ ] `schema.sql` has been run in SQL Editor
- [ ] All 4 tables created: `worlds`, `bosses`, `boss_daily_kills`, `raw_uploads`
- [ ] RLS policies are enabled
- [ ] "Lunarian" world exists in `worlds` table

### ☐ 5. Test Database Access
```bash
# In your browser console on localhost:3000
fetch('/api/ingest', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'test'})
}).then(r => r.json()).then(console.log)
```

Should return an error about invalid text format (which is good - API is working).

## Vercel Deployment

### ☐ 6. Import Project to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find `rubinotkillstats` repository
5. Click "Import"

### ☐ 7. Configure Environment Variables
In Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://eunxdvyphptpnnmryyze.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bnhkdnlwaHB0cG5ubXJ5eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc2MzUsImV4cCI6MjA3Nzc3MzYzNX0.DZbnWSn8_bN7wJ9ecb1I9S8eglCZNseuWhZVxRktFUg
```

### ☐ 8. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Deployment successful (green checkmark)

## Post-Deployment Testing

### ☐ 9. Test Production Site
Visit your production URL (e.g., `https://rubinotkillstats.vercel.app`)

- [ ] Dashboard loads without errors
- [ ] Stats cards display (may show 0 if no data uploaded yet)
- [ ] Table renders correctly
- [ ] Navigation to `/upload` works

### ☐ 10. Test Data Upload in Production
1. Go to `https://your-site.vercel.app/upload`
2. Paste the sample boss data (from second document)
3. Click "Parse & Save"
4. Should see success message
5. Navigate back to dashboard
6. Verify data appears correctly

### ☐ 11. Test All Features
- [ ] Search functionality works
- [ ] Column sorting works (click headers)
- [ ] Stats update correctly
- [ ] Dates display in correct format
- [ ] Mobile responsive (check on phone)

## Domain Setup (Optional)

### ☐ 12. Configure Custom Domain
If you have a custom domain:
1. Go to Vercel project settings → Domains
2. Add your domain (e.g., `killstats.rubin.ot`)
3. Configure DNS records as instructed
4. Wait for SSL certificate (~5 minutes)
5. Test `https://your-domain.com`

## Security & Performance

### ☐ 13. Security Check
- [ ] Environment variables not exposed in client-side code
- [ ] Supabase RLS policies active
- [ ] No sensitive data in GitHub repository
- [ ] `.env.local` in `.gitignore`

### ☐ 14. Performance Check
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90 (run in Chrome DevTools)
- [ ] No console errors
- [ ] Tables render smoothly with 96 bosses

## Monitoring Setup

### ☐ 15. Enable Vercel Analytics (Optional)
1. Go to Vercel project → Analytics
2. Enable Web Analytics
3. Deploy changes if prompted

### ☐ 16. Set Up Error Tracking (Optional)
Consider integrating:
- Sentry for error tracking
- Vercel Speed Insights for performance
- Supabase Dashboard for database monitoring

## Documentation

### ☐ 17. Update README
- [ ] Add production URL to README
- [ ] Add badge: `![Deploy](https://img.shields.io/badge/deploy-success-green)`
- [ ] Update any localhost references
- [ ] Add contributors section if applicable

### ☐ 18. Share Access
If sharing with team:
- [ ] Add collaborators to GitHub repo
- [ ] Share Vercel project access
- [ ] Share Supabase project access
- [ ] Document how to update data

## Maintenance

### ☐ 19. Regular Updates
Schedule:
- [ ] Daily: Upload new boss kill data
- [ ] Weekly: Check Vercel deployment logs
- [ ] Monthly: Review Supabase database size
- [ ] As needed: Update dependencies

### ☐ 20. Backup Strategy
- [ ] Raw uploads stored in `raw_uploads` table
- [ ] Supabase has automatic backups (check retention period)
- [ ] Consider exporting data weekly
- [ ] Document data recovery process

## Troubleshooting

### Common Issues & Solutions:

**Issue: "Environment variables not found"**
```
Solution: Make sure you've added both env vars in Vercel settings
and redeployed after adding them.
```

**Issue: "Database connection failed"**
```
Solution: 
1. Check Supabase URL is correct
2. Verify anon key is valid
3. Ensure RLS policies are created
4. Check Supabase project is active
```

**Issue: "Parse error" when uploading data**
```
Solution:
1. Ensure data format matches expected format
2. Check for special characters
3. Verify the "History:" line exists for each boss
4. Check browser console for detailed error
```

**Issue: "Table not rendering"**
```
Solution:
1. Upload data first via /upload page
2. Check Supabase table editor to verify data exists
3. Check browser console for errors
4. Verify world name matches ("Lunarian")
```

## Success Checklist Summary

Your deployment is complete when:
- ✅ Site is live on Vercel
- ✅ Data can be uploaded via /upload page
- ✅ Dashboard displays boss statistics
- ✅ Search and sort functionality works
- ✅ No errors in browser console
- ✅ Mobile responsive
- ✅ SSL certificate active (https)
- ✅ Team members can access

## Next Steps After Deployment

1. **Automate Data Updates**
   - Set up a cron job to pull and upload data daily
   - Or create a GitHub Action to update data automatically

2. **Enhance Features**
   - Add more worlds
   - Implement historical charts
   - Add dark mode
   - Create boss detail pages

3. **Optimize**
   - Set up caching for dashboard data
   - Optimize images if any are added
   - Implement ISR (Incremental Static Regeneration)

4. **Monitor**
   - Check Vercel analytics weekly
   - Review Supabase usage monthly
   - Monitor user feedback

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Vercel deployment logs
3. Check Supabase logs
4. Review this checklist again
5. Check GitHub Issues (if public)

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Production URL:** https://_____________________.vercel.app

**Notes:** 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
