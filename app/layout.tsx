import type { Metadata } from 'next'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import BottomNav from '@/components/layout/BottomNav'
import AudioPlayer from '@/components/AudioPlayer'
import './globals.css'

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
        <html lang="zh" className="dark">
            <body className="bg-background text-white antialiased">
                <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                    <LeftSidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 max-w-[600px] border-r border-gray-800/60 pb-20 lg:pb-24">
                        {children}
                    </main>

                    <RightSidebar />
                </div>

                <BottomNav />
                {/* AudioPlayer is now floating above BottomNav */}
                <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 pointer-events-none">
                    <div className="pointer-events-auto">
                        <AudioPlayer />
                    </div>
                </div>
            </body>
        </html>
    )
}

