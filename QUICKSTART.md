# Quick Start Guide

Get the Ooro Store demo dashboard running in 2 minutes.

## Prerequisites
- Node.js 20+ installed
- npm or yarn
- Chrome or any modern browser

## Run the Dashboard

### 1. Install Dependencies
```bash
npm ci
```

### 2. Start the Dev Server
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### 3. Open in Chrome
Navigate to:
```
http://localhost:5173
```

### 4. Log In
Use the demo credentials:
- **Email:** `admin@oorostore.com`
- **Password:** `Admin@12345`

---

## What's Included

The dashboard runs in **demo mode** with mock data and no backend required:

### Pages Available
- 📊 **Dashboard** — Sales overview, key metrics, charts
- 📦 **Orders** — Order management and status tracking
- 🛍️ **Products** — Product catalog with pricing and SKUs
- 📋 **Categories** — Product category management
- 📈 **Inventory** — Stock levels and low-stock alerts
- 👥 **Customers** — Customer list and details
- 📉 **Reports** — Sales analytics, revenue trends, top products
- 👨‍💼 **Staff** — Staff member management
- 💬 **WhatsApp Settings** — WhatsApp integration configuration
- ⚙️ **Settings** — General application settings

---

## Demo Mode Features

The `.env` file is configured with `VITE_DEMO_MODE=true`, which means:
- ✅ No backend API required
- ✅ Mock data for all endpoints
- ✅ Full UI/UX demonstration
- ✅ Perfect for reviewing the dashboard

### Environment Variables
```env
VITE_API_URL=http://localhost:4000/api    # Backend URL (unused in demo mode)
VITE_DEMO_MODE=true                        # Enable mock data
```

---

## Production Build

To build for production:

```bash
npm run build
```

Output will be in `dist/` directory, ready to serve via Nginx or any static host.

---

## Docker

Build and run the containerized dashboard:

```bash
docker build -t ooro-store-demo .
docker run -p 80:8080 ooro-store-demo
```

Access at `http://localhost:80`

---

## Troubleshooting

### Port 5173 already in use?
Change the port in `frontend/vite.config.ts`:
```typescript
server: {
  port: YOUR_PORT_HERE,
},
```

### Login fails?
Make sure `VITE_DEMO_MODE=true` in `.env` and you're using the exact credentials above.

### Styling looks off?
Clear browser cache (Ctrl+Shift+Delete) and reload.

---

## Next Steps

- Explore the dashboard pages
- Check the mock data in `frontend/src/api/client.ts`
- Review component structure in `frontend/src/components/`
- Connect to a real backend by setting `VITE_DEMO_MODE=false` and configuring `VITE_API_URL`

Happy exploring! 🚀
