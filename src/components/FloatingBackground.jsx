import React, { useMemo } from 'react'

export default function FloatingBackground() {
  // Generate random positions and animations for floating hearts and flowers
  const particles = useMemo(() => {
    const emojis = ['💗', '🌷', '✨', '🌸', '💕', '⭐', '🌺', '💖']
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 5.5 + Math.random() * 5) % 95}%`,
      animationDuration: `${12 + (i % 8) * 2}s`,
      animationDelay: `${(i * 1.3) % 10}s`,
      size: `${14 + (i % 5) * 6}px`,
      opacity: 0.25 + (i % 4) * 0.15,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Soft pastel ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-purple-200/35 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] bg-rose-100/50 rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />

      {/* Floating hearts and flower petals rising gently */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            bottom: '-40px',
            fontSize: p.size,
            opacity: p.opacity,
            animation: `heart-rise ${p.animationDuration} ease-in-out infinite`,
            animationDelay: p.animationDelay,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
