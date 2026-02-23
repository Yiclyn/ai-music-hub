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
            <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
                <AuthProvider>
                    <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                        <LeftSidebar />

                        {/* Main Content Area */}
                        <main className="flex-1 w-[650px] max-w-[650px] border-r border-slate-200 pb-20 lg:pb-24 bg-slate-50 shrink-0">
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
                </AuthProvider>
            </body>
        </html>
    )
}
