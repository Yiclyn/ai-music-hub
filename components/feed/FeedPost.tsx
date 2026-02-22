'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Repeat2, Heart, Share, Play, BarChart2 } from 'lucide-react'

// Assuming similar props to what was used before
interface FeedPostProps {
    id: string
    title: string
    description?: string
    author: string
    coverUrl: string | null
    mediaType: 'audio' | 'video'
    likesCount: number
    commentsCount: number
    hasLiked?: boolean
    createdAt?: string
}

export default function FeedPost({
    id,
    title,
    description,
    author,
    coverUrl,
    mediaType,
    likesCount: initialLikes,
    commentsCount,
    hasLiked: initialLiked = false,
    createdAt
}: FeedPostProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(initialLiked)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)

        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
        // Supabase logic omitted for UI demo
    }

    // Format date relative to now roughly
    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : '刚刚'
    const defaultCover = "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)"

    return (
        <article className="flex gap-3 p-4 border-b border-gray-800/60 hover:bg-white/[0.02] transition cursor-pointer">

            {/* Left Avatar Column */}
            <div className="shrink-0 flex flex-col items-center">
                <Link href={`/profile/${author}`} onClick={e => e.stopPropagation()}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aurora-green to-electric-purple flex items-center justify-center font-bold text-white text-sm">
                        {author.substring(0, 2).toUpperCase()}
                    </div>
                </Link>
            </div>

            {/* Right Content Column */}
            <div className="flex-1 min-w-0">

                {/* Header (Author & Date) */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                        <Link href={`/profile/${author}`} className="font-bold text-white hover:underline truncate" onClick={e => e.stopPropagation()}>
                            {author}
                        </Link>
                        <span className="text-gray-500 text-sm truncate">@{author.toLowerCase().replace(/\s/g, '')}</span>
                        <span className="text-gray-500 text-sm">·</span>
                        <span className="text-gray-500 text-sm hover:underline">{formattedDate}</span>
                    </div>
                    <button className="text-gray-500 hover:text-electric-purple transition px-2" onClick={e => e.stopPropagation()}>
                        ···
                    </button>
                </div>

                {/* Text Content */}
                <div className="mb-3">
                    <p className="text-[15px] text-white whitespace-pre-wrap leading-relaxed">
                        {title}
                        {description && <><br /><span className="text-gray-300 mt-1 block">{description}</span></>}
                    </p>
                </div>

                {/* Media Player Area */}
                {mediaType === 'audio' ? (
                    <div
                        className="w-full h-32 md:h-40 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4 group"
                        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
                        onClick={(e) => {
                            // Usually we'd open the global player here, mock interaction for now
                            e.preventDefault();
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>
                        <div className="relative z-10 flex items-center justify-between mt-auto">
                            <button className="w-10 h-10 rounded-full bg-electric-purple text-white flex items-center justify-center hover:scale-105 transition shadow-lg shrink-0">
                                <Play size={20} className="ml-1 fill-white" />
                            </button>
                            {/* Mock waveform */}
                            <div className="flex-1 flex items-center h-8 ml-4 gap-1 opacity-70">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="flex-1 bg-white rounded-full bg-gradient-to-t from-aurora-green to-electric-purple" style={{ height: `${Math.random() * 100}%`, minHeight: '20%' }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider">Audio</div>
                    </div>
                ) : (
                    <Link href={`/video/${id}`} onClick={e => e.stopPropagation()} className="block">
                        <div className="w-full aspect-video rounded-2xl relative overflow-hidden bg-black group border border-gray-800">
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white border border-white/20 group-hover:bg-electric-purple/80 transition-colors">
                                    <Play size={24} className="ml-1 fill-white" />
                                </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider">Video</div>
                        </div>
                    </Link>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-3 max-w-[425px] text-gray-500">

                    <button className="flex items-center gap-2 group transition-colors hover:text-blue-500" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <MessageCircle size={18} />
                        </div>
                        <span className="text-[13px]">{commentsCount > 0 ? commentsCount : ''}</span>
                    </button>

                    <button className="flex items-center gap-2 group transition-colors hover:text-green-500" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Repeat2 size={18} />
                        </div>
                        <span className="text-[13px]"></span>
                    </button>

                    <button
                        className={`flex items-center gap-2 group transition-colors relative ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        onClick={handleLike}
                    >
                        <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-600/10' : 'group-hover:bg-pink-600/10'}`}>
                            <Heart size={18} className={liked ? 'fill-pink-600' : ''} />
                        </div>
                        <span className={`text-[13px] ${liked && 'text-pink-600 font-medium'}`}>{likes > 0 ? likes : ''}</span>
                        {/* Pop Animation */}
                        {isAnimating && (
                            <span className="absolute -top-6 left-2 text-pink-600 animate-float pointer-events-none">
                                <Heart size={24} className="fill-pink-600" />
                            </span>
                        )}
                    </button>

                    <button className="flex items-center gap-2 group transition-colors hover:text-electric-purple" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-electric-purple/10 transition-colors">
                            <BarChart2 size={18} />
                        </div>
                        <span className="text-[13px]">{(Math.random() * 10).toFixed(1)}K</span>
                    </button>

                    <button className="flex items-center gap-2 group transition-colors hover:text-blue-500" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <Share size={18} />
                        </div>
                    </button>

                </div>
            </div>
        </article>
    )
}
