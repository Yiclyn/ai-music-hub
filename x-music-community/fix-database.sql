-- 数据库修复脚本
-- 确保所有必要的表和字段都存在

-- 1. 检查并添加 profiles 表的统计字段
DO $$ 
BEGIN
  -- 添加 posts_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'posts_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN posts_count INTEGER DEFAULT 0;
  END IF;

  -- 添加 following_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'following_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN following_count INTEGER DEFAULT 0;
  END IF;

  -- 添加 followers_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'followers_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN followers_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. 检查并添加 posts 表的字段
DO $$ 
BEGIN
  -- 添加 comments_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'comments_count'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN comments_count INTEGER DEFAULT 0;
  END IF;

  -- 添加 retweets_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'retweets_count'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN retweets_count INTEGER DEFAULT 0;
  END IF;

  -- 添加 user_id 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- 添加 username 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN username VARCHAR(255);
  END IF;
END $$;

-- 3. 创建 follows 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 4. 创建 post_likes 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 5. 创建 comments 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建 retweets 表（如果不存在）
CREATE TABLE IF NOT EXISTS public.retweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 7. 启用 RLS（如果还没启用）
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retweets ENABLE ROW LEVEL SECURITY;

-- 8. 创建或替换策略 - follows 表
DROP POLICY IF EXISTS "Users can view all follows" ON public.follows;
CREATE POLICY "Users can view all follows" ON public.follows
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others" ON public.follows
FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;
CREATE POLICY "Users can unfollow others" ON public.follows
FOR DELETE USING (auth.uid() = follower_id);

-- 9. 创建或替换策略 - post_likes 表
DROP POLICY IF EXISTS "Users can view all likes" ON public.post_likes;
CREATE POLICY "Users can view all likes" ON public.post_likes
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
CREATE POLICY "Users can like posts" ON public.post_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
CREATE POLICY "Users can unlike posts" ON public.post_likes
FOR DELETE USING (auth.uid() = user_id);

-- 10. 创建或替换策略 - comments 表
DROP POLICY IF EXISTS "Users can view all comments" ON public.comments;
CREATE POLICY "Users can view all comments" ON public.comments
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments
FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments
FOR UPDATE USING (auth.uid() = user_id);

-- 11. 创建或替换策略 - retweets 表
DROP POLICY IF EXISTS "Users can view all retweets" ON public.retweets;
CREATE POLICY "Users can view all retweets" ON public.retweets
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can retweet posts" ON public.retweets;
CREATE POLICY "Users can retweet posts" ON public.retweets
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own retweets" ON public.retweets;
CREATE POLICY "Users can delete own retweets" ON public.retweets
FOR DELETE USING (auth.uid() = user_id);

-- 12. 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_retweets_post ON public.retweets(post_id);
CREATE INDEX IF NOT EXISTS idx_retweets_user ON public.retweets(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);

-- 13. 创建或替换触发器函数 - 更新用户统计
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

-- 14. 创建触发器 - 关注时更新统计
DROP TRIGGER IF EXISTS on_follow_created ON public.follows;
CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();

DROP TRIGGER IF EXISTS on_follow_deleted ON public.follows;
CREATE TRIGGER on_follow_deleted
  AFTER DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_delete();

-- 15. 创建或替换触发器函数 - 更新点赞数
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

-- 16. 创建触发器 - 点赞
DROP TRIGGER IF EXISTS on_like_created ON public.post_likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

DROP TRIGGER IF EXISTS on_like_deleted ON public.post_likes;
CREATE TRIGGER on_like_deleted
  AFTER DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count_on_delete();

-- 17. 创建或替换触发器函数 - 更新评论数
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

-- 18. 创建触发器 - 评论
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

DROP TRIGGER IF EXISTS on_comment_deleted ON public.comments;
CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count_on_delete();

-- 19. 创建或替换触发器函数 - 更新转发数
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

-- 20. 创建触发器 - 转发
DROP TRIGGER IF EXISTS on_retweet_created ON public.retweets;
CREATE TRIGGER on_retweet_created
  AFTER INSERT ON public.retweets
  FOR EACH ROW EXECUTE FUNCTION public.update_retweets_count();

DROP TRIGGER IF EXISTS on_retweet_deleted ON public.retweets;
CREATE TRIGGER on_retweet_deleted
  AFTER DELETE ON public.retweets
  FOR EACH ROW EXECUTE FUNCTION public.update_retweets_count_on_delete();

-- 21. 初始化现有数据的统计
UPDATE public.profiles 
SET posts_count = COALESCE((
  SELECT COUNT(*) FROM public.posts WHERE user_id = profiles.id
), 0),
following_count = COALESCE((
  SELECT COUNT(*) FROM public.follows WHERE follower_id = profiles.id
), 0),
followers_count = COALESCE((
  SELECT COUNT(*) FROM public.follows WHERE following_id = profiles.id
), 0);

UPDATE public.posts 
SET likes_count = COALESCE((
  SELECT COUNT(*) FROM public.post_likes WHERE post_id = posts.id
), 0),
comments_count = COALESCE((
  SELECT COUNT(*) FROM public.comments WHERE post_id = posts.id
), 0),
retweets_count = COALESCE((
  SELECT COUNT(*) FROM public.retweets WHERE post_id = posts.id
), 0);

-- 完成
SELECT '数据库修复完成！所有表、字段、触发器和策略已就绪。' as message;
