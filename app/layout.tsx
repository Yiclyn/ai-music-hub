import type { Metadata } from 'next'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import BottomNav from '@/components/layout/BottomNav'
import AudioPlayer from '@/components/AudioPlayer'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthContext'

export const metadata: Metadata = {
    title: 'AI Music Hub',
    description: 'AI Music Hub - AI 音乐创作交流社区',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh">
            <body className="bg-slate-100 text-slate-900 antialiased min-h-screen">
                <AuthProvider>
                    {/* 全局居中容器：内容区最大 1280px，水平居中 */}
                    <div className="min-h-screen flex justify-center">
                        {/* 三栏并排，整体居中 */}
                        <div className="flex w-full max-w-[1280px]">

                            {/* 左侧导航：桌面端固定宽度，移动端隐藏 */}
                            <LeftSidebar />

                            {/* 中间内容流：固定 650px，两侧有分隔线 */}
                            <main className="flex-1 min-w-0 max-w-[650px] border-x border-slate-200 bg-white pb-20 lg:pb-4 min-h-screen">
                                {children}
                            </main>

                            {/* 右侧信息栏：桌面端固定宽度，移动端隐藏 */}
                            <RightSidebar />
                        </div>
                    </div>

                    <BottomNav />
                    {/* 悬浮音频播放器 */}
                    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 pointer-events-none">
                        <div className="pointer-events-auto">
                            <AudioPlayer />
                        </div>
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
