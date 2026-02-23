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
            <body className="bg-white text-slate-900 antialiased min-h-screen">
                <AuthProvider>
                    {/* Outer centering wrapper — max 1280px, centered horizontally */}
                    <div className="max-w-[1280px] mx-auto w-full px-4 min-h-screen">
                        {/* Three-column flex layout */}
                        <div className="flex justify-center gap-0 min-h-screen">
                            {/* Left Sidebar — hidden on mobile/tablet */}
                            <LeftSidebar />

                            {/* Main Feed — visual center, fixed width */}
                            <main className="w-full max-w-[650px] flex-1 border-x border-slate-200 pb-20 lg:pb-4 bg-white min-h-screen">
                                {children}
                            </main>

                            {/* Right Sidebar — fixed width, hidden on tablet and below */}
                            <RightSidebar />
                        </div>
                    </div>

                    <BottomNav />
                    {/* AudioPlayer floating above BottomNav */}
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
