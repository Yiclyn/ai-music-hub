'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send } from 'lucide-react'

interface Comment {
    id: string
    content: string
    author_id: string
    created_at: string
}

export default function CommentsSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch initial comments
    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true })

            if (data) setComments(data)
        }

        fetchComments()

        // Subscribe to realtime changes
        const channel = supabase
            .channel(`comments_for_${postId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
                (payload: any) => {
                    setComments((prev: Comment[]) => [...prev, payload.new as Comment])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [postId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)

        // Optimistically add the comment visually (optional but good for UX)
        const tempComment = {
            id: crypto.randomUUID(),
            content: newComment,
            author_id: 'guest_user',
            created_at: new Date().toISOString()
        }

        try {
            const { error } = await supabase.from('comments').insert({
                post_id: postId,
                content: newComment,
                author_id: 'guest_user', // Hardcoded for demo since Auth wasn't specified
            })

            if (error) throw error
            setNewComment('')
        } catch (error) {
            console.error('Failed to post comment', error)
            alert("发布评论失败")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/10 shrink-0">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    评论区 <span className="text-gray-400 text-sm font-normal">({comments.length})</span>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                        还没有人评论，快来抢沙发吧！
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-purple to-aurora-green flex items-center justify-center text-[10px] uppercase font-bold text-white">
                                    {comment.author_id.substring(0, 2)}
                                </div>
                                <span className="font-medium text-sm text-gray-300">{comment.author_id}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-200 text-sm pl-8">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-white/10 shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                        placeholder="写下你的想法..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-electric-purple transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute right-2 top-1 bottom-1 w-8 flex items-center justify-center text-aurora-green hover:text-white transition disabled:opacity-50"
                    >
                        <Send size={16} className={isSubmitting ? "animate-pulse" : ""} />
                    </button>
                </form>
            </div>
        </div>
    )
}
