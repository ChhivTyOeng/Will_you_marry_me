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

  // Calculate a safe runaway position strictly restricted to the TOP and CENTER (NEVER bottom)
  const calculateRunawayPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 50, y: 50 }

    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    const btnW = buttonRef.current?.offsetWidth || 130
    const btnH = buttonRef.current?.offsetHeight || 44
    const margin = viewportW < 640 ? 12 : 24

    const cardRect = cardRef?.current?.getBoundingClientRect()
    const yesRect = yesButtonRef?.current?.getBoundingClientRect()

    // Horizontal bounds: center region and left/right flanks around the card
    const minX = cardRect
      ? Math.max(margin, Math.min(cardRect.left - 50, viewportW * 0.08))
      : margin
    const maxX = cardRect
      ? Math.min(viewportW - btnW - margin, Math.max(cardRect.right + 50 - btnW, viewportW * 0.92 - btnW))
      : Math.max(margin, viewportW - btnW - margin)

    // Vertical bounds: strictly TOP and CENTER (NEVER bottom)
    // minY: area above the card / upper viewport
    const minY = cardRect
      ? Math.max(20, Math.min(cardRect.top - btnH - 12, 50))
      : 25

    // maxY: capped strictly at the upper-center level (never below the card's middle, NEVER bottom)
    const maxY = cardRect
      ? Math.min(cardRect.top + cardRect.height * 0.38, viewportH * 0.44)
      : Math.round(viewportH * 0.42)

    let bestX = minX
    let bestY = minY
    let foundSafeSpot = false

    // Attempt candidate positions within this strict top/center zone
    for (let i = 0; i < 60; i++) {
      const candidateX = minX + Math.random() * Math.max(1, maxX - minX)
      const candidateY = minY + Math.random() * Math.max(1, maxY - minY)

      const candidateRect = {
        left: candidateX,
        right: candidateX + btnW,
        top: candidateY,
        bottom: candidateY + btnH,
      }

      // Check overlap with card's central illustration / heading text
      let overlapsContent = false
      if (cardRect) {
        const cardInner = {
          left: cardRect.left + 20,
          right: cardRect.right - 20,
          top: cardRect.top + 45,
          bottom: cardRect.top + cardRect.height * 0.38,
        }
        overlapsContent = !(
          candidateRect.right < cardInner.left ||
          candidateRect.left > cardInner.right ||
          candidateRect.bottom < cardInner.top ||
          candidateRect.top > cardInner.bottom
        )
      }

      // Ensure never anywhere near the Yes button
      let overlapsYes = false
      if (yesRect) {
        overlapsYes = !(
          candidateRect.right < yesRect.left - 30 ||
          candidateRect.left > yesRect.right + 30 ||
          candidateRect.bottom < yesRect.top - 30 ||
          candidateRect.top > yesRect.bottom + 30
        )
      }

      if (!overlapsContent && !overlapsYes) {
        bestX = candidateX
        bestY = candidateY
        foundSafeSpot = true
        break
      }
    }

    // Fallback: pick guaranteed safe top spots (above the card or flanks)
    if (!foundSafeSpot) {
      if (cardRect && cardRect.top > btnH + 20) {
        // Safe position in the top area above the card
        bestY = Math.max(20, cardRect.top - btnH - 10)
        bestX = Math.max(minX, Math.min(maxX, cardRect.left + Math.random() * Math.max(10, cardRect.width - btnW)))
      } else {
        // Upper center
        bestY = minY
        bestX = Math.max(minX, Math.min(maxX, viewportW / 2 - btnW / 2 + (Math.random() > 0.5 ? 60 : -60)))
      }
    }

    return {
      x: Math.round(Math.min(Math.max(margin, bestX), viewportW - btnW - margin)),
      y: Math.round(Math.min(Math.max(18, bestY), maxY)),
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
