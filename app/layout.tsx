import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
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
            <body className="bg-background text-white antialiased pb-20 pt-16">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <AudioPlayer />
            </body>
        </html>
    )
}

