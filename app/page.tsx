import { Upload, Play, Disc } from 'lucide-react';

import { supabase } from '@/lib/supabase'
import MediaCard from '@/components/MediaCard'

export const revalidate = 0 // Disable cache for immediate development feedback

export default async function Home() {
    // Fetch posts from Supabase
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*, comments(count), likes(count)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
    }

    // Fallback mock data if DB is empty or fails
    const displayPosts = posts?.length ? posts : [
        {
            id: 'mock-1',
            title: 'Neon Dreams',
            author_id: 'AI Composer',
            media_type: 'audio',
            cover_url: null,
            comments: [{ count: 12 }],
            likes: [{ count: 340 }]
        },
        {
            id: 'mock-2',
            title: 'Cyberpunk City Flow',
            author_id: 'VisualBot',
            media_type: 'video',
            cover_url: null,
            comments: [{ count: 5 }],
            likes: [{ count: 128 }]
        },
        {
            id: 'mock-3',
            title: 'Aurora Lullaby',
            author_id: 'SynthMaster',
            media_type: 'audio',
            cover_url: null,
            comments: [{ count: 42 }],
            likes: [{ count: 892 }]
        },
        {
            id: 'mock-4',
            title: 'Digital Horizon',
            author_id: 'Visionary AI',
            media_type: 'video',
            cover_url: null,
            comments: [{ count: 8 }],
            likes: [{ count: 415 }]
        }
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-electric-purple to-aurora-green">
                    探索 AI 创作的无限可能
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                    欢迎来到 AI Music Hub，这里汇聚了最前沿的 AI 音乐与视频生成作品。
                </p>
            </div>

            {/* CSS Grid for Masonry-like structural layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayPosts.map((post: any) => (
                    <MediaCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        author={post.author_id}
                        mediaType={post.media_type}
                        coverUrl={post.cover_url}
                        likesCount={post.likes?.[0]?.count || 0}
                        commentsCount={post.comments?.[0]?.count || 0}
                    />
                ))}
            </div>
        </div>
    )
}


