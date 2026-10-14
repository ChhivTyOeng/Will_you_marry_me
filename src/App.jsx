import React, { useState, useRef } from 'react'
import { Heart, Sparkles, Smile, Edit2 } from 'lucide-react'
import FloatingBackground from './components/FloatingBackground'
import BouquetDisplay from './components/BouquetDisplay'
import NoButton from './components/NoButton'
import YesCelebration from './components/YesCelebration'
import AudioToggle from './components/AudioToggle'
import { playSparkle } from './utils/sound'

export default function App() {
  const [hasAccepted, setHasAccepted] = useState(false)
  const [dodgeCount, setDodgeCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [partnerName, setPartnerName] = useState('Cutie')
  const [isEditingName, setIsEditingName] = useState(false)

  // References for collision & containment boundary detection
  const cardRef = useRef(null)
  const yesButtonRef = useRef(null)

  // Scale Yes button gently as No is dodged, up to 1.35x max
  const yesScale = Math.min(1 + dodgeCount * 0.05, 1.35)

  const handleYesClick = () => {
    if (soundEnabled) {
      playSparkle()
    }
    setHasAccepted(true)
  }

  const handleReset = () => {
    setHasAccepted(false)
    setDodgeCount(0)
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative flex flex-col justify-between items-center px-3.5 sm:px-6 py-4 sm:py-8 select-none overflow-x-hidden">
      {/* Dreamy Ambient Background with floating elements */}
      <FloatingBackground />

      {/* Audio Sound Effects Toggle */}
      <AudioToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />

      {/* Header Brand Badge */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between text-xs font-semibold text-pink-700/80 mb-2 sm:mb-4 px-1">
        <div className="flex items-center gap-1.5 bg-pink-50/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-pink-200/60 shadow-sm backdrop-blur-sm">
          <span>🌷</span>
          <span className="text-[11px] sm:text-xs">For</span>
          {isEditingName ? (
            <input
              type="text"
              value={partnerName}
              autoFocus
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              onChange={(e) => setPartnerName(e.target.value)}
              className="bg-white px-2 py-0.5 rounded text-pink-800 font-bold text-xs border border-pink-300 outline-none w-24"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="font-bold underline decoration-pink-300 hover:text-pink-900 flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
              title="Click to edit name"
            >
              <span>{partnerName || 'You'}</span>
              <Edit2 className="w-2.5 h-2.5 opacity-60" />
            </button>
          )}
          <span>💗</span>
        </div>

        {dodgeCount > 0 && !hasAccepted && (
          <div className="bg-purple-50/90 text-purple-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-200/80 text-[11px] sm:text-xs font-bold shadow-sm animate-pulse">
            Dodged {dodgeCount}x 🏃💨
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex items-center justify-center relative z-10 my-auto">
        {!hasAccepted ? (
          /* Main Invitation Card */
          <div
            ref={cardRef}
            className="w-full max-w-md sm:max-w-lg glass-card rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-9 md:p-10 shadow-xl sm:shadow-2xl shadow-pink-200/60 text-center relative border border-pink-200/90 transition-all duration-300"
          >
            {/* Top cute subtitle badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 font-bold text-[11px] sm:text-xs md:text-sm tracking-wide mb-3 sm:mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>I have a little question for you... 🌷</span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Main Romantic Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-2 font-heading">
              Will You Go on a Date With Me?{' '}
              <span className="inline-block text-pink-500 animate-wiggle">💗</span>
            </h1>

            {/* Sweet caption */}
            <p className="text-stone-600 text-xs sm:text-sm md:text-base font-medium max-w-md mx-auto mb-3 sm:mb-4">
              A cozy day filled with good food, lots of laughs, and unforgettable moments together. ✨
            </p>

            {/* Central Bouquet Illustration */}
            <BouquetDisplay />

            {/* Hint or playful reaction based on dodge count */}
            <div className="h-5 sm:h-6 mb-3 sm:mb-4 flex items-center justify-center">
              {dodgeCount === 0 ? (
                <p className="text-[11px] sm:text-xs text-pink-500 font-semibold tracking-wide">
                  Choose wisely... but there's really only one right answer! 😉
                </p>
              ) : (
                <p className="text-[11px] sm:text-xs text-rose-600 font-bold animate-pulse flex items-center gap-1">
                  <span>Hey! That "No" button is slippery! Just say yes!</span>
                  <Smile className="w-3.5 h-3.5" />
                </p>
              )}
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 min-h-[56px] sm:min-h-[64px] relative">
              {/* Stationary & Prominent Yes Button */}
              <button
                ref={yesButtonRef}
                type="button"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
                }}
                className="group relative px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-extrabold text-base sm:text-xl shadow-lg shadow-pink-300/70 hover:shadow-xl hover:shadow-pink-400/80 active:scale-95 transition-all duration-200 ring-4 ring-pink-100 flex items-center gap-2 cursor-pointer z-20"
              >
                <span>Yes! 💖</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white group-hover:animate-ping" />
              </button>

              {/* Playful Runaway No Button */}
              <NoButton
                cardRef={cardRef}
                yesButtonRef={yesButtonRef}
                onDodge={() => setDodgeCount((prev) => prev + 1)}
                dodgeCount={dodgeCount}
                soundEnabled={soundEnabled}
              />
            </div>
          </div>
        ) : (
          /* Success Screen Celebration */
          <YesCelebration
            onReset={handleReset}
            soundEnabled={soundEnabled}
            partnerName={partnerName}
          />
        )}
      </main>

      {/* Romantic Footer Note */}
      <footer className="w-full max-w-md mx-auto text-center mt-6 text-xs text-stone-400 font-medium">
        <span>Made with love, pastel tulips & lots of smiles 🌷✨</span>
      </footer>
    </div>
  )
}
