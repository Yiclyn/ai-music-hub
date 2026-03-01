'use client'

import { useState, useEffect } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface FollowButtonProps {
  userId: string
  size?: 'sm' | 'md'
}

export default function FollowButton({ userId, size = 'sm' }: FollowButtonProps) {
  const { user, followUser, unfollowUser, isFollowing } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base'
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && userId !== user.id) {
        const status = await isFollowing(userId)
        setFollowing(status)
      }
    }
    checkFollowStatus()
  }, [user, userId, isFollowing])

  const handleFollow = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (userId === user.id) {
      return // 不能关注自己
    }

    setLoading(true)
    try {
      if (following) {
        const { error } = await unfollowUser(userId)
        if (!error) {
          setFollowing(false)
        } else {
          alert('取消关注失败')
        }
      } else {
        const { error } = await followUser(userId)
        if (!error) {
          setFollowing(true)
        } else {
          alert('关注失败')
        }
      }
    } catch {
      alert('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 不显示关注自己的按钮
  if (!user || userId === user.id) {
    return null
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${following 
          ? 'bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-600' 
          : 'bg-primary text-white hover:bg-primary/90'
        }
        rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center space-x-1
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : following ? (
        <>
          <UserMinus size={14} />
          <span>已关注</span>
        </>
      ) : (
        <>
          <UserPlus size={14} />
          <span>关注</span>
        </>
      )}
    </button>
  )
}