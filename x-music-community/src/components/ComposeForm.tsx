'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music, Video, Image as ImageIcon, X, Upload } from 'lucide-react'
import Link from 'next/link'
import { supabase, initializeStorage, testUpload } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type MediaType = 'audio' | 'video' | 'image' | null

export default function ComposeForm() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  
  const audioInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // 检查登录状态
  useEffect(() => {
    if (!user) {
      alert('请先登录后再发布内容')
      router.push('/login')
    }
  }, [user, router])

  // 初始化存储
  useEffect(() => {
    const init = async () => {
      console.log('初始化存储配置...')
      const success = await initializeStorage()
      if (success) {
        console.log('存储初始化成功')
        const testSuccess = await testUpload()
        console.log('上传测试结果:', testSuccess ? '成功' : '失败')
      } else {
        console.log('存储初始化失败')
      }
    }
    init()
  }, [])

  const handleFileSelect = (file: File, type: MediaType) => {
    setMediaFile(file)
    setMediaType(type)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview)
    }
    setMediaFile(null)
    setMediaType(null)
    setMediaPreview(null)
  }

  const uploadMedia = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true)
      console.log('开始上传文件:', file.name, '大小:', file.size)
      
      // 检查文件大小 (限制为 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('文件大小不能超过 50MB')
        return null
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = fileName // 直接放在根目录，不使用 media/ 前缀

      console.log('上传路径:', filePath)

      // 尝试上传文件
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('上传错误详情:', uploadError)
        
        // 如果是存储桶不存在的错误，尝试创建存储桶
        if (uploadError.message.includes('Bucket not found')) {
          console.log('存储桶不存在，尝试创建...')
          const { error: bucketError } = await supabase.storage.createBucket('media', {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*', 'audio/*'],
            fileSizeLimit: 52428800 // 50MB
          })
          
          if (bucketError) {
            console.error('创建存储桶失败:', bucketError)
            alert('存储配置错误，请联系管理员')
            return null
          }
          
          // 重新尝试上传
          const { data: retryData, error: retryError } = await supabase.storage
            .from('media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })
            
          if (retryError) {
            console.error('重试上传失败:', retryError)
            alert(`上传失败: ${retryError.message}`)
            return null
          }
          
          console.log('重试上传成功:', retryData)
        } else {
          alert(`上传失败: ${uploadError.message}`)
          return null
        }
      } else {
        console.log('上传成功:', uploadData)
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      console.log('获取到的公共URL:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (error) {
      console.error('上传过程中发生错误:', error)
      alert('上传失败，请检查网络连接')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) return
    if (!user || !profile) {
      alert('请先登录')
      router.push('/login')
      return
    }

    setIsPosting(true)
    try {
      console.log('开始发布帖子...')
      console.log('内容:', content.trim())
      console.log('媒体文件:', mediaFile?.name)
      console.log('媒体类型:', mediaType)
      
      let mediaUrl = null
      
      // Upload media if exists
      if (mediaFile) {
        console.log('开始上传媒体文件...')
        mediaUrl = await uploadMedia(mediaFile)
        if (!mediaUrl) {
          console.error('媒体文件上传失败')
          alert('媒体文件上传失败，请重试')
          return
        }
        console.log('媒体文件上传成功:', mediaUrl)
      }

      // Create post data
      const postData = {
        content: content.trim(),
        user_id: user.id,
        username: profile.username,
        author_name: profile.nickname,
        author_avatar: profile.avatar_url,
        likes_count: 0,
        media_url: mediaUrl,
        media_type: mediaType,
        cover_image: mediaType === 'video' ? mediaUrl : null
      }
      
      console.log('准备插入的帖子数据:', postData)

      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()

      if (error) {
        console.error('数据库插入错误详情:', error)
        console.error('错误代码:', error.code)
        console.error('错误消息:', error.message)
        console.error('错误详情:', error.details)
        
        if (error.message.includes('relation "public.posts" does not exist')) {
          alert('数据库表不存在，请先创建 posts 表。访问 /debug 页面获取帮助。')
        } else if (error.message.includes('permission denied')) {
          alert('权限不足，请检查数据库策略配置。')
        } else {
          alert(`发布失败: ${error.message}`)
        }
        return
      }

      console.log('帖子创建成功:', data)
      
      // Success - redirect to home
      router.push('/')
    } catch (error) {
      console.error('发布过程中发生未知错误:', error)
      alert('发布失败，请重试')
    } finally {
      setIsPosting(false)
    }
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="flex-1 border-x border-slate-100 lg:border-x-0 lg:border-r mb-16 lg:mb-0">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-primary">发布新内容</h1>
        </div>
      </div>

      {/* Compose Form */}
      <div className="p-4">
        <div className="flex space-x-3">
          <img 
            src={profile.avatar_url}
            alt={profile.nickname}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的音乐想法..."
              className="w-full text-xl placeholder-text-secondary resize-none border-none outline-none min-h-[120px]"
              rows={5}
            />

            {/* Media Preview */}
            {mediaPreview && (
              <div className="mt-4 relative">
                <button
                  onClick={removeMedia}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>

                {mediaType === 'image' && (
                  <img 
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full max-h-96 object-cover rounded-2xl"
                  />
                )}

                {mediaType === 'video' && (
                  <video 
                    src={mediaPreview}
                    controls
                    className="w-full max-h-96 rounded-2xl"
                  />
                )}

                {mediaType === 'audio' && (
                  <div className="bg-slate-100 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Music size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-primary">{mediaFile?.name}</div>
                        <div className="text-sm text-secondary">音频文件</div>
                      </div>
                    </div>
                    <audio 
                      src={mediaPreview}
                      controls
                      className="w-full mt-4"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Media Upload Buttons */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-4">
                <button 
                  onClick={() => audioInputRef.current?.click()}
                  disabled={isUploading || isPosting}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <Music size={20} className="text-primary" />
                </button>
                <button 
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading || isPosting}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <Video size={20} className="text-primary" />
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading || isPosting}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <ImageIcon size={20} className="text-primary" />
                </button>
              </div>

              <button
                onClick={handlePost}
                disabled={(!content.trim() && !mediaFile) || isUploading || isPosting}
                className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isUploading && <Upload size={16} className="animate-spin" />}
                <span>
                  {isUploading ? '上传中...' : isPosting ? '发布中...' : '发布'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file, 'audio')
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file, 'video')
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file, 'image')
        }}
      />
    </div>
  )
}