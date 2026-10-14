import React from 'react'
import { Sparkles, Heart } from 'lucide-react'

export default function BouquetDisplay() {
  return (
    <div className="relative mx-auto my-3 flex items-center justify-center select-none">
      {/* Soft romantic backdrop halo */}
      <div className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-pink-200/60 via-rose-100/70 to-purple-100/60 blur-xl animate-pulse-soft" />

      {/* Sparkling stars surrounding bouquet */}
      <span className="absolute -top-2 left-6 text-pink-400 text-base sm:text-lg animate-twinkle">✨</span>
      <span className="absolute top-6 right-6 text-amber-400 text-lg sm:text-xl animate-twinkle" style={{ animationDelay: '1s' }}>✨</span>
      <span className="absolute bottom-5 left-4 text-pink-300 text-sm sm:text-base animate-twinkle" style={{ animationDelay: '1.8s' }}>🌸</span>
      <span className="absolute bottom-3 right-8 text-rose-400 text-xs sm:text-sm animate-twinkle" style={{ animationDelay: '0.6s' }}>💗</span>

      {/* Main Bouquet Card / Container */}
      <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-3xl p-1.5 sm:p-2 bg-white/70 shadow-lg shadow-pink-100/80 border border-pink-100/90 flex items-center justify-center animate-float">
        <img
          src="/images/bouquet.jpg"
          alt="A romantic bouquet of pastel tulips"
          className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-500 hover:scale-105"
          loading="eager"
        />

        {/* Floating badge */}
        <div className="absolute -bottom-3 bg-white/95 px-3 py-1 rounded-full shadow-md border border-pink-200/80 flex items-center gap-1.5 text-xs font-bold text-pink-600 tracking-wide">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-wiggle" />
          <span>Handpicked for you</span>
          <span>🌷</span>
        </div>
      </div>
    </div>
  )
}
