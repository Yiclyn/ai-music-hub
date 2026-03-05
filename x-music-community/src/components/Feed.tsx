'use client'

import { useState, useEffect } from 'react'
import { supabase, Post } from '@/lib/supabase'
import PostCard from './PostCard'
import ErrorBoundary from './ErrorBoundary'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPosts()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('posts_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('新帖子:', payload)
          // 添加新帖子到列表顶部
          setPosts(current => [payload.new as Post, ...current])
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('帖子更新:', payload)
          // 更新帖子
          setPosts(current => 
            current.map(post => 
              post.id === payload.new.id ? payload.new as Post : post
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchPosts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        setError('加载帖子失败')
        // Use mock data if Supabase fails
        setPosts(mockPosts)
      } else {
        setPosts(data || mockPosts)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('加载帖子失败')
      setPosts(mockPosts)
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchPosts(true)
  }

  if (loading) {
    return (
      <div className="flex-1 border-x border-slate-100 lg:border-x-0 lg:border-r">
        <div className="p-8 text-center text-secondary">
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 border-x border-slate-100 lg:border-x-0 lg:border-r mb-16 lg:mb-0">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">首页</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-primary hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-50"
            title="刷新"
          >
            <svg 
              className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}
      
      <div>
        {posts.map((post) => (
          <ErrorBoundary key={post.id}>
            <PostCard post={post} />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  )
}

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    content: '刚刚完成了一首新的电子音乐作品，融合了古典钢琴和现代合成器的声音。音乐真的是跨越时空的语言 🎵',
    user_id: 'mock-user-1',
    username: 'alexmusic',
    author_name: '电音制作人Alex',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes_count: 24,
    comments_count: 8,
    retweets_count: 3,
    media_type: 'audio',
    media_url: '/audio/sample.mp3',
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
  },
  {
    id: '2',
    content: '今天在录音室录制新专辑的花絮，和乐队成员们一起创作的过程总是充满惊喜！',
    user_id: 'mock-user-2',
    username: 'rainmusic',
    author_name: '独立音乐人小雨',
    author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes_count: 89,
    comments_count: 15,
    retweets_count: 12,
    media_type: 'video',
    media_url: '/video/studio.mp4',
    cover_image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop'
  },
  {
    id: '3',
    content: 'AI音乐创作工具真的改变了我的创作流程，现在可以更快地将脑海中的旋律变成现实。技术与艺术的结合太棒了！',
    user_id: 'mock-user-3',
    username: 'techmusic',
    author_name: '音乐科技爱好者',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes_count: 156,
    comments_count: 23,
    retweets_count: 18
  },
  {
    id: '4',
    content: '分享一张昨晚演出的照片，观众的热情让我感动。音乐连接着每一个人的心 ❤️',
    user_id: 'mock-user-4',
    username: 'livemusic',
    author_name: '现场音乐人',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes_count: 203,
    comments_count: 31,
    retweets_count: 25,
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop'
  }
]