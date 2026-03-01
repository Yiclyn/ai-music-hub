-- 用户功能扩展数据库设置
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 更新 profiles 表，添加统计字段
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;

-- 2. 创建关注关系表
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 3. 启用 RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 4. 创建关注表策略
CREATE POLICY "Users can view all follows" ON public.follows
FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON public.follows
FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" ON public.follows
FOR DELETE USING (auth.uid() = follower_id);

-- 5. 创建函数：更新用户统计
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新关注者的关注数
  UPDATE public.profiles 
  SET following_count = (
    SELECT COUNT(*) FROM public.follows WHERE follower_id = NEW.follower_id
  )
  WHERE id = NEW.follower_id;
  
  -- 更新被关注者的粉丝数
  UPDATE public.profiles 
  SET followers_count = (
    SELECT COUNT(*) FROM public.follows WHERE following_id = NEW.following_id
  )
  WHERE id = NEW.following_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 创建函数：更新用户统计（删除关注时）
CREATE OR REPLACE FUNCTION public.update_user_stats_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新关注者的关注数
  UPDATE public.profiles 
  SET following_count = (
    SELECT COUNT(*) FROM public.follows WHERE follower_id = OLD.follower_id
  )
  WHERE id = OLD.follower_id;
  
  -- 更新被关注者的粉丝数
  UPDATE public.profiles 
  SET followers_count = (
    SELECT COUNT(*) FROM public.follows WHERE following_id = OLD.following_id
  )
  WHERE id = OLD.following_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 创建触发器：关注时更新统计
DROP TRIGGER IF EXISTS on_follow_created ON public.follows;
CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

DROP TRIGGER IF EXISTS on_follow_deleted ON public.follows;
CREATE TRIGGER on_follow_deleted
  AFTER DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_delete();

-- 8. 创建函数：更新发帖数
CREATE OR REPLACE FUNCTION public.update_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新用户发帖数
  UPDATE public.profiles 
  SET posts_count = (
    SELECT COUNT(*) FROM public.posts WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 创建函数：删除帖子时更新发帖数
CREATE OR REPLACE FUNCTION public.update_posts_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新用户发帖数
  UPDATE public.profiles 
  SET posts_count = (
    SELECT COUNT(*) FROM public.posts WHERE user_id = OLD.user_id
  )
  WHERE id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 创建触发器：发帖时更新统计
DROP TRIGGER IF EXISTS on_post_created ON public.posts;
CREATE TRIGGER on_post_created
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_posts_count();

DROP TRIGGER IF EXISTS on_post_deleted ON public.posts;
CREATE TRIGGER on_post_deleted
  AFTER DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_posts_count_on_delete();

-- 11. 创建索引
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- 12. 初始化现有用户的统计数据
UPDATE public.profiles 
SET posts_count = (
  SELECT COUNT(*) FROM public.posts WHERE user_id = profiles.id
),
following_count = (
  SELECT COUNT(*) FROM public.follows WHERE follower_id = profiles.id
),
followers_count = (
  SELECT COUNT(*) FROM public.follows WHERE following_id = profiles.id
);

SELECT '用户功能扩展设置完成！' as message;