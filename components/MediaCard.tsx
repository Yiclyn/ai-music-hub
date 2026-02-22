'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Play, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface MediaCardProps {
    id: string
    title: string
    author: string
    coverUrl: string | null
    mediaType: 'audio' | 'video'
    likesCount: number
    commentsCount: number
    hasLiked?: boolean
}

export default function MediaCard({
    id,
    title,
    author,
    coverUrl,
    mediaType,
    likesCount: initialLikes,
    commentsCount,
    hasLiked: initialLiked = false
}: MediaCardProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(initialLiked)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if wrapped in a link
        // Optimistic update
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)

        // Heart animation trigger
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)

        try {
            // Very basic implementation: typically you'd need the current user's ID
            // For this demo without auth, we skip the actual DB insert or just mock it
            // supabase.from('likes').insert({ post_id: id, user_id: 'guest' })
        } catch (error) {
            console.error('Like failed', error)
            // Revert on error
            setLiked(liked)
            setLikes(initialLikes)
        }
    }

    const defaultCover = "linear-gradient(135deg, #8a2be2 0%, #00fa9a 100%)"

    return (
        <Link href={mediaType === 'video' ? `/video/${id}` : `#`} className="group relative block overflow-hidden rounded-xl bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-electric-purple/20">

            {/* Cover Image */}
            <div
                className="aspect-square w-full relative overflow-hidden"
                style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white">
                        <Play size={24} className="ml-1" />
                    </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-xs px-2 py-1 rounded-md shadow">
                    {mediaType === 'video' ? '视频' : '音频'}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-white truncate text-base mb-1">{title}</h3>
                <p className="text-gray-400 text-sm truncate mb-4">{author}</p>

                <div className="flex items-center justify-between">

                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-sm transition-colors relative ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Heart size={18} className={liked ? 'fill-current' : ''} />
                        <span>{likes}</span>

                        {/* Pop Animation */}
                        {isAnimating && (
                            <span className="absolute -top-6 left-1 text-rose-500 animate-float pointer-events-none">
                                <Heart size={24} className="fill-current" />
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <MessageCircle size={18} />
                        <span>{commentsCount}</span>
                    </div>

                </div>
            </div>
        </Link>
    )
}
