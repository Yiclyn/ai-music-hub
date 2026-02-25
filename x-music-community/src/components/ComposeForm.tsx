'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music, Video, Image as ImageIcon, X, Upload } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type MediaType = 'audio' | 'video' | 'image' | null

export default function ComposeForm() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  
  const audioInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `media/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) return

    setIsPosting(true)
    try {
      let mediaUrl = null
      
      // Upload media if exists
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile)
        if (!mediaUrl) {
          alert('媒体文件上传失败，请重试')
          return
        }
      }

      // Create post
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            content: content.trim(),
            author_name: '音乐爱好者',
            author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            likes_count: 0,
            media_url: mediaUrl,
            media_type: mediaType,
            cover_image: mediaType === 'video' ? mediaUrl : null
          }
        ])

      if (error) {
        console.error('Error creating post:', error)
        alert('发布失败，请重试')
        return
      }

      // Success - redirect to home
      router.push('/')
    } catch (error) {
      console.error('Error posting:', error)
      alert('发布失败，请重试')
    } finally {
      setIsPosting(false)
    }
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
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
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