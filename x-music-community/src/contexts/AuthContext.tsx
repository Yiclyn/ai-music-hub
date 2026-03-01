'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  username: string
  nickname: string
  avatar_url: string
  bio?: string
  posts_count: number
  following_count: number
  followers_count: number
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, username: string, nickname: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  uploadAvatar: (file: File) => Promise<{ error: Error | null }>
  followUser: (userId: string) => Promise<{ error: Error | null }>
  unfollowUser: (userId: string) => Promise<{ error: Error | null }>
  isFollowing: (userId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, username: string, nickname: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          nickname,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error('Not authenticated') }

    try {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        return { error: new Error('请选择图片文件') }
      }

      // 检查文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { error: new Error('图片大小不能超过 5MB') }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // 上传到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        return { error: uploadError }
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      // 更新用户资料
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        return { error: updateError }
      }

      // 更新本地状态
      setProfile(prev => prev ? { ...prev, avatar_url: urlData.publicUrl } : null)

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const followUser = async (userId: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('follows')
      .insert([{ follower_id: user.id, following_id: userId }])

    if (!error) {
      // 刷新用户资料以更新统计
      await fetchProfile(user.id)
    }

    return { error }
  }

  const unfollowUser = async (userId: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId)

    if (!error) {
      // 刷新用户资料以更新统计
      await fetchProfile(user.id)
    }

    return { error }
  }

  const isFollowing = async (userId: string): Promise<boolean> => {
    if (!user) return false

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .single()

    return !error && !!data
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      uploadAvatar,
      followUser,
      unfollowUser,
      isFollowing,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}