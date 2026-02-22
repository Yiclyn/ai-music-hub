import Link from 'next/link'
import { Upload, Home, TrendingUp, User } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur border-b border-white/10 z-50">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-purple to-aurora-green">
                    AI Music Hub
                </Link>
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        <Home size={20} className="md:hidden" />
                        <span className="hidden md:inline">首页</span>
                    </Link>
                    <Link href="/popular" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        <TrendingUp size={20} className="md:hidden" />
                        <span className="hidden md:inline">热门</span>
                    </Link>
                    <Link href="/upload" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        <Upload size={20} className="md:hidden" />
                        <span className="hidden md:inline">上传</span>
                    </Link>
                    <Link href="/profile" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        <User size={20} className="md:hidden" />
                        <span className="hidden md:inline">我的</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
