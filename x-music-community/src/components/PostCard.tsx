'use client'

import { Heart, MessageCircle, Repeat2, Share, Play, Pause, Volume2 } from 'lucide-react'
import { Post } from '@/lib/supabase'
import { useState, useRef, useEffect } from 'react'
import { useAudio } from '@/contexts/AudioContext'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const { currentlyPlaying, setCurrentlyPlaying } = useAudio()
  
  // 音频播放状态
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isPlaying = currentlyPlaying === post.id

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 音频播放控制
  const toggleAudioPlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setCurrentlyPlaying(null)
    } else {
      audioRef.current.play()
      setCurrentlyPlaying(post.id)
    }
  }

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleAudioLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleAudioEnded = () => {
    setCurrentlyPlaying(null)
    setCurrentTime(0)
  }

  const handleAudioPause = () => {
    if (currentlyPlaying === post.id) {
      setCurrentlyPlaying(null)
    }
  }

  const handleAudioPlay = () => {
    setCurrentlyPlaying(post.id)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // 视频播放控制
  const toggleVideoPlay = () => {
    if (!videoRef.current) return
    
    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', handleAudioTimeUpdate)
      audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata)
      audio.addEventListener('ended', handleAudioEnded)
      audio.addEventListener('pause', handleAudioPause)
      audio.addEventListener('play', handleAudioPlay)
      
      return () => {
        audio.removeEventListener('timeupdate', handleAudioTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata)
        audio.removeEventListener('ended', handleAudioEnded)
        audio.removeEventListener('pause', handleAudioPause)
        audio.removeEventListener('play', handleAudioPlay)
      }
    }
  }, [])

  // 当其他音频开始播放时，暂停当前音频
  useEffect(() => {
    if (currentlyPlaying !== post.id && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [currentlyPlaying, post.id])

  return (
    <div className="border-b border-slate-100 p-4 hover:bg-slate-50/50 transition-colors">
      <div className="flex space-x-3">
        <img 
          src={post.author_avatar}
          alt={post.author_name}
          className="w-10 h-10 rounded-full object-cover"
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
                <div className="bg-slate-100 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {post.cover_image && (
                      <img 
                        src={post.cover_image}
                        alt="Audio cover"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">音频文件</div>
                      <div className="text-xs text-secondary">
                        {duration > 0 && `时长: ${formatTime(duration)}`}
                      </div>
                    </div>
                  </div>
                  
                  {/* 音频控制器 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={toggleAudioPlay}
                        className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      
                      {/* 进度条 */}
                      <div className="flex-1">
                        <div 
                          className="h-2 bg-slate-300 rounded-full cursor-pointer"
                          onClick={handleProgressClick}
                        >
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-secondary mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      {/* 音量控制 */}
                      <div className="flex items-center space-x-2">
                        <Volume2 size={16} className="text-secondary" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 bg-slate-300 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 隐藏的音频元素 */}
                  <audio
                    ref={audioRef}
                    src={post.media_url}
                    preload="metadata"
                  />
                </div>
              )}
              
              {post.media_type === 'video' && (
                <div className="relative rounded-2xl overflow-hidden">
                  <video 
                    ref={videoRef}
                    src={post.media_url}
                    className="w-full aspect-video object-cover"
                    poster={post.cover_image}
                    controls
                    preload="metadata"
                    onClick={toggleVideoPlay}
                  />
                </div>
              )}
              
              {post.media_type === 'image' && (
                <img 
                  src={post.media_url}
                  alt="Post image"
                  className="w-full rounded-2xl object-cover"
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