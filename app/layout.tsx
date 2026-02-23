import type { Metadata } from 'next'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import BottomNav from '@/components/layout/BottomNav'
import AudioPlayer from '@/components/AudioPlayer'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthContext'

export const metadata: Metadata = {
    title: 'AI Music Hub', // "AI 音乐创作交流社区" matches user request
    description: 'AI Music Hub - AI 音乐创作交流社区',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh">
            <body className="bg-[#FFFFFF] text-[#0F1419] antialiased min-h-screen">
                <AuthProvider>
                    {/* Global Centered Wrapper: X's typical wide breakpoint centers content up to 1265px */}
                    <div className="min-h-screen flex justify-center w-full bg-[#FFFFFF]">
                        {/* 3-Column Layout Row */}
                        <div className="flex justify-between w-full max-w-[1265px] h-full min-h-screen">

                            {/* Left Sidebar: 275px fixed strictly on desktop (lg) */}
                            <header className="hidden sm:flex w-[88px] xl:w-[275px] shrink-0 flex-col items-end xl:items-start px-2 xl:px-4">
                                <LeftSidebar />
                            </header>

                            {/* Middle Feed: 600px fixed width, borders on left/right matching #EFF3F4 */}
                            <main className="w-full sm:w-[600px] shrink-0 border-x-layout pb-20 sm:pb-4 min-h-screen">
                                {/* Outer centering wrapper — max 1265px, centered */}
                                <div className="max-w-[1265px] mx-auto w-full flex justify-center lg:justify-between min-h-screen">

                                    {/* Left Sidebar Container */}
                                    <div className="hidden sm:block shrink-0 px-2 lg:px-0">
                                        <LeftSidebar />
                                    </div>

                                    {/* Main Feed Column */}
                                    <main className="w-full sm:max-w-[600px] flex-1 border-x border-[#EFF3F4] bg-[#FFFFFF] pb-20 lg:pb-0 shrink-0 min-h-screen">
                                        {children}
                                    </main>

                                    {/* Right Sidebar Container */}
                                    <div className="hidden lg:block shrink-0 mr-2 xl:mr-4">
                                        <RightSidebar />
                                    </div>

                                </div>

                                <BottomNav />
                                <AudioPlayer />
                            </AuthProvider>
                        </body>
                    </html>
                    )
}
