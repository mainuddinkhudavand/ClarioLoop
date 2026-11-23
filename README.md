# ClarioLoop - AI-Powered Client Document Collection & Compliance Platform

> **Stop Chasing Clients for Documents.** ClarioLoop automates client document checklists, secure mobile-friendly uploads, AI extraction, and self-stopping reminders for CA firms and accountants.

---

## 🌟 Architecture & Highlights
- **Branding & Logo**: The Infinity Loop ($\infty$) representing automated, closed-loop collection.
- **Backend**: Node.js & Express connected to **MongoDB Atlas Cluster0** (`clarioloop`).
- **AI Engine**: Powered by **Groq LLaMA-3.3-70B** & **Google Gemini** for document classification into 10 CA compliance categories and field extraction (Invoice #, Date, GSTIN, Amount).
- **Client Upload Portal**: Passwordless, mobile-optimized link (`/portal/:token`) with camera photo capture.
- **Smart Reminders**: WhatsApp and Email automated sequences that **halt immediately** once files are submitted.
- **Zero-Cost Deployment**: Built for deployment on **Render.com Free Web Service** and **MongoDB Atlas Free M0 Cluster**.
- **Android Ready**: Configured with **Capacitor** (`capacitor.config.json`) for Google Play Store `.aab` generation.

---

## 🚀 Quick Start Guide

### 1. Environment Configuration
Create a `.env` file in the root directory with your credentials:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Backend Server (Express + MongoDB)
```bash
npm run server
```
*API will run on `http://localhost:5000` and automatically connect to MongoDB Cluster0.*

### 4. Run Frontend (React + Vite + Tailwind)
```bash
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 📱 Google Play Store Deployment (Android)
To package into an Android `.aab` bundle:
1. Build web production bundle:
   ```bash
   npm run build
   ```
2. Initialize and sync with Capacitor Android:
   ```bash
   npx cap add android
   npx cap sync
   npx cap open android
   ```
3. Generate signed `.aab` in Android Studio $\rightarrow$ **Build > Generate Signed Bundle / APK**.

---

## 🌐 Deploy to Render (Free Web Service)
1. Push this project to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add your `MONGODB_URI` and `GROQ_API_KEY` under Environment Variables.
6. Click **Deploy**. Your app will be live at `https://clarioloop.onrender.com`!
