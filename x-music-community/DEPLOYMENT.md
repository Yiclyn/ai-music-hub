# 部署指南

## Vercel 部署问题解决方案

如果遇到 "Couldn't find any `pages` or `app` directory" 错误，请按以下步骤操作：

### 1. 确认项目结构
确保你的项目有以下结构：
```
x-music-community/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   └── lib/
├── package.json
├── next.config.mjs
├── vercel.json
└── tsconfig.json
```

### 2. 检查 Git 提交
确保所有文件都已正确提交到 Git：

```bash
# 检查状态
git status

# 添加所有文件
git add .

# 提交更改
git commit -m "Fix: Complete project structure for Vercel deployment"

# 推送到远程仓库
git push origin main
```

### 3. Vercel 部署设置

在 Vercel 控制台中：

1. **Framework Preset**: 选择 "Next.js"
2. **Root Directory**: 设置为 `x-music-community` (如果项目在子目录中)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

### 4. 环境变量设置

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://fqwpvfihvesmifhwtleu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mvTEIeipVJOaE4AI3HypCg_X2CD5PSu
```

### 5. 重新部署

1. 在 Vercel 控制台中点击 "Redeploy"
2. 或者推送新的提交触发自动部署

### 6. 常见问题排查

**问题**: 找不到 app 目录
**解决**: 确保 `src/app/layout.tsx` 和 `src/app/page.tsx` 文件存在且内容正确

**问题**: 构建失败
**解决**: 本地运行 `npm run build` 确保没有错误

**问题**: 类型错误
**解决**: 运行 `npm run lint` 检查并修复 ESLint 错误

### 7. 验证部署

部署成功后，访问你的 Vercel URL 应该能看到：
- 三栏布局的音乐社区界面
- 左侧导航栏
- 中间的帖子信息流
- 右侧的用户信息和热门话题
- 移动端响应式设计

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 技术支持

如果仍然遇到问题，请检查：
1. Node.js 版本 (推荐 18.x 或更高)
2. npm 版本是否最新
3. 网络连接是否正常
4. Vercel 账户权限是否正确