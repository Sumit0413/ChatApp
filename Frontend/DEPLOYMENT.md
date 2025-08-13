# Frontend Deployment Guide

## 🚀 Quick Fix for Build Error

**Error**: `sh: line 1: react-scripts: command not found`
**Solution**: This project uses **Vite**, not Create React App.

### ✅ Correct Build Commands:
- **Build**: `npm run build`
- **Start**: `npm run preview`
- **Dev**: `npm run dev`
- **Output Directory**: `dist`

---

## 📋 Platform-Specific Deployment

### 🔵 **Vercel** (Recommended)
1. Connect your GitHub repository
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL` = Your backend URL
   - `VITE_SOCKET_URL` = Your socket URL

**Files**: Uses `vercel.json` (already created)

### 🟠 **Netlify**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL` = Your backend URL
   - `VITE_SOCKET_URL` = Your socket URL

**Files**: Uses `netlify.toml` (already created)

### 🟣 **Railway**
1. Connect your GitHub repository
2. **Environment Variables**:
   - `VITE_API_BASE_URL` = Your backend URL
   - `VITE_SOCKET_URL` = Your socket URL

**Files**: Uses `railway.toml` (already created)

### 🔴 **Render**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Start command: `npm run preview`
4. **Environment Variables**:
   - `VITE_API_BASE_URL` = Your backend URL
   - `VITE_SOCKET_URL` = Your socket URL

---

## 🛠️ Manual Deployment Steps

### 1. **Build the Project**
```bash
cd Frontend
npm install
npm run build
```

### 2. **Test Build Locally**
```bash
npm run preview
```

### 3. **Deploy**
Upload the `dist/` folder to your hosting provider.

---

## ⚙️ Environment Variables Setup

Create these environment variables on your deployment platform:

```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-socket-url.com
```

**Example for DevTunnel**:
```env
VITE_API_BASE_URL=https://abc123-7000.devtunnels.ms
VITE_SOCKET_URL=https://abc123-7000.devtunnels.ms
```

---

## 🐛 Common Issues & Solutions

### Issue: "react-scripts not found"
**Solution**: Change build command to `npm run build`

### Issue: "404 on refresh"
**Solution**: Configure SPA redirects (already handled in config files)

### Issue: "API calls fail"
**Solution**: Set correct `VITE_API_BASE_URL` environment variable

### Issue: "Socket connection fails"
**Solution**: Set correct `VITE_SOCKET_URL` environment variable

---

## 📁 Files Created for Deployment

- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration  
- ✅ `railway.toml` - Railway configuration
- ✅ `vite.config.js` - Updated with build optimizations

Choose the platform you prefer and follow the corresponding instructions above!
