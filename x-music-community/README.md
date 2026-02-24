# MusicX - AI音乐社区

一个基于 Next.js 14 和 Supabase 的 Twitter/X 风格音乐社区平台。

## 功能特性

- 🎵 **音乐分享**: 支持音频、视频和图片内容发布
- 🎨 **精美UI**: 完全复刻 Twitter/X 的设计风格
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⚡ **实时更新**: 基于 Supabase 的实时数据同步
- 🎯 **AI音乐社区**: 专为音乐创作者和爱好者打造

## 技术栈

- **前端**: Next.js 14, React, TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase
- **图标**: Lucide React
- **部署**: Vercel (推荐)

## 设计特色

### 视觉设计
- 纯白背景 (#FFFFFF)
- 深黑文字 (#0F1419) 和灰色次要文字 (#536471)
- 电光紫主题色 (#8a2be2)
- 居中三栏布局 (最大宽度 1265px)

### 布局结构
- **左栏 (275px)**: Logo + 导航菜单
- **中栏 (600px)**: 主要内容信息流
- **右栏 (350px)**: 个人卡片和热门推荐

### 响应式适配
- 桌面端: 完整三栏布局
- 移动端: 单栏流式布局 + 底部导航

## 快速开始

1. 安装依赖:
\`\`\`bash
npm install
\`\`\`

2. 启动开发服务器:
\`\`\`bash
npm run dev
\`\`\`

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## Supabase 配置

项目已配置 Supabase 连接:
- URL: `https://fqwpvfihvesmifhwtleu.supabase.co`
- 匿名密钥: `sb_publishable_mvTEIeipVJOaE4AI3HypCg_X2CD5PSu`

## 项目结构

\`\`\`
src/
├── app/                 # Next.js App Router
├── components/          # React 组件
│   ├── Sidebar.tsx     # 左侧导航栏
│   ├── Feed.tsx        # 主要内容流
│   ├── RightPanel.tsx  # 右侧面板
│   ├── PostCard.tsx    # 帖子卡片
│   ├── PostComposer.tsx # 发帖组件
│   └── MobileNav.tsx   # 移动端导航
└── lib/
    └── supabase.ts     # Supabase 配置
\`\`\`

## 核心功能

- ✅ 帖子发布和展示
- ✅ 音频播放器 (带波形进度条)
- ✅ 视频播放 (16:9 比例)
- ✅ 图片展示
- ✅ 点赞、评论、转发、分享
- ✅ 实时数据更新
- ✅ 移动端适配

## 部署

推荐使用 Vercel 部署:

\`\`\`bash
npm run build
\`\`\`

项目已针对生产环境进行优化。