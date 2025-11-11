# Deployment Guide - Render

This guide will walk you through deploying your NLP Chatbot to Render.

## Prerequisites

1. GitHub account with your code pushed
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
4. Google Gemini API key (get from https://aistudio.google.com/app/apikey)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or log in
3. Create a new cluster (select Free tier - M0)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" on your cluster
6. Choose "Connect your application"
7. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/`)
8. Replace `<password>` with your actual database password
9. Add `/chatbot` at the end: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/chatbot`
10. Keep this connection string handy

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click "New +" button → Select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

   - **Name:** `nlp-chatbot-backend`
   - **Region:** Choose closest to you (e.g., Oregon)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. Click "Advanced" and add environment variables:

   - `MONGODB_URI` = Your MongoDB Atlas connection string from Step 1
   - `GEMINI_API_KEY` = Your Google Gemini API key
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = Leave empty for now (we'll add it after frontend deployment)

6. Click "Create Web Service"
7. Wait for deployment to complete (5-10 minutes)
8. Copy your backend URL (looks like: `https://nlp-chatbot-backend.onrender.com`)

## Step 3: Update Frontend Configuration

1. Go back to your local project
2. Create `frontend/.env.production` file:

   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Replace `your-backend-url` with the URL from Step 2

3. Commit and push this change:
   ```bash
   git add frontend/.env.production
   git commit -m "Add production API URL"
   git push origin main
   ```

## Step 4: Deploy Frontend to Render

1. Go to Render Dashboard
2. Click "New +" → Select "Static Site"
3. Connect your GitHub repository (same repo)
4. Configure the service:

   - **Name:** `nlp-chatbot-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

5. Click "Advanced" and add environment variable:

   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
     (Use the backend URL from Step 2)

6. Click "Create Static Site"
7. Wait for deployment (3-5 minutes)
8. Copy your frontend URL (looks like: `https://nlp-chatbot-frontend.onrender.com`)

## Step 5: Update Backend CORS

1. Go back to Render backend service
2. Go to "Environment" tab
3. Add new environment variable:
   - `FRONTEND_URL` = Your frontend URL from Step 4
4. Save changes
5. Backend will automatically redeploy

## Step 6: Test Your Application

1. Open your frontend URL in a browser
2. Click "New Chat" button
3. Send a test message
4. You should see the AI response streaming in

## Troubleshooting

### Backend shows "Application failed to respond"

- Check environment variables are set correctly
- Check MongoDB connection string is valid
- View logs: Click your backend service → "Logs" tab

### Frontend shows CORS error

- Make sure `FRONTEND_URL` is set in backend environment variables
- Make sure it matches exactly (with https://)
- Check backend logs for CORS errors

### "Chat session not found" error

- This is normal after backend restarts on free tier
- Backend will recreate session from database automatically

### Slow first response after inactivity

- Free tier services sleep after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- This is normal behavior on free tier

## Updating Your Application

When you make changes to your code:

1. Commit and push to GitHub:

   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. Render will automatically detect the push and redeploy both services

## Alternative: Manual Deploy from Render Dashboard

If automatic deploys don't work:

1. Go to your service in Render Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

## Cost

With the free tier:

- **Render Backend:** Free (sleeps after 15min inactivity)
- **Render Frontend:** Free (always active)
- **MongoDB Atlas:** Free (512MB storage)
- **Total:** $0/month

## Upgrading to Paid Tier

If you want to prevent backend from sleeping:

1. Go to backend service in Render
2. Change plan from "Free" to "Starter" ($7/month)
3. Backend will stay active 24/7

## Important Notes

- Keep your `.env` files in `.gitignore` (never commit them)
- Environment variables are set in Render Dashboard, not in code
- Free tier has limitations but works great for development and demos
- MongoDB Atlas free tier is perfect for this application

## Next Steps

- Set up custom domain (optional)
- Enable monitoring and alerts in Render
- Set up automated backups for MongoDB
- Consider upgrading if you need 24/7 uptime

## Support

If you run into issues:

- Check Render documentation: https://render.com/docs
- View service logs in Render Dashboard
- Check MongoDB Atlas connection in their dashboard
- Verify all environment variables are set correctly
