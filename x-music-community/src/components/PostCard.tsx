'use client'

import { Heart, MessageCircle, Repeat2, Share, Play } from 'lucide-react'
import { Post } from '@/lib/supabase'
import { useState } from 'react'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '刚刚'
    if (diffInHours < 24) return `${diffInHours}小时前`
    return `${Math.floor(diffInHours / 24)}天前`
  }

  return (
    <div className="border-b border-slate-100 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <img 
          src={post.author_avatar}
          alt={post.author_name}
          className="w-10 h-10 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-primary">{post.author_name}</span>
            <span className="text-secondary">·</span>
            <span className="text-secondary text-sm">{formatDate(post.created_at)}</span>
          </div>
          
          <div className="mt-2 text-primary">
            {post.content}
          </div>
          
          {/* Media Content */}
          {post.media_url && (
            <div className="mt-3">
              {post.media_type === 'audio' && (
                <div className="bg-slate-100 rounded-2xl p-4 relative group">
                  <div className="flex items-center space-x-3">
                    {post.cover_image && (
                      <img 
                        src={post.cover_image}
                        alt="Audio cover"
                        className="w-12 h-12 rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                          <Play size={14} />
                        </button>
                        <div className="flex-1 h-1 bg-slate-300 rounded-full">
                          <div className="w-1/3 h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-sm text-secondary mt-1">0:45 / 2:30</div>
                    </div>
                  </div>
                </div>
              )}
              
              {post.media_type === 'video' && (
                <div className="relative rounded-2xl overflow-hidden group">
                  <video 
                    src={post.media_url}
                    className="w-full aspect-video object-cover"
                    poster={post.cover_image}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Play size={24} className="text-black ml-1" />
                    </button>
                  </div>
                </div>
              )}
              
              {post.media_type === 'image' && (
                <img 
                  src={post.media_url}
                  alt="Post image"
                  className="w-full rounded-2xl"
                />
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center space-x-2 text-secondary hover:text-blue-500 transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">12</span>
            </button>
            
            <button className="flex items-center space-x-2 text-secondary hover:text-green-500 transition-colors">
              <Repeat2 size={18} />
              <span className="text-sm">5</span>
            </button>
            
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-secondary hover:text-red-500'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}