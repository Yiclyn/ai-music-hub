import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Heart, MessageCircle, Share2, Expand } from 'lucide-react'
import CommentsSection from '@/components/CommentsSection'

export const revalidate = 0

// Force dynamic page rendering for Next.js App Router (since no build-time params are defined)
export const dynamic = 'force-dynamic'

export default async function VideoPage({ params }: { params: { id: string } }) {
    const { data: post, error } = await supabase
        .from('posts')
        .select('*, likes(count), comments(count)')
        .eq('id', params.id)
        .single()

    if (error || !post) {
        if (error) console.error(error)
        notFound()
    }

    // Fallback to video type verification
    if (post.media_type !== 'video') {
        return (
            <div className="flex h-[50vh] items-center justify-center p-4 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">这是一首音频作品</h2>
                    <p className="text-gray-400">目前已在底部全局播放器加载，请点击播放。</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
            {/* Main Video Section */}
            <div className="lg:w-2/3 space-y-4">
                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                    <video
                        src={post.media_url}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        poster={post.cover_url || undefined}
                    />
                </div>

                <div className="bg-card rounded-2xl p-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-electric-purple font-medium">@{post.author_id}</span>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 transition">
                                <Heart size={20} /> <span className="font-semibold">{post.likes?.[0]?.count || 0}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition">
                                <Share2 size={20} /> <span className="hidden md:inline">分享</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                        {post.description || '作者尚未添加任何描述...'}
                    </div>
                </div>
            </div>

            {/* Comments Sidebar Section */}
            <div className="lg:w-1/3 bg-card rounded-2xl flex flex-col h-[600px] lg:h-auto overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <CommentsSection postId={post.id} />
                </div>
            </div>
        </div>
    )
}
