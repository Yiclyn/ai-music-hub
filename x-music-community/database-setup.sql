-- MusicX 数据库设置脚本
-- 请在 Supabase SQL Editor 中执行此脚本

-- 1. 创建 posts 表
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  media_url TEXT,
  media_type VARCHAR(50) CHECK (media_type IN ('audio', 'video', 'image')),
  cover_image TEXT
);

-- 2. 启用行级安全 (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. 创建策略：允许所有人查看帖子
CREATE POLICY "Allow public read posts" ON public.posts
FOR SELECT TO public
USING (true);

-- 4. 创建策略：允许所有人创建帖子
CREATE POLICY "Allow public insert posts" ON public.posts
FOR INSERT TO public
WITH CHECK (true);

-- 5. 创建策略：允许所有人更新帖子（用于点赞等）
CREATE POLICY "Allow public update posts" ON public.posts
FOR UPDATE TO public
USING (true)
WITH CHECK (true);

-- 6. 创建策略：允许所有人删除帖子（可选）
CREATE POLICY "Allow public delete posts" ON public.posts
FOR DELETE TO public
USING (true);

-- 7. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_name);
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON public.posts(media_type);

-- 8. 插入一些示例数据（可选）
INSERT INTO public.posts (content, author_name, author_avatar, likes_count, media_type) VALUES
('欢迎来到 MusicX 音乐社区！这里是音乐爱好者的聚集地 🎵', '系统管理员', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', 5, NULL),
('分享一首我最喜欢的古典音乐作品，希望大家喜欢！', '古典音乐爱好者', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', 12, 'audio'),
('今天录制了一段吉他演奏视频，请大家指教 🎸', '吉他手小李', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', 8, 'video')
ON CONFLICT DO NOTHING;

-- 完成提示
SELECT 'MusicX 数据库设置完成！' as message;