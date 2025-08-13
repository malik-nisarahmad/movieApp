<!-- ───────────────────────────────────────────────────────────── -->
<!--  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ -->
<!--  ┃                   MOVIEAPP  – README                   ┃ -->
<!--  ┃          Neon-dark, glass-morphic, ultra-modern        ┃ -->
<!--  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ -->
<!-- ───────────────────────────────────────────────────────────── -->

<div align="center">

  <!-- animated neon title -->
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=50&duration=3000&pause=1000&color=00FFF0&center=true&vCenter=true&width=600&lines=🎬+MOVIEAPP" alt="typing" />

  <p style="font-size: 1.3em; color: #b3b3ff; margin-top: -10px;">
    Your pocket cinema — re-imagined for 2024
  </p>

  <!-- floating shields -->
  <p>
    <img src="https://img.shields.io/badge/Expo-SDK%2051-00FFF0?style=for-the-badge&logo=expo&logoColor=000000" />
    <img src="https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Backend-Appwrite-F02E65?style=for-the-badge" />
  </p>

  <!-- hero gif -->
  <img src=".github/assets/hero.gif" width="340" style="border-radius: 2rem; box-shadow: 0 0 20px rgba(0,255,240,.25);" alt="hero" />

</div>

---

<!-- glass divider -->
<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" width="100%" height="1" />

## 🌌  What’s inside

| 🎥 **Discover** | 🔍 **Search** | ❤️ **Save** |
|-----------------|---------------|-------------|
| Trending & latest movies via **TMDB**. | Lightning fuzzy search. | Offline saved list w/ **AsyncStorage**. |

| ⚡ **Auth** | 🎨 **UI/UX** | 🚀 **Performance** |
|-------------|--------------|--------------------|
| **Clerk** magic-link & social login. | Glass-morphism + neon glow + vector icons. | Hermes engine + Expo Router v3. |

---

## 🚀  Quick start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/movie-app.git
cd movie-app
npm install        # or pnpm install / yarn
2. Environment
Create .env (never commit):
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=xyz
EXPO_PUBLIC_TMDB_KEY=your-tmdb-token
3. Run
npx expo start
Scan the Expo Go QR code or press w for web.

📁 Architecture
app/
 ├─ (auth)/          # Clerk flows
 ├─ (protected)/     # Tabs (Home, Saved, Profile)
 ├─ movies/[id].tsx  # Movie details
components/          # Reusable UI
services/            # API + storage
constants/           # Icons & colors
🛠️ Scripts
Command	Action
npm start	Metro bundler
npm run android	Android emulator
npm run ios	iOS simulator
npm run lint	ESLint + Prettier
<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=20&duration=3000&pause=1000&color=00FFF0&center=true&vCenter=true&width=350&lines=⭐+Star+if+you+love+cinema!" />
</div>