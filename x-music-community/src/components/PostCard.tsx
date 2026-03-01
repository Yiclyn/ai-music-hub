'use client'

import { Heart, MessageCircle, Repeat2, Share, Play, Pause, Volume2, Send, X } from 'lucide-react'
import { Post, Comment, supabase } from '@/lib/supabase'
import { useState, useRef, useEffect } from 'react'
import { useAudio } from '@/contexts/AudioContext'
import { useAuth } from '@/contexts/AuthContext'
import AvatarUpload from './AvatarUpload'
import FollowButton from './FollowButton'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [commentsCount, setCommentsCount] = useState(post.comments_count)
  const [retweetsCount, setRetweetsCount] = useState(post.retweets_count)
  const [isRetweeted, setIsRetweeted] = useState(false)
  
  // 评论相关状态
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  
  // 转发相关状态
  const [showRetweetDialog, setShowRetweetDialog] = useState(false)
  const [retweetComment, setRetweetComment] = useState('')
  
  const { currentlyPlaying, setCurrentlyPlaying } = useAudio()
  
  // 音频播放状态
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isPlaying = currentlyPlaying === post.id

  // 检查用户是否已点赞
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return
      
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single()
      
      setIsLiked(!!data)
    }

    const checkIfRetweeted = async () => {
      if (!user) return
      
      const { data } = await supabase
        .from('retweets')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single()
      
      setIsRetweeted(!!data)
    }

    checkIfLiked()
    checkIfRetweeted()
  }, [user, post.id])

  const handleLike = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    try {
      if (isLiked) {
        // 取消点赞
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)
        
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      } else {
        // 点赞
        await supabase
          .from('post_likes')
          .insert({ post_id: post.id, user_id: user.id })
        
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
    }
  }

  const loadComments = async () => {
    setLoadingComments(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(username, full_name, avatar_url)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('加载评论失败:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleCommentClick = () => {
    setShowComments(!showComments)
    if (!showComments) {
      loadComments()
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        })
      
      if (error) throw error
      
      setNewComment('')
      setCommentsCount(prev => prev + 1)
      loadComments()
    } catch (error) {
      console.error('发表评论失败:', error)
      alert('发表评论失败')
    }
  }

  const handleRetweet = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (isRetweeted) {
      // 取消转发
      try {
        await supabase
          .from('retweets')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)
        
        setIsRetweeted(false)
        setRetweetsCount(prev => prev - 1)
      } catch (error) {
        console.error('取消转发失败:', error)
      }
    } else {
      // 显示转发对话框
      setShowRetweetDialog(true)
    }
  }

  const handleConfirmRetweet = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('retweets')
        .insert({
          post_id: post.id,
          user_id: user.id,
          comment: retweetComment.trim() || null
        })
      
      if (error) throw error
      
      setIsRetweeted(true)
      setRetweetsCount(prev => prev + 1)
      setShowRetweetDialog(false)
      setRetweetComment('')
    } catch (error) {
      console.error('转发失败:', error)
      alert('转发失败')
    }
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
    if (!audio) return

    const handleAudioTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleAudioLoadedMetadata = () => {
      setDuration(audio.duration)
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
  }, [currentlyPlaying, post.id, setCurrentlyPlaying])

  // 当其他音频开始播放时，暂停当前音频
  useEffect(() => {
    if (currentlyPlaying !== post.id && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [currentlyPlaying, post.id])

  return (
    <div className="border-b border-slate-100 p-4 hover:bg-slate-50/50 transition-colors">
      <div className="flex space-x-3">
        <AvatarUpload 
          currentAvatar={post.author_avatar}
          size="md"
          editable={false}
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-primary">{post.author_name}</span>
              <span className="text-secondary">·</span>
              <span className="text-secondary text-sm">{formatDate(post.created_at)}</span>
            </div>
            {user && user.id !== post.user_id && (
              <FollowButton userId={post.user_id} size="sm" />
            )}
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
            <button 
              onClick={handleCommentClick}
              className="flex items-center space-x-2 text-secondary hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{commentsCount}</span>
            </button>
            
            <button 
              onClick={handleRetweet}
              className={`flex items-center space-x-2 transition-colors ${
                isRetweeted ? 'text-green-500' : 'text-secondary hover:text-green-500'
              }`}
            >
              <Repeat2 size={18} />
              <span className="text-sm">{retweetsCount}</span>
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

          {/* 评论区 */}
          {showComments && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              {/* 评论输入框 */}
              {user && (
                <form onSubmit={handleSubmitComment} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="发表评论..."
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* 评论列表 */}
              <div className="space-y-3">
                {loadingComments ? (
                  <div className="text-center text-secondary py-4">加载中...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-secondary py-4">暂无评论</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <AvatarUpload
                        currentAvatar={comment.user?.avatar_url || ''}
                        size="sm"
                        editable={false}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{comment.user?.full_name}</span>
                          <span className="text-xs text-secondary">{formatDate(comment.created_at)}</span>
                        </div>
                        <div className="text-sm text-primary mt-1">{comment.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 转发对话框 */}
      {showRetweetDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">转发帖子</h3>
              <button
                onClick={() => setShowRetweetDialog(false)}
                className="text-secondary hover:text-primary"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={retweetComment}
              onChange={(e) => setRetweetComment(e.target.value)}
              placeholder="添加评论（可选）..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowRetweetDialog(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRetweet}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
              >
                转发
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
