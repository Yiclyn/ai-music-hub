'use client'

import Link from 'next/link'
import { Home, Search, PlusSquare, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
    const pathname = usePathname()

    const tabs = [
        { name: '首页', href: '/', icon: Home },
        { name: '搜索', href: '/search', icon: Search },
        { name: '发布', href: '/upload', icon: PlusSquare },
        { name: '我', href: '/profile', icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800/80 z-[60] flex lg:hidden items-center justify-around px-2">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-white' : 'text-gray-500'} active:scale-95 transition-transform`}
                    >
                        <tab.icon size={26} className={isActive ? 'stroke-[2.5px]' : ''} />
                    </Link>
                )
            })}
        </div>
    )
}
