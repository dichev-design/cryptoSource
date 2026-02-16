# Mobile Game Setup Guide

## Overview

The tapping game has been optimized for mobile devices with a completely redesigned layout that eliminates the main navigation and maximizes the game area.

## Architecture

### Two Ways to Access the Game:

#### 1. **Integrated Mobile Route** (Current Setup)

- Route: `/tapping-game`
- The game automatically works in full-screen on mobile
- Users can access it from the main app with the "Tapping Game" link in the navbar
- For mobile, the layout is bypassed and only the optimized game is shown

#### 2. **Separate Mobile App** (Optional)

- Alternative entry point: `src/MobileApp.tsx`
- Can be deployed independently by:
  1. Creating a separate build configuration in `vite.config.ts`
  2. Pointing to `MobileApp.tsx` as the entry point instead of `main.tsx`
  3. Deploying to a separate domain or subdomain

## Mobile Optimizations

### Layout Changes

- ✅ **Full Viewport Usage**: Eliminated main navigation bar
- ✅ **Compact Header**: Minimal header with only title and logout button
- ✅ **No Footer**: Removed footer to maximize game space
- ✅ **Aspect Ratio Lock**: Game circle maintains 1:1 aspect ratio
- ✅ **Flexible Spacing**: Uses flex layout to fit everything without scrolling

### CSS Features

- **File**: `src/styles/tapping-game-mobile.css`
- Optimized for small screens (320px and up)
- Landscape mode adjustments
- Removes character on screens < 500px height to save space
- Touch-optimized tap circles and buttons

### Components

- **TappingGameMobile.tsx**: Optimized mobile component with compact layout
- Streams all game data efficiently
- Maintains all core functionality: coin tapping, rewards, user auth, Telegram integration

## Responsive Design

### Breakpoints

- **Vertical (Portrait)**: Full character shown, all elements visible
- **Landscape**: Character hidden, tap circle becomes secondary focus
- **Small Screens (<500px)**: Character hidden, maximizes tap area

## Deployment Options

### Option A: Keep Integrated (Recommended for MVP)

```bash
npm run build
# Deploy to vercel - same domain as main app
```

### Option B: Separate Mobile Domain

1. Create a new `mobile-app.html` entry point:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CryptoSource Tapper</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/mobile-main.tsx"></script>
  </body>
</html>
```

2. Create `src/mobile-main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import MobileApp from "./MobileApp.tsx";
import "./styles/global.css";
import "./styles/tapping-game-mobile.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>,
);
```

3. Update `vite.config.ts` to support multiple entry points:

```ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        mobile: resolve(__dirname, "mobile-app.html"),
      },
      output: {
        entryFileNames: "[name]-[hash].js",
      },
    },
  },
});
```

## Features Preserved

- ✅ Telegram bot integration
- ✅ Haptic feedback
- ✅ Floating coin animations
- ✅ User authentication
- ✅ Cloud sync (when logged in)
- ✅ Reward claiming
- ✅ LocalStorage persistence
- ✅ Responsive animations

## Testing Checklist

- [ ] Test on iPhone (various sizes: SE, 12, 13, 14, 15)
- [ ] Test on Android (various sizes: 360px, 480px, etc.)
- [ ] Test in Telegram bot mini app
- [ ] Test tap responsiveness
- [ ] Test reward claiming
- [ ] Test logout functionality
- [ ] Test portrait and landscape modes
- [ ] Verify no scrolling needed
- [ ] Verify haptic feedback works
- [ ] Test on slow 3G network

## Browser Support

- iOS Safari 13+
- Chrome Android 88+
- Samsung Internet 14+
- Telegram WebApp version 7+

## Notes

- No changes needed to backend/API
- Game data syncs automatically to same database
- User authentication works across both main app and game
- Mobile-optimized CSS ensures no layout shift
