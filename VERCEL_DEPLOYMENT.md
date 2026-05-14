# AstroMap - Vercel Deployment Guide

This guide walks you through deploying AstroMap to Vercel in just a few steps.

## Prerequisites

- A Vercel account (sign up at https://vercel.com if you don't have one)
- Your GitHub repository with AstroMap code (already pushed to `statusconfirmed031/nmmiddle`)

## Deployment Steps

### 1. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Find and select the `statusconfirmed031/nmmiddle` repository
5. Click **"Import"**

### 2. Configure Project Settings

When the import dialog appears, configure these settings:

**Framework Preset:** Select **"Other"** (or leave as auto-detected)

**Build Command:** 
```
pnpm build
```

**Output Directory:** 
```
dist
```

**Install Command:** 
```
pnpm install
```

### 3. Environment Variables

Add the following environment variables in the Vercel dashboard under **Settings → Environment Variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your MySQL/TiDB connection string | Required for database features |
| `JWT_SECRET` | A secure random string | Used for session signing |
| `VITE_APP_ID` | Your Manus OAuth app ID | Get from Manus dashboard |
| `OAUTH_SERVER_URL` | Manus OAuth server URL | Provided by Manus |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL | Provided by Manus |
| `OWNER_OPEN_ID` | Your Manus owner ID | Provided by Manus |
| `OWNER_NAME` | Your name | Display name |
| `BUILT_IN_FORGE_API_KEY` | Manus API key | For server-side operations |
| `BUILT_IN_FORGE_API_URL` | Manus API URL | Provided by Manus |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | For client-side operations |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API URL | Provided by Manus |

**Note:** If you're using Manus's built-in hosting, these variables are automatically injected. For external Vercel deployment, you'll need to configure them manually.

### 4. Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your project
3. Once complete, you'll receive a deployment URL (e.g., `https://astro-map-xxxxx.vercel.app`)

### 5. Verify Deployment

1. Visit your deployment URL
2. Verify the AstroMap interface loads correctly
3. Test the interactive map, city markers, and filter functionality
4. Check that all 53 cities display with correct color coding

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project **Settings → Domains**
2. Click **"Add Domain"**
3. Enter your custom domain
4. Follow the DNS configuration steps provided by Vercel

## Troubleshooting

**Build fails with "pnpm not found":**
- Vercel should auto-detect pnpm. If not, add `ENABLE_PNPM=true` to environment variables

**Map doesn't display:**
- Ensure Google Maps API is enabled in your environment
- Check browser console for API errors
- Verify environment variables are correctly set

**Database connection errors:**
- Verify `DATABASE_URL` is correct and accessible from Vercel
- Ensure your database allows connections from Vercel's IP ranges
- Check database credentials and network settings

**OAuth not working:**
- Verify `VITE_APP_ID` and `OAUTH_SERVER_URL` are correct
- Ensure your Vercel deployment URL is registered in Manus OAuth settings
- Check that redirect URLs match exactly

## Performance Tips

- AstroMap uses Google Maps API which is optimized for performance
- The app includes responsive design for all screen sizes
- City data is loaded as static JSON for instant access
- Markers are rendered efficiently using Google Maps native rendering

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Review Manus documentation for OAuth and API configuration
- Check browser console for client-side errors
- Review Vercel deployment logs for build/runtime errors

---

**Deployment Status:** Ready for production ✓
