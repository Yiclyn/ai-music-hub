'use client'

import Link from 'next/link'
import { Home, Compass, Bell, User, Sparkles, Feather } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthContext'

export default function LeftSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()

    const navLinks = [
        { name: '首页', href: '/', icon: Home },
        { name: '探索发现', href: '/popular', icon: Compass },
        { name: '消息通知', href: '/notifications', icon: Bell },
        { name: '个人主页', href: '/profile', icon: User },
    ]

    return (
        <aside className="sticky top-0 h-screen hidden sm:flex flex-col w-[80px] xl:w-[275px] shrink-0 pt-2 pb-8 md:pr-4 lg:pr-8 font-sans">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 p-3 w-fit rounded-full hover:bg-slate-200/50 transition mb-2">
                <Sparkles size={30} className="text-[#0F1419]" />
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 mt-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-5 p-3 rounded-full w-fit hover:bg-slate-200/50 transition group text-xl ${isActive ? 'font-bold text-[#0F1419]' : 'text-[#0F1419]'}`}
                        >
                            <link.icon size={28} className={isActive ? 'stroke-[2.5px]' : 'group-hover:scale-105 transition-transform'} />
                            <span className="hidden xl:inline">{link.name}</span>
                        </Link>
                    )
                })}

                {/* Post Button */}
                <div className="mt-4 pt-2">
                    <Link
                        href={user ? "/upload" : "/login"}
                        className="hidden xl:flex items-center justify-center w-[90%] py-3.5 rounded-full bg-[#1D9BF0] text-white font-bold text-[17px] hover:bg-[#1A8CD8] transition shadow-sm"
                    >
                        发布音乐
                    </Link>
                    <Link
                        href={user ? "/upload" : "/login"}
                        className="flex xl:hidden items-center justify-center w-12 h-12 rounded-full bg-[#1D9BF0] text-white font-bold hover:bg-[#1A8CD8] transition shadow-sm"
                    >
                        <Feather size={24} />
                    </Link>
                </div>
            </nav>

            {/* User Profile Hook (Optional, bottom) */}
            {user && (
                <div className="mt-auto flex items-center gap-3 p-3 hover:bg-slate-200/50 rounded-full cursor-pointer transition">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xl:block min-w-0">
                        <p className="font-bold text-[#0F1419] text-sm truncate">{user.email?.split('@')[0] || 'User'}</p>
                        <p className="text-slate-500 text-[15px] truncate">@{user.email?.split('@')[0]}</p>
                    </div>
                </div>
            )}
        </aside>
    )
}
