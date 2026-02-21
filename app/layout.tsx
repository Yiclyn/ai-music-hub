import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'AI Music Hub',
    description: 'AI Music Hub - 建设中',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh">
            <body>{children}</body>
        </html>
    )
}
