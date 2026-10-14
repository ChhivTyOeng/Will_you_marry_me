import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  Heart,
  Calendar,
  Sparkles,
  Coffee,
  Utensils,
  Film,
  IceCream,
  Palette,
  Flower2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'
import { playSparkle, playCelebrationChime } from '../utils/sound'

const DATE_IDEAS = [
  {
    id: 'cafe',
    title: 'Cafe & Boba Date',
    desc: 'Cozy matcha lattes, croissants, & sweet chats',
    icon: Coffee,
    emoji: '☕',
    color: 'from-amber-100 to-orange-100 border-amber-200 text-amber-900',
  },
  {
    id: 'picnic',
    title: 'Sunset Garden Picnic',
    desc: 'Blanket on the grass, strawberries, & flowers',
    icon: Flower2,
    emoji: '🌷',
    color: 'from-pink-100 to-rose-100 border-pink-200 text-pink-900',
  },
  {
    id: 'dinner',
    title: 'Candlelit Dinner',
    desc: 'Delicious handmade pasta & romantic atmosphere',
    icon: Utensils,
    emoji: '🍝',
    color: 'from-rose-100 to-purple-100 border-rose-200 text-rose-900',
  },
  {
    id: 'pottery',
    title: 'Painting or Pottery',
    desc: 'Making cute art & laughing together',
    icon: Palette,
    emoji: '🎨',
    color: 'from-purple-100 to-indigo-100 border-purple-200 text-purple-900',
  },
  {
    id: 'movie',
    title: 'Starlight Movie Night',
    desc: 'Cuddling with warm popcorn & our favorite film',
    icon: Film,
    emoji: '🎬',
    color: 'from-blue-100 to-pink-100 border-blue-200 text-blue-900',
  },
  {
    id: 'icecream',
    title: 'Late Night Gelato',
    desc: 'Sweet ice cream scoops & evening walk',
    icon: IceCream,
    emoji: '🍦',
    color: 'from-yellow-100 to-pink-100 border-yellow-200 text-yellow-900',
  },
]

export default function YesCelebration({ onReset, soundEnabled, partnerName }) {
  const [selectedIdeas, setSelectedIdeas] = useState(['cafe', 'picnic'])
  const [dateChoice, setDateChoice] = useState(() => {
    const nextWeekend = new Date()
    nextWeekend.setDate(nextWeekend.getDate() + ((6 - nextWeekend.getDay() + 7) % 7 || 7))
    return nextWeekend.toISOString().split('T')[0]
  })
  const [specialNote, setSpecialNote] = useState('I promise to bring your favorite flowers and all my love! 🌷')
  const [copied, setCopied] = useState(false)

  // Trigger high-energy romantic confetti bursts on mount
  useEffect(() => {
    if (soundEnabled) {
      playCelebrationChime()
    }

    // Fire fireworks / confetti cannons
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f472b6', '#fb7185', '#ec4899', '#fbcfe8', '#fef08a', '#c084fc'],
    }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    // Second wave of heart-shaped confetti after a brief moment
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f5e', '#ec4899', '#fb7185'],
      })
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#ec4899', '#fb7185'],
      })
    }, 600)

    return () => clearTimeout(timer)
  }, [soundEnabled])

  const toggleIdea = (id) => {
    if (soundEnabled) playSparkle()
    setSelectedIdeas((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    )
  }

  const fireMoreConfetti = () => {
    if (soundEnabled) playSparkle()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f472b6', '#fda4af', '#fef08a'],
    })
  }

  const handleCopyDatePass = () => {
    if (soundEnabled) playSparkle()
    const chosenTitles = DATE_IDEAS.filter((i) => selectedIdeas.includes(i.id))
      .map((i) => `${i.emoji} ${i.title}`)
      .join('\n- ')

    const formattedDate = new Date(dateChoice + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const shareText = `💖 OFFICIAL DATE INVITATION CONFIRMED! 🌷\n\nTo: ${partnerName || 'My Favorite Person'} 💗\nYou said YES to going on a date with me!\n\n📅 Date: ${formattedDate}\n✨ Activities:\n- ${chosenTitles}\n\n💌 Note: ${specialNote}\n\nCan't wait to make unforgettable memories with you! 💕`

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Celebration Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl sm:shadow-2xl shadow-pink-200/50 text-center relative overflow-hidden">
        {/* Decorative corner sparkles */}
        <span className="absolute top-3 left-4 text-lg sm:text-xl animate-twinkle">✨</span>
        <span className="absolute top-4 right-4 text-lg sm:text-xl animate-twinkle" style={{ animationDelay: '1s' }}>💖</span>
        <span className="absolute bottom-3 left-4 text-lg sm:text-xl animate-twinkle" style={{ animationDelay: '1.5s' }}>🌷</span>
        <span className="absolute bottom-4 right-4 text-lg sm:text-xl animate-twinkle" style={{ animationDelay: '0.7s' }}>✨</span>

        {/* Floating Celebration Mascot / Illustration */}
        <div className="relative mx-auto w-36 h-36 sm:w-52 sm:h-52 mb-4 sm:mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-300/40 via-rose-200/50 to-purple-200/40 blur-xl animate-pulse-soft" />
          <img
            src="/images/celebration.jpg"
            alt="Cute celebration couple hugging with romantic heart and flowers"
            className="w-full h-full object-cover rounded-3xl shadow-lg border-2 border-white animate-float relative z-10"
          />
          <div className="absolute -bottom-1.5 right-1.5 z-20 bg-rose-500 text-white p-1.5 sm:p-2 rounded-full shadow-md animate-bounce">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
          </div>
        </div>

        {/* Big Celebration Headlines */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-pink-100/80 text-pink-700 font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 border border-pink-200">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>BEST DECISION EVER!</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 mb-2 sm:mb-3 tracking-tight">
          YAYYYY! YOU SAID YES! 💗🌷
        </h1>

        <p className="text-stone-600 text-sm sm:text-lg max-w-lg mx-auto font-medium leading-relaxed mb-5 sm:mb-6">
          You just made my whole day! I honestly can't wait to spend time with you. 💕
        </p>

        {/* Confetti button */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          <button
            onClick={fireMoreConfetti}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-pink-300/50 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Celebrate Again! 🎉</span>
          </button>
          <button
            onClick={onReset}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 font-semibold text-xs sm:text-sm border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Runaway No Again</span>
          </button>
        </div>
      </div>

      {/* Date-Planning Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-100/70 border border-pink-200/80 text-left">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-2xl">🌸</span>
          <h2 className="text-2xl font-bold text-pink-900 tracking-tight font-heading">
            Let's Plan Our Dream Date!
          </h2>
        </div>
        <p className="text-stone-600 text-sm mb-6">
          Pick what sounds most fun to you, select a day, and grab your official date pass!
        </p>

        {/* Activity Selection Cards */}
        <label className="block text-xs font-bold text-pink-700 uppercase tracking-wider mb-3">
          Step 1: Choose Fun Activities ({selectedIdeas.length} selected)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {DATE_IDEAS.map((idea) => {
            const isSelected = selectedIdeas.includes(idea.id)
            return (
              <button
                key={idea.id}
                type="button"
                onClick={() => toggleIdea(idea.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-300 ring-2 ring-pink-300/50 shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 border-stone-200 hover:border-pink-200 opacity-80'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm ${
                    isSelected ? 'bg-pink-500 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {idea.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-sm">{idea.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-pink-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{idea.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Date and Custom Note Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Calendar Picker */}
          <div>
            <label className="block text-xs font-bold text-pink-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>Step 2: Pick A Date 📅</span>
            </label>
            <input
              type="date"
              value={dateChoice}
              onChange={(e) => setDateChoice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 text-stone-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm cursor-pointer"
            />
          </div>

          {/* Sweet Wish/Note */}
          <div>
            <label className="block text-xs font-bold text-pink-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              <span>Step 3: Sweet Wish / Note 💌</span>
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Can we get extra boba pearls? 😋"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
            />
          </div>
        </div>

        {/* Official Date Pass Ticket */}
        <div className="rounded-2xl border-2 border-dashed border-pink-300 bg-gradient-to-br from-pink-50/70 via-rose-50/50 to-white/90 p-5 relative overflow-hidden shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎟️</span>
                <span className="text-xs font-extrabold tracking-widest uppercase text-pink-600">
                  OFFICIAL DATE PASS
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-800">
                A Lovely Date with {partnerName || 'My Favorite Person'} 💕
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                📅{' '}
                <span className="font-semibold text-pink-900">
                  {new Date(dateChoice + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>{' '}
                • {selectedIdeas.length} fun adventures planned
              </p>
            </div>

            <button
              onClick={handleCopyDatePass}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Invitation Copied! ✨</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Date Ticket 💌</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
