-- 社交功能数据库设置
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 更新 posts 表，添加统计字段和用户关联
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS username VARCHAR(255),
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS retweets_count INTEGER DEFAULT 0;

-- 2. 创建点赞表
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 3. 创建评论表
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建转发表
CREATE TABLE IF NOT EXISTS public.retweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 5. 启用 RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retweets ENABLE ROW LEVEL SECURITY;

-- 6. 创建点赞表策略
CREATE POLICY "Users can view all likes" ON public.post_likes
FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON public.post_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON public.post_likes
FOR DELETE USING (auth.uid() = user_id);

-- 7. 创建评论表策略
CREATE POLICY "Users can view all comments" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
FOR UPDATE USING (auth.uid() = user_id);

-- 8. 创建转发表策略
CREATE POLICY "Users can view all retweets" ON public.retweets
FOR SELECT USING (true);

CREATE POLICY "Users can retweet posts" ON public.retweets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own retweets" ON public.retweets
FOR DELETE USING (auth.uid() = user_id);

-- 9. 创建函数：更新点赞数
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET likes_count = (
    SELECT COUNT(*) FROM public.post_likes WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_likes_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET likes_count = (
    SELECT COUNT(*) FROM public.post_likes WHERE post_id = OLD.post_id
  )
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 创建函数：更新评论数
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET comments_count = (
    SELECT COUNT(*) FROM public.comments WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_comments_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET comments_count = (
    SELECT COUNT(*) FROM public.comments WHERE post_id = OLD.post_id
  )
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. 创建函数：更新转发数
CREATE OR REPLACE FUNCTION public.update_retweets_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET retweets_count = (
    SELECT COUNT(*) FROM public.retweets WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_retweets_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts 
  SET retweets_count = (
    SELECT COUNT(*) FROM public.retweets WHERE post_id = OLD.post_id
  )
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. 创建触发器：点赞
DROP TRIGGER IF EXISTS on_like_created ON public.post_likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

DROP TRIGGER IF EXISTS on_like_deleted ON public.post_likes;
CREATE TRIGGER on_like_deleted
  AFTER DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count_on_delete();

-- 13. 创建触发器：评论
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

DROP TRIGGER IF EXISTS on_comment_deleted ON public.comments;
CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count_on_delete();

-- 14. 创建触发器：转发
DROP TRIGGER IF EXISTS on_retweet_created ON public.retweets;
CREATE TRIGGER on_retweet_created
  AFTER INSERT ON public.retweets
  FOR EACH ROW EXECUTE FUNCTION public.update_retweets_count();

DROP TRIGGER IF EXISTS on_retweet_deleted ON public.retweets;
CREATE TRIGGER on_retweet_deleted
  AFTER DELETE ON public.retweets
  FOR EACH ROW EXECUTE FUNCTION public.update_retweets_count_on_delete();

-- 15. 创建索引
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_retweets_post ON public.retweets(post_id);
CREATE INDEX IF NOT EXISTS idx_retweets_user ON public.retweets(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);

-- 16. 初始化现有帖子的统计数据
UPDATE public.posts 
SET likes_count = (
  SELECT COUNT(*) FROM public.post_likes WHERE post_id = posts.id
),
comments_count = (
  SELECT COUNT(*) FROM public.comments WHERE post_id = posts.id
),
retweets_count = (
  SELECT COUNT(*) FROM public.retweets WHERE post_id = posts.id
);

SELECT '社交功能设置完成！' as message;
