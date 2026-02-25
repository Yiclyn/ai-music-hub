# 本地测试指南

## 🚀 开发服务器已启动

访问: **http://localhost:3000**

## 📋 测试前准备

### 步骤 1: 设置 Supabase 数据库

1. **打开 Supabase 控制台**
   - 访问: https://supabase.com/dashboard
   - 选择你的项目: `fqwpvfihvesmifhwtleu`

2. **执行数据库设置脚本**
   - 进入 **SQL Editor**
   - 复制 `auth-setup.sql` 文件的内容
   - 粘贴并点击 **Run** 执行

3. **配置认证设置（可选）**
   - 进入 **Authentication** → **Settings**
   - 找到 **Email Auth**
   - 关闭 "Confirm email" （用于测试，生产环境建议开启）
   - 保存设置

### 步骤 2: 验证 posts 表结构

在 SQL Editor 中执行：
```sql
-- 查看 posts 表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' AND table_schema = 'public'
ORDER BY ordinal_position;
```

确保包含以下字段：
- ✅ id
- ✅ content
- ✅ user_id (新增)
- ✅ username (新增)
- ✅ author_name
- ✅ author_avatar
- ✅ created_at
- ✅ likes_count
- ✅ media_url
- ✅ media_type
- ✅ cover_image

## 🧪 测试流程

### 测试 1: 未登录状态

1. **访问首页**: http://localhost:3000
   - ✅ 应该能看到首页
   - ✅ 右侧栏显示"注册"和"登录"按钮
   - ✅ 可以查看帖子

2. **尝试发布**
   - 点击左侧栏的"发布"按钮
   - ✅ 应该弹出提示"请先登录后再发布内容"
   - ✅ 自动跳转到登录页面

### 测试 2: 注册新用户

1. **访问注册页**: http://localhost:3000/register
   
2. **填写注册信息**:
   ```
   邮箱: test@example.com
   用户名: testuser
   昵称: 测试用户
   密码: test123456
   确认密码: test123456
   ```

3. **点击注册**
   - ✅ 应该显示"注册成功！请登录"
   - ✅ 自动跳转到登录页面

4. **验证数据库**
   在 Supabase SQL Editor 中执行：
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
   ```
   - ✅ auth.users 表中应该有新用户
   - ✅ profiles 表中应该自动创建了用户资料

### 测试 3: 登录

1. **访问登录页**: http://localhost:3000/login

2. **输入登录信息**:
   ```
   邮箱: test@example.com
   密码: test123456
   ```

3. **点击登录**
   - ✅ 应该成功登录
   - ✅ 跳转到首页
   - ✅ 右侧栏显示个人信息（头像、昵称、用户名）
   - ✅ 显示"退出登录"按钮

### 测试 4: 发布帖子（已登录）

1. **点击"发布"按钮**
   - ✅ 应该跳转到发布页面 http://localhost:3000/compose
   - ✅ 显示用户头像

2. **创建纯文字帖子**
   ```
   内容: 这是我的第一条测试帖子！
   ```
   - 点击"发布"
   - ✅ 应该成功发布
   - ✅ 跳转到首页
   - ✅ 首页显示新帖子，带有用户昵称和头像

3. **创建音频帖子**
   - 点击"发布"按钮
   - 输入文字内容
   - 点击音频图标，选择一个音频文件
   - ✅ 应该显示音频预览
   - 点击"发布"
   - ✅ 应该成功上传并发布

4. **验证数据库**
   ```sql
   SELECT id, content, author_name, username, user_id, created_at 
   FROM public.posts 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
   - ✅ 帖子应该关联到用户ID
   - ✅ username 字段应该有值

### 测试 5: 权限控制

1. **点击"退出登录"**
   - ✅ 应该退出登录
   - ✅ 右侧栏恢复显示"注册"和"登录"按钮

2. **再次尝试发布**
   - 点击"发布"按钮
   - ✅ 应该提示"请先登录"
   - ✅ 跳转到登录页面

### 测试 6: 调试工具

1. **访问调试页面**: http://localhost:3000/debug

2. **点击"测试连接"**
   - ✅ 应该显示数据库连接成功
   - ✅ 显示 posts 表存在且可访问
   - ✅ 显示插入权限正常

3. **点击"测试文件上传"**
   - 选择一个音频/视频/图片文件
   - ✅ 应该上传成功
   - ✅ 显示公共URL

## 🐛 常见问题

### 问题 1: 注册后无法登录
**原因**: Supabase 邮箱验证未关闭

**解决**:
1. 进入 Supabase → Authentication → Settings
2. 关闭 "Confirm email"
3. 或者检查邮箱中的验证邮件

### 问题 2: 发布帖子失败
**错误**: "permission denied" 或 "user_id column does not exist"

**解决**:
1. 确保已执行 `auth-setup.sql`
2. 检查 posts 表是否有 user_id 字段
3. 检查 RLS 策略是否正确

### 问题 3: 用户资料未创建
**错误**: profiles 表中没有记录

**解决**:
1. 检查触发器是否创建成功：
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. 手动创建用户资料：
   ```sql
   INSERT INTO public.profiles (id, username, nickname, avatar_url)
   VALUES (
     'USER_ID_HERE',
     'testuser',
     '测试用户',
     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
   );
   ```

### 问题 4: 头像不显示
**原因**: 默认头像URL可能失效

**解决**: 在 profiles 表中更新头像URL

## ✅ 测试检查清单

- [ ] 未登录可以查看首页
- [ ] 未登录点击发布会提示登录
- [ ] 可以成功注册新用户
- [ ] 注册后自动创建用户资料
- [ ] 可以成功登录
- [ ] 登录后右侧栏显示个人信息
- [ ] 登录后可以发布纯文字帖子
- [ ] 登录后可以发布带音频的帖子
- [ ] 帖子显示正确的用户信息
- [ ] 可以成功退出登录
- [ ] 退出后无法发布帖子

## 📊 数据库查询工具

### 查看所有用户
```sql
SELECT u.id, u.email, p.username, p.nickname, u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### 查看所有帖子及作者
```sql
SELECT p.id, p.content, p.author_name, p.username, p.created_at, pr.nickname
FROM public.posts p
LEFT JOIN public.profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC;
```

### 清理测试数据
```sql
-- 删除测试帖子
DELETE FROM public.posts WHERE username = 'testuser';

-- 删除测试用户（谨慎使用）
DELETE FROM auth.users WHERE email = 'test@example.com';
```

现在开始测试吧！祝测试顺利！🎉