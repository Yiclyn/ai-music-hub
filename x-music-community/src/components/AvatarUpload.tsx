'use client'

import { useRef, useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AvatarUploadProps {
  currentAvatar: string
  size?: 'sm' | 'md' | 'lg'
  editable?: boolean
}

export default function AvatarUpload({ 
  currentAvatar, 
  size = 'md', 
  editable = false 
}: AvatarUploadProps) {
  const { uploadAvatar } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }

  const handleAvatarClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { error } = await uploadAvatar(file)
      if (error) {
        alert(`上传失败: ${error.message}`)
      } else {
        alert('头像更新成功！')
      }
    } catch {
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${
          editable ? 'cursor-pointer group' : ''
        }`}
        onClick={handleAvatarClick}
      >
        <img 
          src={currentAvatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        
        {editable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Upload size={size === 'lg' ? 24 : 16} className="text-white animate-spin" />
            ) : (
              <Camera size={size === 'lg' ? 24 : 16} className="text-white" />
            )}
          </div>
        )}
      </div>

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      )}
    </div>
  )
}