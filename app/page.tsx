import { supabase } from '@/lib/supabase'
import FeedPost from '@/components/feed/FeedPost'

export const revalidate = 0

export default async function Home() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*, comments(count), likes(count)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
    }

    const displayPosts = posts?.length ? posts : [
        {
            id: 'mock-1',
            title: 'Neon Dreams: A Synthwave Journey',
            description: 'just generated this awesome track representing Tokyo at night. #synthwave #ai #music',
            author_id: 'AI Composer',
            media_type: 'audio',
            cover_url: null,
            comments: [{ count: 12 }],
            likes: [{ count: 340 }],
            created_at: new Date().toISOString()
        },
        {
            id: 'mock-2',
            title: 'Digital Horizon Visualized',
            description: 'Check out this music video I made using the new model!',
            author_id: 'VisualBot',
            media_type: 'video',
            cover_url: null,
            comments: [{ count: 5 }],
            likes: [{ count: 128 }],
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ]

    return (
        <div className="w-full flex flex-col pb-20 sm:pb-0 bg-[#FFFFFF]">
            {/* Desktop / Mobile Common Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EFF3F4] flex items-center justify-between px-4 h-[53px] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <h1 className="text-[20px] font-bold text-[#0F1419]">主页</h1>
            </div>

            {/* Post Feed */}
            <div className="flex flex-col">
                {displayPosts.map((post: any) => (
                    <FeedPost
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        description={post.description || ''}
                        author={post.author_id}
                        mediaType={post.media_type}
                        coverUrl={post.cover_url}
                        likesCount={post.likes?.[0]?.count || 0}
                        commentsCount={post.comments?.[0]?.count || 0}
                        createdAt={post.created_at}
                    />
                ))}
            </div>
        </div>
    )
}

