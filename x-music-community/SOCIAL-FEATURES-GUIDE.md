# 社交功能使用指南

本指南介绍如何使用音乐社区的社交互动功能，包括点赞、评论、转发和用户统计。

## 功能概览

### 1. 用户统计
每个用户的个人资料会显示以下统计信息：
- **发帖数量**：用户发布的帖子总数
- **关注人数**：用户关注的其他用户数量
- **粉丝人数**：关注该用户的其他用户数量

这些统计数据会在右侧面板的用户卡片中显示。

### 2. 帖子互动功能

#### 点赞 (Like)
- 点击帖子下方的❤️图标可以点赞
- 再次点击可以取消点赞
- 点赞数会实时更新
- 已点赞的帖子会显示红色的实心❤️图标

#### 评论 (Comment)
- 点击💬图标可以展开评论区
- 在评论输入框中输入内容并点击发送按钮
- 评论会按时间倒序显示（最新的在上面）
- 评论数会实时更新
- 每条评论显示：
  - 评论者头像
  - 评论者昵称
  - 评论时间
  - 评论内容

#### 转发 (Retweet)
- 点击🔄图标可以转发帖子
- 首次点击会弹出转发对话框
- 可以添加转发评论（可选）
- 点击"转发"按钮确认
- 已转发的帖子会显示绿色的🔄图标
- 再次点击可以取消转发
- 转发数会实时更新

#### 分享 (Share)
- 点击📤图标可以分享帖子
- 目前为预留功能，可以后续扩展

## 数据库设置

### 步骤 1: 执行社交功能 SQL 脚本

在 Supabase SQL Editor 中执行 `social-features-setup.sql` 脚本：

```sql
-- 该脚本会创建以下表：
-- 1. post_likes: 点赞记录表
-- 2. comments: 评论表
-- 3. retweets: 转发表

-- 并且会：
-- - 更新 posts 表，添加统计字段
-- - 创建触发器自动更新统计数据
-- - 设置行级安全策略 (RLS)
```

### 步骤 2: 执行用户功能 SQL 脚本

如果还没有执行，请在 Supabase SQL Editor 中执行 `user-features-setup.sql` 脚本：

```sql
-- 该脚本会：
-- 1. 更新 profiles 表，添加统计字段
-- 2. 创建 follows 表（关注关系）
-- 3. 创建触发器自动更新用户统计
```

## 数据表结构

### post_likes 表
```sql
- id: UUID (主键)
- post_id: UUID (外键 -> posts.id)
- user_id: UUID (外键 -> auth.users.id)
- created_at: TIMESTAMP
- UNIQUE(post_id, user_id) -- 每个用户只能点赞一次
```

### comments 表
```sql
- id: UUID (主键)
- post_id: UUID (外键 -> posts.id)
- user_id: UUID (外键 -> auth.users.id)
- content: TEXT
- created_at: TIMESTAMP
```

### retweets 表
```sql
- id: UUID (主键)
- post_id: UUID (外键 -> posts.id)
- user_id: UUID (外键 -> auth.users.id)
- comment: TEXT (可选)
- created_at: TIMESTAMP
- UNIQUE(post_id, user_id) -- 每个用户只能转发一次
```

### posts 表更新
新增字段：
```sql
- user_id: UUID (外键 -> auth.users.id)
- username: VARCHAR(255)
- comments_count: INTEGER (默认 0)
- retweets_count: INTEGER (默认 0)
```

## 自动统计更新

所有统计数据都通过数据库触发器自动更新，无需手动维护：

1. **点赞数**：当用户点赞或取消点赞时自动更新
2. **评论数**：当用户发表或删除评论时自动更新
3. **转发数**：当用户转发或取消转发时自动更新
4. **发帖数**：当用户发布或删除帖子时自动更新
5. **关注数**：当用户关注或取消关注时自动更新
6. **粉丝数**：当其他用户关注或取消关注时自动更新

## 权限控制 (RLS)

所有表都启用了行级安全策略：

### 点赞表
- 所有人可以查看点赞记录
- 用户只能为自己创建点赞记录
- 用户只能删除自己的点赞记录

### 评论表
- 所有人可以查看评论
- 用户只能创建自己的评论
- 用户只能修改和删除自己的评论

### 转发表
- 所有人可以查看转发记录
- 用户只能为自己创建转发记录
- 用户只能删除自己的转发记录

## 使用示例

### 前端组件使用

PostCard 组件已经集成了所有社交功能：

```tsx
import PostCard from '@/components/PostCard'

// 在 Feed 或其他地方使用
<PostCard post={post} />
```

组件会自动处理：
- 检查用户是否已点赞/转发
- 显示正确的按钮状态
- 处理用户交互
- 更新统计数据
- 显示评论列表

### API 调用示例

如果需要在其他地方使用这些功能：

```typescript
import { supabase } from '@/lib/supabase'

// 点赞
await supabase
  .from('post_likes')
  .insert({ post_id: postId, user_id: userId })

// 取消点赞
await supabase
  .from('post_likes')
  .delete()
  .eq('post_id', postId)
  .eq('user_id', userId)

// 发表评论
await supabase
  .from('comments')
  .insert({
    post_id: postId,
    user_id: userId,
    content: commentText
  })

// 获取评论列表
const { data } = await supabase
  .from('comments')
  .select(`
    *,
    user:profiles(username, full_name, avatar_url)
  `)
  .eq('post_id', postId)
  .order('created_at', { ascending: false })

// 转发
await supabase
  .from('retweets')
  .insert({
    post_id: postId,
    user_id: userId,
    comment: retweetComment
  })
```

## 注意事项

1. **登录要求**：所有互动功能都需要用户登录
2. **唯一性约束**：每个用户对同一帖子只能点赞一次、转发一次
3. **级联删除**：删除帖子时会自动删除相关的点赞、评论和转发记录
4. **实时更新**：统计数据通过触发器实时更新，无需刷新页面

## 故障排除

### 问题：点赞/评论/转发失败
- 检查用户是否已登录
- 检查 Supabase 连接是否正常
- 查看浏览器控制台的错误信息
- 确认已执行所有 SQL 脚本

### 问题：统计数据不准确
- 在 Supabase SQL Editor 中运行初始化脚本的最后部分
- 这会重新计算所有统计数据

### 问题：评论不显示用户信息
- 确认 profiles 表存在且包含必要字段
- 检查评论查询是否正确关联了 profiles 表

## 未来扩展

可以考虑添加的功能：
- 评论的点赞功能
- 评论的回复功能（嵌套评论）
- 帖子收藏功能
- 用户提及 (@username)
- 话题标签 (#hashtag)
- 通知系统
- 活动时间线
