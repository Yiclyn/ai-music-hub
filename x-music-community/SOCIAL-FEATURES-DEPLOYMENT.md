# 社交功能部署指南

快速部署社交互动功能（点赞、评论、转发、用户统计）。

## 部署步骤

### 1. 数据库设置

在 Supabase Dashboard 的 SQL Editor 中依次执行以下脚本：

#### 步骤 1.1: 用户功能（如果还没执行）
```bash
# 执行文件: user-features-setup.sql
```
这会创建：
- follows 表（关注关系）
- 用户统计字段（posts_count, following_count, followers_count）
- 自动更新触发器

#### 步骤 1.2: 社交功能
```bash
# 执行文件: social-features-setup.sql
```
这会创建：
- post_likes 表（点赞）
- comments 表（评论）
- retweets 表（转发）
- 帖子统计字段（comments_count, retweets_count）
- 自动更新触发器

### 2. 验证数据库

执行以下查询验证表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('post_likes', 'comments', 'retweets', 'follows');

-- 检查 posts 表的新字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name IN ('user_id', 'username', 'comments_count', 'retweets_count');

-- 检查 profiles 表的统计字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('posts_count', 'following_count', 'followers_count');
```

### 3. 代码部署

所有代码已更新，包括：

#### 更新的文件：
- ✅ `src/lib/supabase.ts` - 添加了新的类型定义
- ✅ `src/components/PostCard.tsx` - 完整的社交互动功能
- ✅ `src/components/Feed.tsx` - 更新了模拟数据
- ✅ `src/components/RightPanel.tsx` - 显示用户统计（已有）

#### 新增的文件：
- ✅ `social-features-setup.sql` - 社交功能数据库脚本
- ✅ `SOCIAL-FEATURES-GUIDE.md` - 功能使用指南
- ✅ `SOCIAL-FEATURES-DEPLOYMENT.md` - 本部署指南

### 4. 测试功能

#### 4.1 测试点赞功能
1. 登录账号
2. 在首页找到任意帖子
3. 点击❤️图标
4. 验证：
   - 图标变为红色实心
   - 点赞数 +1
   - 再次点击可以取消

#### 4.2 测试评论功能
1. 点击💬图标展开评论区
2. 在输入框输入评论内容
3. 点击发送按钮
4. 验证：
   - 评论出现在列表中
   - 评论数 +1
   - 显示正确的用户信息和时间

#### 4.3 测试转发功能
1. 点击🔄图标
2. 在弹出的对话框中输入转发评论（可选）
3. 点击"转发"按钮
4. 验证：
   - 图标变为绿色
   - 转发数 +1
   - 再次点击可以取消转发

#### 4.4 测试用户统计
1. 查看右侧面板的用户卡片
2. 验证显示：
   - 发帖数量
   - 关注人数
   - 粉丝人数
3. 发布新帖子，验证发帖数 +1
4. 关注其他用户，验证关注数 +1

### 5. 数据库查询测试

在 Supabase SQL Editor 中测试：

```sql
-- 查看点赞记录
SELECT * FROM post_likes LIMIT 10;

-- 查看评论
SELECT c.*, p.username, p.full_name 
FROM comments c
LEFT JOIN profiles p ON c.user_id = p.id
ORDER BY c.created_at DESC
LIMIT 10;

-- 查看转发
SELECT * FROM retweets ORDER BY created_at DESC LIMIT 10;

-- 查看帖子统计
SELECT 
  id,
  content,
  likes_count,
  comments_count,
  retweets_count
FROM posts
ORDER BY created_at DESC
LIMIT 10;

-- 查看用户统计
SELECT 
  username,
  full_name,
  posts_count,
  following_count,
  followers_count
FROM profiles
LIMIT 10;
```

## 功能特性

### ✅ 已实现的功能

1. **点赞系统**
   - 点赞/取消点赞
   - 实时统计更新
   - 防止重复点赞
   - 视觉反馈（红色实心图标）

2. **评论系统**
   - 发表评论
   - 查看评论列表
   - 显示评论者信息
   - 实时统计更新
   - 按时间倒序排列

3. **转发系统**
   - 转发帖子
   - 添加转发评论
   - 取消转发
   - 实时统计更新
   - 防止重复转发
   - 视觉反馈（绿色图标）

4. **用户统计**
   - 发帖数量统计
   - 关注人数统计
   - 粉丝人数统计
   - 自动更新（通过触发器）

5. **安全性**
   - 行级安全策略 (RLS)
   - 用户身份验证
   - 数据权限控制

6. **性能优化**
   - 数据库索引
   - 触发器自动更新
   - 防止 N+1 查询

## 常见问题

### Q: 点赞后刷新页面，点赞状态丢失？
A: 这是正常的，因为点赞状态是在组件加载时从数据库查询的。确保 `checkIfLiked()` 函数正常工作。

### Q: 评论不显示用户头像和昵称？
A: 检查 profiles 表是否有对应的用户记录，以及查询是否正确关联了 profiles 表。

### Q: 统计数据不准确？
A: 运行以下 SQL 重新计算：

```sql
-- 重新计算帖子统计
UPDATE posts 
SET likes_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
    comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = posts.id),
    retweets_count = (SELECT COUNT(*) FROM retweets WHERE post_id = posts.id);

-- 重新计算用户统计
UPDATE profiles 
SET posts_count = (SELECT COUNT(*) FROM posts WHERE user_id = profiles.id),
    following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = profiles.id),
    followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = profiles.id);
```

### Q: 触发器没有自动更新统计？
A: 检查触发器是否创建成功：

```sql
-- 查看所有触发器
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## 性能监控

### 监控查询性能

```sql
-- 查看慢查询
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%post_likes%' 
OR query LIKE '%comments%' 
OR query LIKE '%retweets%'
ORDER BY mean_exec_time DESC;

-- 查看索引使用情况
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename IN ('post_likes', 'comments', 'retweets', 'posts', 'profiles');
```

## 下一步

功能已完全实现并可以使用。可以考虑的扩展：

1. **通知系统** - 当有人点赞、评论或转发时通知用户
2. **评论回复** - 支持对评论的回复（嵌套评论）
3. **热门排序** - 根据互动数据排序帖子
4. **用户主页** - 显示用户的所有帖子和统计
5. **关注动态** - 只显示关注用户的帖子
6. **搜索功能** - 搜索帖子和用户
7. **话题标签** - 支持 #hashtag
8. **用户提及** - 支持 @username

## 支持

如有问题，请查看：
- `SOCIAL-FEATURES-GUIDE.md` - 详细使用指南
- Supabase Dashboard - 查看数据库日志
- 浏览器控制台 - 查看前端错误
