# Deploy Admin Dashboard to Vercel

## Access Your Admin Dashboard

After deploying to Vercel, your admin dashboard will be accessible at:

**Main Website:** `https://your-project.vercel.app`  
**Admin Dashboard:** `https://your-project.vercel.app/admin`

## Deployment Steps

### 1. Push to GitHub

Make sure all files are committed and pushed:

```bash
git add .
git commit -m "Add admin dashboard"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Auto-Deploy (Recommended)
- If you already have Vercel connected to your GitHub repo, it will auto-deploy
- Wait for the deployment to complete (check Vercel dashboard)

#### Option B: Manual Deploy via Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project (Gillys-Cafe)
3. Click "Deployments" tab
4. Click "Redeploy" if needed

#### Option C: Deploy via CLI
```bash
cd "/Users/kushal/Desktop/Gillys Cafe"
vercel --prod
```

## Configuration

The `vercel.json` file is configured to:
- Route `/admin` → `/admin.html`
- Keep main site at root `/` → `/index.html`

## Access URLs

After deployment:
- **Main Site:** `https://your-project.vercel.app`
- **Admin Login:** `https://your-project.vercel.app/admin`

## Default Admin Credentials

- **Email:** `gillyscafeco@gmail.com`
- **Password:** `admin123`

⚠️ **Important:** Change the password after first login!

## Troubleshooting

### Admin page shows 404
- Make sure `admin.html` is in the root directory
- Check that `vercel.json` has the `/admin` rewrite rule
- Try accessing `https://your-project.vercel.app/admin.html` directly

### CSS/JS not loading
- All paths in `admin.html` are now absolute (starting with `/`)
- This ensures they work from the `/admin` route

### Can't login
- Use the reset tool: `https://your-project.vercel.app/reset-admin.html`
- Or clear browser localStorage and try again

## Files Included

All admin-related files are included:
- `admin.html` - Admin dashboard page
- `admin.css` - Admin dashboard styles
- `admin.js` - Admin dashboard functionality
- `reset-admin.html` - Admin reset tool
- `migrate-menu.html` - Menu migration tool

