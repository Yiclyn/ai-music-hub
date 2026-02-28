'use client'

import { createContext, useContext, useState, useRef } from 'react'

interface AudioContextType {
  currentlyPlaying: string | null
  setCurrentlyPlaying: (postId: string | null) => void
  pauseAll: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())

  const pauseAll = () => {
    audioRefs.current.forEach((audio) => {
      if (!audio.paused) {
        audio.pause()
      }
    })
    setCurrentlyPlaying(null)
  }

  const setCurrentlyPlayingWithPause = (postId: string | null) => {
    if (currentlyPlaying && currentlyPlaying !== postId) {
      const currentAudio = audioRefs.current.get(currentlyPlaying)
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause()
      }
    }
    setCurrentlyPlaying(postId)
  }

  return (
    <AudioContext.Provider value={{
      currentlyPlaying,
      setCurrentlyPlaying: setCurrentlyPlayingWithPause,
      pauseAll,
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}