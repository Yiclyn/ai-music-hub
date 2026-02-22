'use client'

import Link from 'next/link'
import { Home, Compass, Bell, User, PlusCircle, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function LeftSidebar() {
    const pathname = usePathname()

    const navLinks = [
        { name: '首页', href: '/', icon: Home },
        { name: '探索发现', href: '/popular', icon: Compass },
        { name: '消息通知', href: '/notifications', icon: Bell },
        { name: '个人主页', href: '/profile', icon: User },
    ]

    return (
        <aside className="sticky top-0 h-screen hidden lg:flex flex-col w-[275px] pt-4 pb-8 pr-6 border-r border-gray-800/60 font-sans">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 p-3 w-fit rounded-full hover:bg-white/10 transition mb-4">
                <Sparkles size={32} className="text-electric-purple" />
                <span className="text-2xl font-black tracking-tight text-white hidden xl:block">MusicHub</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 p-3 rounded-full w-fit hover:bg-white/10 transition group text-xl ${isActive ? 'font-bold text-white' : 'text-gray-200'}`}
                        >
                            <link.icon size={26} className={isActive ? 'stroke-[2.5px]' : 'group-hover:scale-105 transition-transform'} />
                            <span className="hidden xl:inline">{link.name}</span>
                        </Link>
                    )
                })}

                {/* Action Button */}
                <div className="pt-4">
                    <Link
                        href="/upload"
                        className="flex items-center justify-center gap-2 p-4 rounded-full bg-gradient-to-r from-electric-purple to-aurora-green text-white font-bold text-[17px] hover:opacity-90 transition shadow-lg shadow-electric-purple/20 w-14 h-14 xl:w-[220px]"
                    >
                        <PlusCircle size={24} className="xl:hidden" />
                        <span className="hidden xl:inline">发布作品</span>
                    </Link>
                </div>
            </nav>

            {/* Basic Profile Pill */}
            <div className="mt-auto">
                <button className="flex items-center gap-3 p-3 rounded-full hover:bg-white/10 transition w-full text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-purple to-pink-500 flex items-center justify-center font-bold text-white shrink-0">
                        GU
                    </div>
                    <div className="hidden xl:block flex-1 truncate">
                        <p className="font-bold text-white text-sm">Guest User</p>
                        <p className="text-gray-500 text-sm">@guest_user</p>
                    </div>
                </button>
            </div>

        </aside>
    )
}
