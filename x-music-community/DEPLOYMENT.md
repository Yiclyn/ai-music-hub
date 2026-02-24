# 部署指南

## Vercel 部署问题解决方案

### 最新修复 (Function Runtimes 错误)

如果遇到 "Function Runtimes must have a valid version" 错误：

1. **删除 vercel.json 文件** (已修复)
   - Next.js 项目通常不需要 `vercel.json`
   - Vercel 会自动检测和配置 Next.js 项目

2. **确保 package.json 正确**
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```

### 部署步骤

#### 1. 提交最新更改
```bash
git add .
git commit -m "Fix: Remove vercel.json and fix deployment configuration"
git push origin main
```

#### 2. Vercel 设置 (简化版)
在 Vercel 控制台中，只需要设置：
- **Framework Preset**: Next.js (自动检测)
- **Root Directory**: `x-music-community` (如果项目在子目录)
- 其他设置保持默认

#### 3. 环境变量 (可选)
```
NEXT_PUBLIC_SUPABASE_URL=https://fqwpvfihvesmifhwtleu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mvTEIeipVJOaE4AI3HypCg_X2CD5PSu
```

#### 4. 重新部署
- 推送代码后会自动触发部署
- 或在 Vercel 控制台点击 "Redeploy"

### 项目结构确认
```
x-music-community/
├── src/
│   ├── app/
│   │   ├── layout.tsx ✅
│   │   ├── page.tsx ✅
│   │   └── globals.css ✅
│   ├── components/ ✅
│   └── lib/ ✅
├── package.json ✅
├── next.config.mjs ✅
└── tsconfig.json ✅
```

### 验证部署成功
部署完成后应该看到：
- ✅ 三栏布局音乐社区界面
- ✅ 响应式移动端设计
- ✅ 音频/视频/图片帖子展示
- ✅ 实时交互功能

### 故障排除
1. **本地测试**: `npm run build` 确保构建成功
2. **清除缓存**: 在 Vercel 设置中清除构建缓存
3. **检查日志**: 查看 Vercel 部署日志获取详细错误信息

现在的配置应该可以正常部署了！