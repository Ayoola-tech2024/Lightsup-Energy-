# Deployment Guide

## Environment Variables

To deploy this application to production (Vercel, Netlify, etc.), you **MUST** add the following environment variables in your hosting provider's dashboard.

Go to **Settings** > **Environment Variables** and add each of these key-value pairs:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCB6EB-zLuxM3idw7Xq2N09LTPwszarAl8` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `lightsup-energy-solutions.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | `https://lightsup-energy-solutions-default-rtdb.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | `lightsup-energy-solutions` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `lightsup-energy-solutions.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `733838981788` |
| `VITE_FIREBASE_APP_ID` | `1:733838981788:web:34a7b55fdbfcc1ada74b59` |

## Why is this needed?

We moved these sensitive keys out of the code (`src/lib/firebase.ts`) and into environment variables to prevent security warnings ("Public leak"). Your app will not connect to the database without them.

## Platform Specific Instructions

### Vercel
1. Go to your project dashboard.
2. Click **Settings** -> **Environment Variables**.
3. Copy-paste the keys and values from above.
4. Redeploy your application.

### Netlify
1. Go to **Site configuration** -> **Environment variables**.
2. Add the variables.
3. Trigger a new deploy.
