'use client'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useState } from 'react'

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/90 backdrop-blur border-t border-white/10 z-50 flex items-center px-4">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/4">
                    <div className="w-12 h-12 bg-white/10 rounded overflow-hidden flex-shrink-0">
                        {/* Placeholder Cover */}
                        <div className="w-full h-full bg-gradient-to-br from-electric-purple to-aurora-green opacity-50"></div>
                    </div>
                    <div className="hidden md:block">
                        <h4 className="text-sm font-semibold truncate leading-tight">未知曲目</h4>
                        <p className="text-xs text-gray-400 truncate">未知的 AI 作者</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center flex-1 max-w-xl">
                    <div className="flex items-center gap-6 mb-1">
                        <button className="text-gray-400 hover:text-white transition"><SkipBack size={20} /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                        >
                            {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-1" />}
                        </button>
                        <button className="text-gray-400 hover:text-white transition"><SkipForward size={20} /></button>
                    </div>
                    <div className="w-full flex items-center gap-2">
                        <span className="text-xs text-gray-400">0:00</span>
                        <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
                            <div className="h-full bg-aurora-green w-1/3 group-hover:bg-electric-purple transition-colors relative"></div>
                        </div>
                        <span className="text-xs text-gray-400">3:42</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="w-1/4 flex justify-end items-center gap-2 hidden md:flex">
                    <Volume2 size={20} className="text-gray-400" />
                    <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                        <div className="h-full bg-white w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
