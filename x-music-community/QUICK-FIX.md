# 🚨 快速修复：posts 表字段缺失问题

## 问题
发布失败，提示：`Could not find the 'author_name' column of 'posts' in the schema cache`

## 解决方案

### 步骤1: 在 Supabase 控制台执行 SQL

1. 打开 [Supabase 控制台](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 复制并执行以下 SQL：

```sql
-- 删除现有的 posts 表（如果存在）
DROP TABLE IF EXISTS public.posts CASCADE;

-- 创建完整的 posts 表
CREATE TABLE public.posts (
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

-- 启用行级安全 (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人查看帖子
CREATE POLICY "Allow public read posts" ON public.posts
FOR SELECT TO public
USING (true);

-- 创建策略：允许所有人创建帖子
CREATE POLICY "Allow public insert posts" ON public.posts
FOR INSERT TO public
WITH CHECK (true);

-- 创建策略：允许所有人更新帖子
CREATE POLICY "Allow public update posts" ON public.posts
FOR UPDATE TO public
USING (true)
WITH CHECK (true);

-- 插入测试数据
INSERT INTO public.posts (content, author_name, author_avatar, likes_count) VALUES
('欢迎来到 MusicX 音乐社区！🎵', '系统管理员', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', 0);

-- 验证创建结果
SELECT 'posts 表创建成功！' as message;
```

### 步骤2: 验证修复

1. 访问 `http://localhost:3000/debug`
2. 点击"测试连接"
3. 确认显示"✅ posts 表存在且可访问"
4. 确认显示"✅ 插入权限正常"

### 步骤3: 测试发布

1. 访问 `http://localhost:3000/compose`
2. 输入文字内容
3. 选择音频文件
4. 点击"发布"

## 预期结果

- ✅ 不再出现字段缺失错误
- ✅ 音频+文字可以成功发布
- ✅ 发布后自动跳转到首页
- ✅ 首页显示新发布的帖子

## 如果仍有问题

检查浏览器控制台（F12）的错误信息，或访问调试页面获取详细日志。