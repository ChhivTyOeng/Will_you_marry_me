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

  // Calculate a safe runaway position restricted to the center & top, and just slightly below (never deep)
  const calculateRunawayPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 50, y: 50 }

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const btnW = buttonRef.current?.offsetWidth || 130
    const btnH = buttonRef.current?.offsetHeight || 44
    const margin = viewportW < 640 ? 12 : 24

    const cardRect = cardRef?.current?.getBoundingClientRect()
    const yesRect = yesButtonRef?.current?.getBoundingClientRect()

    // Horizontal bounds: kept centered around the main card / middle region
    const minX = cardRect
      ? Math.max(margin, Math.min(cardRect.left - 60, viewportW * 0.08))
      : margin
    const maxX = cardRect
      ? Math.min(viewportW - btnW - margin, Math.max(cardRect.right + 60 - btnW, viewportW * 0.92 - btnW))
      : Math.max(margin, viewportW - btnW - margin)

    // Vertical bounds: strictly TOP and CENTER, and "just a bit bottom" (never deep down)
    const minY = cardRect
      ? Math.max(24, Math.min(cardRect.top - btnH - 15, 60))
      : 30

    // Capped strictly: never go deep into the bottom of the viewport
    const maxY = cardRect
      ? Math.min(viewportH - btnH - 24, cardRect.bottom + 42)
      : Math.round(viewportH * 0.58)

    let bestX = minX
    let bestY = minY
    let foundSafeSpot = false

    // Attempt candidate positions within this restrained top/center/slight-bottom zone
    for (let i = 0; i < 60; i++) {
      const candidateX = minX + Math.random() * Math.max(1, maxX - minX)
      const candidateY = minY + Math.random() * Math.max(1, maxY - minY)

      const candidateRect = {
        left: candidateX,
        right: candidateX + btnW,
        top: candidateY,
        bottom: candidateY + btnH,
      }

      // Check overlap with card (allow sides, top, or slightly bottom)
      let overlapsCard = false
      if (cardRect) {
        // If it's directly in the middle body of the card (where the bouquet/text is), consider it overlapping
        const cardInner = {
          left: cardRect.left + 15,
          right: cardRect.right - 15,
          top: cardRect.top + 30,
          bottom: cardRect.bottom - 45,
        }
        overlapsCard = !(
          candidateRect.right < cardInner.left ||
          candidateRect.left > cardInner.right ||
          candidateRect.bottom < cardInner.top ||
          candidateRect.top > cardInner.bottom
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

    // Smart fallback: pick a spot in the top area or just slightly below the card
    if (!foundSafeSpot) {
      if (cardRect) {
        const pickTop = Math.random() > 0.4
        if (pickTop && cardRect.top > btnH + 30) {
          // Place in top area above card
          bestY = Math.max(24, cardRect.top - btnH - 12)
          bestX = Math.max(minX, Math.min(maxX, cardRect.left + Math.random() * (cardRect.width - btnW)))
        } else {
          // Place just a bit below the card (never deep)
          bestY = Math.min(maxY, cardRect.bottom + 16)
          bestX = Math.max(minX, Math.min(maxX, cardRect.left + (Math.random() > 0.5 ? 10 : cardRect.width - btnW - 10)))
        }
      } else {
        bestY = minY + Math.random() * (maxY - minY)
        bestX = minX + Math.random() * (maxX - minX)
      }
    }

    return {
      x: Math.round(Math.min(Math.max(margin, bestX), viewportW - btnW - margin)),
      y: Math.round(Math.min(Math.max(20, bestY), maxY)),
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
