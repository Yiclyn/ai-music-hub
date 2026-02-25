# 用户认证系统使用指南

## ✅ 功能完成

已实现完整的用户认证系统，包括：

### 核心功能
- ✅ 用户注册（邮箱、用户名、昵称、密码）
- ✅ 用户登录
- ✅ 退出登录
- ✅ 权限控制（未登录无法发帖）
- ✅ 用户信息显示
- ✅ 个人资料管理

### 数据库设置

**第一步：在 Supabase SQL Editor 中执行 `auth-setup.sql`**

这将创建：
1. `profiles` 表 - 存储用户资料
2. 自动触发器 - 注册时自动创建用户资料
3. RLS 策略 - 权限控制
4. `posts` 表更新 - 关联用户ID

### 使用流程

#### 1. 未登录用户
- 可以浏览首页查看所有帖子
- 点击"发布"按钮会提示"请先登录"
- 右侧栏显示"注册"和"登录"按钮

#### 2. 注册新用户
访问 `/register` 或点击"注册"按钮：
- 输入邮箱地址
- 设置用户名（3-50字符，只能包含字母、数字、下划线）
- 设置昵称（显示名称）
- 设置密码（至少6位）
- 确认密码
- 点击"注册"

注册成功后会自动：
- 创建用户账号
- 创建用户资料（profiles表）
- 分配默认头像
- 跳转到登录页面

#### 3. 登录
访问 `/login` 或点击"登录"按钮：
- 输入注册时的邮箱
- 输入密码
- 点击"登录"

登录成功后：
- 右侧栏显示个人信息（头像、昵称、用户名）
- 可以点击"发布"按钮创建帖子
- 发布的帖子会关联到用户账号

#### 4. 发布帖子
登录后访问 `/compose`：
- 输入文字内容
- 可选：上传音频/视频/图片
- 点击"发布"
- 帖子会显示用户的昵称和头像

#### 5. 退出登录
点击右侧栏的"退出登录"按钮

### 数据结构

#### profiles 表
```sql
- id: UUID (关联 auth.users)
- username: VARCHAR(50) UNIQUE (用户名)
- nickname: VARCHAR(100) (昵称)
- avatar_url: TEXT (头像URL)
- bio: TEXT (个人简介)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### posts 表（更新后）
```sql
- id: UUID
- content: TEXT
- user_id: UUID (关联用户)
- username: VARCHAR(50)
- author_name: VARCHAR(255) (昵称)
- author_avatar: TEXT
- created_at: TIMESTAMP
- likes_count: INTEGER
- media_url: TEXT
- media_type: VARCHAR(50)
- cover_image: TEXT
```

### 权限控制

#### Storage (media 桶)
- ✅ 所有人可以查看
- ✅ 所有人可以上传
- ✅ 所有人可以删除

#### Posts 表
- ✅ 所有人可以查看（SELECT）
- ✅ 仅认证用户可以创建（INSERT）
- ✅ 仅作者可以更新自己的帖子（UPDATE）
- ✅ 仅作者可以删除自己的帖子（DELETE）

#### Profiles 表
- ✅ 所有人可以查看
- ✅ 用户可以创建自己的资料
- ✅ 用户只能更新自己的资料

### 下一步功能（可扩展）

- [ ] 头像上传功能
- [ ] 个人主页（显示用户的所有帖子）
- [ ] 编辑个人资料
- [ ] 关注/粉丝系统
- [ ] 邮箱验证
- [ ] 密码重置
- [ ] 第三方登录（Google, GitHub等）

### 故障排除

**问题：注册后无法登录**
- 检查 Supabase 邮箱设置
- 确认邮箱验证设置（可以在 Supabase 控制台关闭邮箱验证）

**问题：发布帖子失败**
- 确保已执行 `auth-setup.sql`
- 检查 posts 表是否有 `user_id` 和 `username` 字段
- 检查 RLS 策略是否正确

**问题：用户资料未创建**
- 检查触发器是否正确创建
- 手动在 profiles 表中添加记录

### 测试账号

建议创建测试账号：
- 邮箱: test@example.com
- 用户名: testuser
- 昵称: 测试用户
- 密码: test123456

现在你的 MusicX 音乐社区已经拥有完整的用户认证系统了！🎉