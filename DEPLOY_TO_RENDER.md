# Complete Step-by-Step Guide: Deploying ClarioLoop to Render.com (100% Free)

This guide walks you through deploying **ClarioLoop** to **Render** with zero hosting and database costs.

---

## 🛠️ Step 1: Push Your Code to GitHub

1. Open PowerShell or Terminal in your project directory:
   ```bash
   cd c:\Users\Lenovo\Downloads\App
   ```
2. Initialize Git and commit the files:
   ```bash
   git init
   git add .
   git commit -m "Initial release of ClarioLoop with Multi-Tenancy & Razorpay"
   ```
3. Create a **New Repository** on [GitHub.com](https://github.com) named `clarioloop`.
4. Link and push your local code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/clarioloop.git
   git push -u origin main
   ```

---

## ☁️ Step 2: Create a Free Web Service on Render

1. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and log in (or sign up with GitHub).
2. Click **New +** at the top right and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your `clarioloop` repository.
4. Fill in the deployment settings:
   - **Name**: `clarioloop` (this sets your URL to `clarioloop.onrender.com`)
   - **Region**: Singapore or Frankfurt (fastest for India)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     node server/index.js
     ```
   - **Instance Type**: Select **Free ($0/month)**

---

## 🔑 Step 3: Add Your Environment Variables

Under the **Environment Variables** section on Render, add these 5 keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode and serves the static frontend |
| `PORT` | `10000` | Render's default web service port |
| `MONGODB_URI` | `your_mongodb_cluster_uri` | Your live MongoDB Atlas Cluster0 URI |
| `GROQ_API_KEY` | `your_groq_api_key` | Your Groq API key for LLaMA 3.3 70B document extraction |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Google Gemini API key |

---

## 🚀 Step 4: Click "Deploy Web Service"

1. Click **Create Web Service** at the bottom.
2. Render will automatically:
   - Clone your repository.
   - Run `npm install` and build the frontend with `npm run build`.
   - Start the Express server on port `10000`.
3. In ~2–3 minutes, the build log will show:
   ```
   🚀 ClarioLoop Server running on http://localhost:10000
   ==> Your service is live at https://clarioloop.onrender.com
   ```

---

## 🌐 Step 5: Whitelist Render in MongoDB Atlas (Crucial)

To ensure Render can read and write to your database:
1. Go to **[cloud.mongodb.com](https://cloud.mongodb.com)**.
2. In the left menu, click **Security > Network Access**.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere (`0.0.0.0/0`)** and click **Confirm**.
5. Your database is now connected and persistent.

---

## 📱 Mobile App (Android APK / Google Play)
Because ClarioLoop is now responsive and configured with Capacitor:
1. In `capacitor.config.json`, the server URL points to:
   ```json
   "server": {
     "url": "https://clarioloop.onrender.com"
   }
   ```
2. Any changes you deploy to Render will update both your **website** and your **Android App** immediately without needing to re-upload to Google Play!
