# ASTRA — Immersive Astronaut Vision System

A complete, deployable website for the NASA Space Apps Challenge. Built with vanilla TypeScript + Vite, no frameworks.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

> Camera requires **HTTPS or localhost**. Use `ngrok http 5173` for mobile testing.

## 🏗 Project Structure

```
astra-website/
├── index.html                # Entry
├── package.json              # Vite + TS
├── vite.config.ts            # Build config
├── tsconfig.json             # Strict TS
├── netlify.toml              # Deploy + security headers
├── public/                   # Static assets
│   ├── favicon.svg
│   ├── manifest.webmanifest  # PWA
│   └── robots.txt
└── src/
    ├── main.ts               # Router bootstrap
    ├── styles.css            # All styles
    ├── router.ts             # SPA router
    ├── pages/                # 5 pages
    │   ├── landing.ts        # Home
    │   ├── about.ts          # About
    │   ├── permission.ts     # Camera permission
    │   ├── vision.ts         # Immersive HUD
    │   └── notfound.ts       # 404
    ├── modules/              # Business logic
    │   ├── camera.ts         # getUserMedia
    │   ├── health.ts         # Vitals + AI
    │   ├── hud.ts            # DOM bindings
    │   ├── storage.ts        # localStorage
    │   └── types.ts          # Shared types
    └── components/           # Shared UI
        ├── navbar.ts
        └── footer.ts
```

## 📦 Build for Production

```bash
npm run build      # → dist/
npm run preview    # preview build
```

Deploy the `dist/` folder to:

- **Netlify** — drag `dist/` onto netlify.com/drop (uses `netlify.toml`)
- **Vercel** — `vercel --prod`
- **GitHub Pages** — push `dist/` to `gh-pages` branch
- **Cloudflare Pages** — connect repo, auto-builds

HTTPS is automatic on all these platforms (required for camera).

## 📱 Testing on Mobile

```bash
npm run dev
ngrok http 5173
# open the https ngrok URL on your phone
```

## ✅ Features

- ✅ Real camera via `navigator.mediaDevices.getUserMedia()`
- ✅ Rear camera default, front/rear switching
- ✅ Camera ON/OFF, fullscreen, demo fallback
- ✅ Immersive helmet visor HUD (pure CSS)
- ✅ Live ECG waveform, simulated vitals (labeled SIM)
- ✅ Health scan, AI Copilot, emergency log
- ✅ Proper stream cleanup on every navigation
- ✅ Responsive mobile/tablet/desktop
- ✅ SPA routing with `pushState`
- ✅ PWA manifest
- ✅ Security headers in `netlify.toml`
- ✅ HTTPS-ready deployment config

## ⚠ Medical Disclaimer

All health readings in this app are **simulated**. A browser camera cannot measure SpO₂, blood pressure, radiation, bone density, or immune function. This is decision-support, not medical diagnosis.

## 🎯 NASA Space Apps

> **Project ASTRA** — Astronaut Health Intelligence System  
> Immersive first-person astronaut POV + AI health decision support.
