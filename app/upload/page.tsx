'use client'

import { useState, useCallback } from 'react'
import { Upload as UploadIcon, AlertCircle, FileAudio, FileVideo } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState('')

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type.includes('audio') || droppedFile.type.includes('video'))) {
            setFile(droppedFile)
            if (!title) setTitle(droppedFile.name.split('.')[0])
        } else {
            setMessage('不支持的文件类型。请上传音频或视频。')
        }
    }, [title])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            if (!title) setTitle(selectedFile.name.split('.')[0])
        }
    }

    const generateMockThumbnail = () => {
        // In a real scenario for video, you would use a canvas to capture a frame.
        // For audio, fallback to a default logic or allow user to upload cover.
        return `https://picsum.photos/seed/${Math.random()}/400/400`
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !title) return

        setIsUploading(true)
        setMessage('')

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `user_uploads/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)

            const mediaType = file.type.includes('video') ? 'video' : 'audio'
            const coverUrl = mediaType === 'video' ? generateMockThumbnail() : null

            // Insert record to Supabase
            const { error: dbError } = await supabase.from('posts').insert({
                title,
                description,
                media_url: publicUrl,
                media_type: mediaType,
                cover_url: coverUrl,
                author_id: 'guest_user' // placeholder
            })

            if (dbError) throw dbError

            setMessage('上传成功！')
            setFile(null)
            setTitle('')
            setDescription('')

        } catch (error: any) {
            console.error(error)
            setMessage(`上传失败: ${error.message}`)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-aurora-green">发布新作品</h1>

            <form onSubmit={handleUpload} className="space-y-8">

                {/* Drag and drop zone */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed ${file ? 'border-aurora-green bg-aurora-green/5' : 'border-white/20 hover:border-electric-purple/50 bg-card'} rounded-2xl p-12 text-center transition-all cursor-pointer`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="audio/*,video/*"
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {file.type.includes('video') ? <FileVideo size={48} className="text-aurora-green" /> : <FileAudio size={48} className="text-electric-purple" />}
                            <p className="text-lg font-medium text-white">{file.name}</p>
                            <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <UploadIcon size={48} className="text-gray-400 mb-2" />
                            <p className="text-lg font-medium text-white">点击或拖拽文件到此处</p>
                            <p className="text-sm text-gray-400">支持 MP3, WAV, MP4</p>
                        </div>
                    )}
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">作品标题</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-purple transition-colors"
                            placeholder="为你的 AI 大作起个名字..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">作品描述 (可选)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white h-32 resize-none focus:outline-none focus:border-electric-purple transition-colors"
                            placeholder="分享一下你的创作灵感..."
                        />
                    </div>
                </div>

                {message && (
                    <div className="flex items-center gap-2 text-sm text-white bg-white/10 p-4 rounded-lg">
                        <AlertCircle size={18} className={message.includes('成功') ? 'text-aurora-green' : 'text-red-500'} />
                        {message}
                    </div>
                )}

                <button
                    disabled={!file || isUploading}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-electric-purple to-aurora-green text-white font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity disabled:grayscale"
                >
                    {isUploading ? '正在上传与处理...' : '确认发布'}
                </button>
            </form>
        </div>
    )
}
