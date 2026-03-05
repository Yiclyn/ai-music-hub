-- 诊断和修复脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 第一部分：诊断问题
-- ============================================

-- 1. 检查所有用户
SELECT 
  u.id as user_id,
  u.email,
  u.created_at as user_created_at,
  p.id as profile_id,
  p.username,
  p.nickname,
  p.avatar_url,
  p.posts_count,
  p.following_count,
  p.followers_count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 2. 找出没有 profile 的用户
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM profiles);

-- 3. 检查 profiles 表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. 检查 posts 表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

-- ============================================
-- 第二部分：修复问题
-- ============================================

-- 5. 为所有没有 profile 的用户创建 profile
INSERT INTO profiles (id, username, nickname, avatar_url, posts_count, following_count, followers_count)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'username',
    'user_' || substr(u.id::text, 1, 8)
  ) as username,
  COALESCE(
    u.raw_user_meta_data->>'nickname',
    '音乐爱好者'
  ) as nickname,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' as avatar_url,
  0 as posts_count,
  0 as following_count,
  0 as followers_count
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- 6. 确保所有 profiles 都有必需的字段
UPDATE profiles
SET 
  username = COALESCE(username, 'user_' || substr(id::text, 1, 8)),
  nickname = COALESCE(nickname, '音乐爱好者'),
  avatar_url = COALESCE(avatar_url, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
  posts_count = COALESCE(posts_count, 0),
  following_count = COALESCE(following_count, 0),
  followers_count = COALESCE(followers_count, 0);

-- 7. 更新所有用户的统计数据
UPDATE profiles 
SET 
  posts_count = (
    SELECT COUNT(*) 
    FROM posts 
    WHERE user_id = profiles.id
  ),
  following_count = (
    SELECT COUNT(*) 
    FROM follows 
    WHERE follower_id = profiles.id
  ),
  followers_count = (
    SELECT COUNT(*) 
    FROM follows 
    WHERE following_id = profiles.id
  );

-- 8. 检查并修复 posts 表中的数据
UPDATE posts
SET 
  likes_count = COALESCE(likes_count, 0),
  comments_count = COALESCE(comments_count, 0),
  retweets_count = COALESCE(retweets_count, 0)
WHERE likes_count IS NULL 
   OR comments_count IS NULL 
   OR retweets_count IS NULL;

-- ============================================
-- 第三部分：验证修复
-- ============================================

-- 9. 验证所有用户都有 profile
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profile,
  COUNT(*) - COUNT(p.id) as users_without_profile
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;

-- 10. 验证 profiles 数据完整性
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN username IS NULL THEN 1 END) as missing_username,
  COUNT(CASE WHEN nickname IS NULL THEN 1 END) as missing_nickname,
  COUNT(CASE WHEN posts_count IS NULL THEN 1 END) as missing_posts_count,
  COUNT(CASE WHEN following_count IS NULL THEN 1 END) as missing_following_count,
  COUNT(CASE WHEN followers_count IS NULL THEN 1 END) as missing_followers_count
FROM profiles;

-- 11. 显示最近的用户信息
SELECT 
  id,
  username,
  nickname,
  posts_count,
  following_count,
  followers_count,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- 12. 显示最近的帖子
SELECT 
  id,
  content,
  author_name,
  likes_count,
  comments_count,
  retweets_count,
  created_at
FROM posts
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 完成提示
-- ============================================

SELECT '诊断和修复完成！请查看上面的结果。' as message;
SELECT '如果 users_without_profile = 0，说明所有用户都有 profile。' as tip1;
SELECT '如果所有 missing_xxx = 0，说明数据完整。' as tip2;
