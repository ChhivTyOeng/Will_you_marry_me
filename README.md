# 🌷 Will You Go On A Date With Me? 💗

> A cute, romantic, and playful interactive date invitation website built with **React JS**, **Tailwind CSS**, and **Vite**.

![Date Invitation Preview](public/images/bouquet.jpg)

---

## ✨ Features

- **🌸 Clean & Romantic Aesthetic**: Soft pastel pinks, creams, and lavender tones with subtle glassmorphic cards, rounded borders, floating hearts, and floral bouquets.
- **🏃‍♀️ Playful Runaway "No" Button**:
  - Whenever the cursor hovers or a finger taps on the **No** button, it playfully dodges to a safe random position on the screen!
  - Rotates through humorous teasing phrases ("Are you sure? 🙈", "Nice try! 😜", "Wrong button! 💕", "Can't catch me! 🏃‍♀️💨").
  - Dynamically detects the viewport and invitation card bounds so it **never goes off-screen** and **never overlaps the Yes button**.
  - Includes mobile haptic feedback (`navigator.vibrate`) on supported devices.
- **💖 Irresistible "Yes!" Button**:
  - Stationary, easy to click, and grows slightly larger with each dodge!
- **🎉 Romantic Celebration Screen**:
  - Triggers vibrant multi-stage confetti (`canvas-confetti`).
  - Displays a cute celebratory illustration (`YAYYYY! YOU SAID YES! 💗🌷`).
- **📅 Interactive Date-Planning Section**:
  - Multi-select date activities (Cozy Cafe & Boba, Sunset Picnic, Candlelit Dinner, Pottery Workshop, Starlight Movie Night, Late-Night Gelato).
  - Date calendar picker.
  - Sweet custom message / special request note.
  - **Official Date Ticket Pass 🎟️**: Clickable card with instant one-click copying to share via WhatsApp, iMessage, or Instagram DM!
- **🎵 Built-in Web Audio API Chimes**:
  - Playful "boing" when the No button dodges and a dreamy romantic chime chord when Yes is clicked.
  - Zero external MP3 files needed; works completely offline.
  - Sound on/off toggle button.
- **📱 Fully Responsive & Mobile-Optimized**:
  - Clean touch targets, `100dvh` viewport support, mobile-friendly padding, and safe-area insets.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher) installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/ChhivTyOeng/Will_you_marry_me.git
cd Will_you_marry_me
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

### 4. Build for Production

```bash
npm run build
```

The optimized production assets will be output to the `dist/` folder.

---

## 📂 Project Structure

```
├── public/
│   └── images/
│       ├── bouquet.jpg       # Center pastel tulip bouquet illustration
│       └── celebration.jpg   # Romantic celebration illustration
├── src/
│   ├── components/
│   │   ├── AudioToggle.jsx        # Sound effect toggle (mute/unmute)
│   │   ├── BouquetDisplay.jsx     # Floating central tulip bouquet card
│   │   ├── FloatingBackground.jsx # Floating hearts, flowers & sparkles
│   │   ├── NoButton.jsx           # Runaway evasion logic & touch handler
│   │   └── YesCelebration.jsx     # Celebration screen & interactive date planner
│   ├── utils/
│   │   └── sound.js               # Web Audio API chime & sound synthesizer
│   ├── App.jsx                    # Root component managing states & layout
│   ├── index.css                  # Custom animations, fonts, and styles
│   └── main.jsx                   # React 19 root entrypoint
├── index.html                     # HTML head with Google Fonts & viewport meta
├── package.json                   # Dependencies & scripts
└── vite.config.js                 # Vite configuration with Tailwind CSS v4
```

---

Made with love, pastel tulips & lots of smiles 🌷✨
