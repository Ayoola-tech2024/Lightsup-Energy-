# Deployment Guide

## Firebase Configuration
The Firebase configuration is currently hardcoded in `src/lib/firebase.ts` for convenience. No environment variables are strictly required for the app to function, but you can still use them if you prefer to hide the keys.

## Fixing 404 Errors on Refresh
If you get a `404 NOT FOUND` error when refreshing pages (like `/services` or `/admin`), it is because the hosting provider (Vercel/Netlify) is looking for a physical file that doesn't exist.

I have added the following files to fix this:
- `vercel.json`: Configures Vercel to redirect all traffic to `index.html`.
- `public/_redirects`: Configures Netlify to redirect all traffic to `index.html`.

## Security Rules
Make sure to apply the rules found in `firestore.rules` to your Firebase Console to protect your data.

## Platform Specific Instructions

### Vercel
1. Ensure `vercel.json` is in your root directory.
2. Push your changes to GitHub or redeploy via the Vercel CLI.

### Netlify
1. Ensure `public/_redirects` exists.
2. Trigger a new deploy.
