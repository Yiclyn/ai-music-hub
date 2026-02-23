'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Repeat2, Heart, Share, Play, BarChart2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'
import { useRouter } from 'next/navigation'

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
    const { user } = useAuth()
    const router = useRouter()

    const requireLogin = () => {
        if (!user) {
            router.push('/login')
            return true
        }
        return false
    }

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (requireLogin()) return

        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)

        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
        // Supabase logic omitted for UI demo
    }

    // Format date relative to now roughly
    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : '刚刚'
    const defaultCover = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" // lighter gray gradient

    return (
        <article className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 mb-4 shadow-sm hover:shadow-md transition cursor-pointer">

            {/* Left Avatar Column */}
            <div className="shrink-0 flex flex-col items-center">
                <Link href={`/profile/${author}`} onClick={e => e.stopPropagation()}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-sm hover:scale-105 transition">
                        {author.substring(0, 2).toUpperCase()}
                    </div>
                </Link>
            </div>

            {/* Right Content Column */}
            <div className="flex-1 min-w-0">

                {/* Header (Author & Date) */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 truncate">
                        <Link href={`/profile/${author}`} className="font-bold text-slate-900 hover:text-blue-600 transition truncate" onClick={e => e.stopPropagation()}>
                            {author}
                        </Link>
                        <span className="text-slate-500 text-sm truncate">@{author.toLowerCase().replace(/\s/g, '')}</span>
                        <span className="text-slate-500 text-sm">·</span>
                        <span className="text-slate-500 text-sm hover:underline">{formattedDate}</span>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition px-2" onClick={e => e.stopPropagation()}>
                        ···
                    </button>
                </div>

                {/* Text Content */}
                <div className="mb-4">
                    <p className="text-[15px] text-slate-900 whitespace-pre-wrap leading-relaxed">
                        {title}
                        {description && <><br /><span className="text-slate-500 mt-1 block">{description}</span></>}
                    </p>
                </div>

                {/* Media Player Area */}
                {mediaType === 'audio' ? (
                    <div
                        className="w-full h-32 md:h-40 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4 group border border-slate-100 shadow-inner"
                        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
                        onClick={(e) => {
                            // Usually we'd open the global player here, mock interaction for now
                            e.preventDefault();
                        }}
                    >
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition"></div>
                        <div className="relative z-10 flex items-center justify-between mt-auto">
                            <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-lg shrink-0">
                                <Play size={20} className="ml-1 fill-white" />
                            </button>
                            {/* Mock waveform */}
                            <div className="flex-1 flex items-center h-8 ml-4 gap-1 opacity-70">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="flex-1 bg-white rounded-full bg-gradient-to-t from-blue-400 to-blue-600 shadow-sm" style={{ height: `${Math.random() * 100}%`, minHeight: '20%' }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-slate-900 uppercase tracking-wider shadow-sm border border-slate-200/50">Audio</div>
                    </div>
                ) : (
                    <Link href={`/video/${id}`} onClick={e => e.stopPropagation()} className="block">
                        <div className="w-full aspect-video rounded-2xl relative overflow-hidden bg-slate-100 group border border-slate-200 shadow-inner">
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-blue-600/90 backdrop-blur flex items-center justify-center text-white shadow-lg group-hover:bg-blue-600 group-hover:scale-110 active:scale-95 transition-all">
                                    <Play size={28} className="ml-1 fill-white" />
                                </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-slate-900 uppercase tracking-wider shadow-sm border border-slate-200/50">Video</div>
                        </div>
                    </Link>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-4 max-w-[425px] text-slate-500">

                    <button
                        className="flex items-center gap-2 group transition-colors hover:text-blue-500"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            requireLogin()
                        }}
                    >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <MessageCircle size={18} />
                        </div>
                        <span className="text-[13px] font-medium">{commentsCount > 0 ? commentsCount : ''}</span>
                    </button>

                    <button
                        className="flex items-center gap-2 group transition-colors hover:text-green-600"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            requireLogin()
                        }}
                    >
                        <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                            <Repeat2 size={18} />
                        </div>
                        <span className="text-[13px] font-medium"></span>
                    </button>

                    <button
                        className={`flex items-center gap-2 group transition-colors relative ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        onClick={handleLike}
                    >
                        <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-50' : 'group-hover:bg-pink-50'}`}>
                            <Heart size={18} className={liked ? 'fill-pink-600' : ''} />
                        </div>
                        <span className={`text-[13px] font-medium ${liked && 'text-pink-600 font-bold'}`}>{likes > 0 ? likes : ''}</span>
                        {/* Pop Animation */}
                        {isAnimating && (
                            <span className="absolute -top-6 left-2 text-pink-600 animate-float pointer-events-none">
                                <Heart size={24} className="fill-pink-600" />
                            </span>
                        )}
                    </button>

                    <button className="flex items-center gap-2 group transition-colors hover:text-purple-600" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-purple-50 transition-colors">
                            <BarChart2 size={18} />
                        </div>
                        <span className="text-[13px] font-medium">{(Math.random() * 10).toFixed(1)}K</span>
                    </button>

                    <button className="flex items-center gap-2 group transition-colors hover:text-blue-500" onClick={e => e.preventDefault()}>
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <Share size={18} />
                        </div>
                    </button>

                </div>
            </div>
        </article>
    )
}
