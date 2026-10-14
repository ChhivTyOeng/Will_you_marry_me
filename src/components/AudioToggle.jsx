import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioToggle({ soundEnabled, setSoundEnabled }) {
  return (
    <button
      onClick={() => setSoundEnabled((prev) => !prev)}
      aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full glass-pill shadow-sm hover:shadow-md hover:bg-white/95 text-pink-700 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 cursor-pointer"
      title={soundEnabled ? 'Sound effects on' : 'Sound effects muted'}
    >
      {soundEnabled ? (
        <>
          <Volume2 className="w-4 h-4 text-pink-500 animate-pulse" />
          <span className="hidden sm:inline">Sound On 🎶</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-gray-400" />
          <span className="hidden sm:inline text-gray-500">Muted 🔇</span>
        </>
      )}
    </button>
  )
}
