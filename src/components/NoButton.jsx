import React, { useState, useRef, useCallback, useEffect } from 'react'
import { playBoing } from '../utils/sound'

const NO_PHRASES = [
  'No 🥺',
  'Are you sure? 🙈',
  'Wrong button! 💕',
  'Nice try! 😜',
  "Can't catch me! 🏃‍♀️💨",
  'Think again! ✨',
  'Look at the pink one! 👉',
  'Pretty please? 🥺🌷',
  'You know you want to! 💖',
  'Still trying? 🤭',
  'Saying YES is destiny! 🌸',
]

export default function NoButton({
  cardRef,
  yesButtonRef,
  onDodge,
  dodgeCount,
  soundEnabled,
}) {
  const [position, setPosition] = useState(null) // null = in-flow, { x, y } = fixed
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isWiggling, setIsWiggling] = useState(false)
  const buttonRef = useRef(null)

  // Calculate a safe runaway position that stays on-screen and avoids the card & Yes button
  const calculateRunawayPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 50, y: 50 }

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    // Button approximate dimensions with safety buffer
    const btnW = buttonRef.current?.offsetWidth || 130
    const btnH = buttonRef.current?.offsetHeight || 44
    const margin = viewportW < 640 ? 12 : 24 // tighter margin on mobile

    // Bounding rectangles of forbidden elements
    const cardRect = cardRef?.current?.getBoundingClientRect()
    const yesRect = yesButtonRef?.current?.getBoundingClientRect()

    // Maximum coordinates to stay strictly inside viewport
    const maxX = Math.max(margin, viewportW - btnW - margin)
    const maxY = Math.max(margin, viewportH - btnH - margin)

    let bestX = margin
    let bestY = margin
    let foundSafeSpot = false

    // Attempt up to 50 random positions to find one completely clear of the card & Yes button
    for (let i = 0; i < 50; i++) {
      const candidateX = margin + Math.random() * (maxX - margin)
      const candidateY = margin + Math.random() * (maxY - margin)

      const candidateRect = {
        left: candidateX,
        right: candidateX + btnW,
        top: candidateY,
        bottom: candidateY + btnH,
      }

      // Check overlap with card (with buffer)
      let overlapsCard = false
      if (cardRect) {
        const buffer = viewportW < 640 ? 8 : 16
        overlapsCard = !(
          candidateRect.right < cardRect.left - buffer ||
          candidateRect.left > cardRect.right + buffer ||
          candidateRect.bottom < cardRect.top - buffer ||
          candidateRect.top > cardRect.bottom + buffer
        )
      }

      // Check overlap with Yes button (with safe buffer)
      let overlapsYes = false
      if (yesRect) {
        overlapsYes = !(
          candidateRect.right < yesRect.left - 24 ||
          candidateRect.left > yesRect.right + 24 ||
          candidateRect.bottom < yesRect.top - 24 ||
          candidateRect.top > yesRect.bottom + 24
        )
      }

      if (!overlapsCard && !overlapsYes) {
        bestX = candidateX
        bestY = candidateY
        foundSafeSpot = true
        break
      }
    }

    // Smart fallback for small mobile screens where card occupies most width
    if (!foundSafeSpot && cardRect) {
      const spaceAbove = cardRect.top - margin
      const spaceBelow = viewportH - cardRect.bottom - margin

      if (spaceBelow > btnH + 10 && Math.random() > 0.4) {
        // Place comfortably below the card
        bestY = Math.min(maxY, cardRect.bottom + 12 + Math.random() * Math.max(0, spaceBelow - btnH - 16))
      } else if (spaceAbove > btnH + 10) {
        // Place comfortably above the card
        bestY = Math.max(margin, margin + Math.random() * Math.max(0, spaceAbove - btnH - 10))
      } else {
        // Position at bottom screen corner furthest from Yes button
        bestY = maxY
      }

      bestX = margin + Math.random() * (maxX - margin)

      // Ensure never overlapping Yes button
      if (yesRect && Math.abs(bestY - yesRect.top) < 50) {
        bestY = bestY < viewportH / 2 ? margin : maxY
      }
    }

    return {
      x: Math.round(Math.min(Math.max(margin, bestX), maxX)),
      y: Math.round(Math.min(Math.max(margin, bestY), maxY)),
    }
  }, [cardRef, yesButtonRef])

  const isMovingRef = useRef(false)

  const handleDodge = useCallback(
    (e) => {
      if (e) {
        if (e.cancelable) e.preventDefault()
        e.stopPropagation()
      }

      // Prevent multiple rapid triggers while the button is already moving
      if (isMovingRef.current) return
      isMovingRef.current = true

      // Trigger soft haptic feedback on mobile devices
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([30, 20, 30])
        } catch {
          // ignore if vibration is blocked
        }
      }

      const newPos = calculateRunawayPosition()
      setPosition(newPos)
      setPhraseIndex((prev) => (prev + 1) % NO_PHRASES.length)
      setIsWiggling(true)
      setTimeout(() => setIsWiggling(false), 250)

      // Unlock after the movement animation completes so it can cleanly move again when hovered
      setTimeout(() => {
        isMovingRef.current = false
      }, 350)

      if (soundEnabled) {
        playBoing()
      }

      if (onDodge) {
        onDodge()
      }
    },
    [calculateRunawayPosition, soundEnabled, onDodge]
  )

  // Re-bound if window resizes or mobile orientation changes
  useEffect(() => {
    const handleResize = () => {
      if (position) {
        setPosition(calculateRunawayPosition())
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [position, calculateRunawayPosition])

  const currentPhrase = NO_PHRASES[phraseIndex]

  return (
    <div
      style={
        position
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 50,
              transition:
                'left 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }
          : { position: 'relative' }
      }
      className="inline-block touch-none select-none"
    >
      {/* Playful mini tooltip when dodging */}
      {position && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow pointer-events-none animate-bounce">
          {dodgeCount > 4 ? "Can't catch me! 💨" : 'Too slow! 😜'}
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleDodge}
        onTouchStart={handleDodge}
        onClick={handleDodge}
        onFocus={handleDodge}
        className={`px-5 py-3 sm:px-6 sm:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-200 select-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md border active:scale-90 ${
          position
            ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-rose-200/50'
            : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
        } ${isWiggling ? 'scale-95' : 'hover:scale-105'}`}
      >
        <span>{currentPhrase}</span>
      </button>
    </div>
  )
}
