'use client'

import Link from 'next/link'
import { Home, Compass, Bell, User, Sparkles } from 'lucide-react'
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
        <aside className="sticky top-0 h-screen hidden lg:flex flex-col w-[275px] pt-4 pb-8 pr-6 font-sans">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 p-3 w-fit rounded-full hover:bg-slate-200 transition mb-4">
                <Sparkles size={32} className="text-blue-600" />
                <span className="text-2xl font-black tracking-tight text-slate-900 hidden xl:block">MusicHub</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 p-3 rounded-full w-fit hover:bg-slate-200 transition group text-xl ${isActive ? 'font-bold text-slate-900' : 'text-slate-500'}`}
                        >
                            <link.icon size={26} className={isActive ? 'stroke-[2.5px]' : 'group-hover:scale-105 transition-transform'} />
                            <span className="hidden xl:inline">{link.name}</span>
                        </Link>
                    )
                })}
            </nav>

        </aside>
    )
}
