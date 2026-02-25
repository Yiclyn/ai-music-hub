# 故障排除指南

## 🚨 音频+文字发布失败问题

### 问题症状
- 单独上传音频文件成功
- 音频+文字一起发布时失败
- 控制台显示数据库相关错误

### 解决步骤

#### 1. 检查问题
访问调试页面：`http://localhost:3000/debug`
点击"测试连接"按钮，查看具体错误信息。

#### 2. 常见错误及解决方案

**错误：`relation "public.posts" does not exist`**
- **原因**：posts 表不存在
- **解决**：在 Supabase SQL Editor 中执行 `database-setup.sql` 脚本

**错误：`permission denied for table posts`**
- **原因**：RLS 策略配置不正确
- **解决**：检查并重新创建表策略

**错误：`new row violates row-level security policy`**
- **原因**：INSERT 策略过于严格
- **解决**：使用 `WITH CHECK (true)` 策略

#### 3. 手动创建 posts 表

在 Supabase 控制台 → SQL Editor 中执行：

```sql
-- 创建 posts 表
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

-- 启用 RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Allow public read posts" ON public.posts
FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert posts" ON public.posts
FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update posts" ON public.posts
FOR UPDATE TO public USING (true) WITH CHECK (true);
```

#### 4. 验证修复

1. 刷新调试页面
2. 再次点击"测试连接"
3. 确认所有测试通过
4. 尝试发布音频+文字内容

### 🔍 调试技巧

#### 查看浏览器控制台
按 F12 打开开发者工具，查看 Console 标签页的错误信息。

#### 检查 Supabase 日志
在 Supabase 控制台 → Logs 中查看实时错误日志。

#### 测试步骤
1. 先测试纯文字发布
2. 再测试纯音频上传
3. 最后测试音频+文字组合

### 📞 获取帮助

如果问题仍然存在：
1. 访问 `/debug` 页面获取详细日志
2. 检查浏览器控制台错误信息
3. 查看 Supabase 项目日志
4. 确认数据库表结构和权限配置

### ✅ 成功标志

当以下条件都满足时，问题应该已解决：
- ✅ 调试页面显示"数据库连接成功"
- ✅ 调试页面显示"posts 表存在且可访问"
- ✅ 调试页面显示"插入权限正常"
- ✅ 可以成功发布音频+文字内容