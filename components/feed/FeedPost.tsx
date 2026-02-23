'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Repeat2, Heart, Share, Play, BarChart2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'

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
        setLikes((prev: number) => liked ? prev - 1 : prev + 1)

        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 800)
    }

    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : '刚刚'
    const defaultCover = "linear-gradient(135deg, #EFF3F4 0%, #E1E8ED 100%)"

    return (
        <article className="flex gap-3 px-4 py-3 bg-[#FFFFFF] border-b border-[#EFF3F4] hover:bg-[#F7F9F9] transition cursor-pointer">
            {/* Left Avatar Column */}
            <div className="shrink-0 flex flex-col items-center pt-1">
                <Link href={`/profile/${author}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[16px] hover:opacity-80 transition">
                        {author.substring(0, 1).toUpperCase()}
                    </div>
                </Link>
            </div>

            {/* Right Content Column */}
            <div className="flex-1 min-w-0 pb-1">

                {/* Header (Author & Date) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0">
                        <Link href={`/profile/${author}`} className="font-bold text-[#0F1419] hover:underline transition truncate text-[15px]" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            {author}
                        </Link>
                        <span className="text-[#536471] text-[15px] truncate max-w-[120px]">@{author.toLowerCase().replace(/\s/g, '')}</span>
                        <span className="text-[#536471] text-[15px]">·</span>
                        <span className="text-[#536471] text-[15px] hover:underline">{formattedDate}</span>
                    </div>
                    <button className="text-[#536471] hover:text-[#1D9BF0] transition px-2 rounded-full hover:bg-blue-50" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        ···
                    </button>
                </div>

                {/* Text Content */}
                <div className="mt-1 mb-3">
                    <p className="text-[15px] text-[#0F1419] whitespace-pre-wrap leading-snug">
                        {title}
                        {description && <><br /><span className="text-[#0F1419] mt-0.5 block">{description}</span></>}
                    </p>
                </div>

                {/* Media Player Area */}
                {mediaType === 'audio' ? (
                    <div
                        className="w-full h-32 rounded-2xl relative flex flex-col justify-end p-4 group border border-[#EFF3F4] bg-[#F7F9F9]"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                        }}
                    >
                        <div className="relative z-10 flex items-center mt-auto w-full">
                            <button className="w-10 h-10 rounded-full bg-[#1D9BF0] text-white flex items-center justify-center hover:bg-[#1A8CD8] active:scale-95 transition shrink-0">
                                <Play size={18} className="ml-0.5 fill-white" />
                            </button>
                            {/* Mock waveform */}
                            <div className="flex-1 flex items-center h-8 ml-3 gap-0.5 opacity-80">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="flex-1 bg-[#1D9BF0] rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-white/80 px-2 py-0.5 rounded text-[11px] font-bold text-[#536471] uppercase tracking-wide">Audio</div>
                    </div>
                ) : (
                    <Link href={`/video/${id}`} onClick={e => e.stopPropagation()} className="block">
                        <div className="w-full aspect-video rounded-2xl relative overflow-hidden bg-[#EFF3F4] group border border-[#EFF3F4]">
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: defaultCover }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white shadow-md group-hover:bg-[#1A8CD8] active:scale-95 transition-all">
                                    <Play size={24} className="ml-1 fill-white" />
                                </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-white/80 px-2 py-0.5 rounded text-[11px] font-bold text-[#536471] uppercase tracking-wide">Video</div>
                        </div>
                    </Link>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between mt-3 max-w-[425px] text-[#536471]">

                    <button
                        className="flex items-center gap-1 group transition-colors hover:text-[#1D9BF0]"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            requireLogin()
                        }}
                    >
                        <div className="p-2 -ml-2 rounded-full group-hover:bg-[#E1EEF6] transition-colors">
                            <MessageCircle size={18.5} strokeWidth={1.8} />
                        </div>
                        <span className="text-[13px]">{commentsCount > 0 ? commentsCount : ''}</span>
                    </button>

                    <button
                        className="flex items-center gap-1 group transition-colors hover:text-[#00BA7C]"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            requireLogin()
                        }}
                    >
                        <div className="p-2 -ml-2 rounded-full group-hover:bg-[#DEF1E8] transition-colors">
                            <Repeat2 size={18.5} strokeWidth={1.8} />
                        </div>
                        <span className="text-[13px]"></span>
                    </button>

                    <button
                        className={`flex items-center gap-1 group transition-colors relative ${liked ? 'text-[#F91880]' : 'hover:text-[#F91880]'}`}
                        onClick={handleLike}
                    >
                        <div className={`p-2 -ml-2 rounded-full transition-colors ${liked ? '' : 'group-hover:bg-[#F7E0EB]'}`}>
                            <Heart size={18.5} strokeWidth={1.8} className={liked ? 'fill-[#F91880] text-[#F91880]' : ''} />
                        </div>
                        <span className={`text-[13px] ${liked && 'text-[#F91880]'}`}>{likes > 0 ? likes : ''}</span>
                        {/* Pop Animation */}
                        {isAnimating && (
                            <span className="absolute -top-6 left-1 text-[#F91880] animate-bounce pointer-events-none">
                                <Heart size={24} className="fill-[#F91880]" />
                            </span>
                        )}
                    </button>

                    <button className="flex items-center gap-2 group/btn" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover/btn:bg-blue-50 transition text-[#536471] group-hover/btn:text-[#1D9BF0]">
                            <MessageCircle size={18} className="stroke-[2px]" />
                        </div>
                        <span className="text-[13px] text-[#536471] group-hover/btn:text-[#1D9BF0]">{commentsCount > 0 ? commentsCount : ''}</span>
                    </button>

                    <button className="flex items-center gap-2 group/btn" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover/btn:bg-green-50 transition text-[#536471] group-hover/btn:text-[#00BA7C]">
                            <Repeat2 size={18} className="stroke-[2px]" />
                        </div>
                        <span className="text-[13px] text-[#536471] group-hover/btn:text-[#00BA7C]"></span>
                    </button>

                    <button className="flex items-center gap-1 group transition-colors hover:text-[#1D9BF0]" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                        <div className="p-2 -ml-2 rounded-full group-hover:bg-[#E1EEF6] transition-colors">
                            <BarChart2 size={18.5} strokeWidth={1.8} />
                        </div>
                        <span className="text-[13px]">{(Math.random() * 10).toFixed(1)}K</span>
                    </button>

                    <div className="flex items-center gap-0">
                        <button className="flex items-center group transition-colors hover:text-[#1D9BF0]" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                            <div className="p-2 rounded-full group-hover:bg-[#E1EEF6] transition-colors">
                                <Share size={18.5} strokeWidth={1.8} />
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </article>
    )
}
