'use client'

import { useState } from 'react'
import { Music, Video, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PostComposer() {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) return
    
    setIsPosting(true)
    try {
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            content: content.trim(),
            author_name: '音乐爱好者',
            author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            likes_count: 0
          }
        ])
      
      if (!error) {
        setContent('')
      }
    } catch (err) {
      console.error('Error posting:', err)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="border-b border-slate-100 p-4">
      <div className="flex space-x-3">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          alt="Your avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的音乐想法..."
            className="w-full text-xl placeholder-text-secondary resize-none border-none outline-none"
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Music size={20} className="text-primary" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Video size={20} className="text-primary" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ImageIcon size={20} className="text-primary" />
              </button>
            </div>
            
            <button
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPosting ? '发布中...' : '发布'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}