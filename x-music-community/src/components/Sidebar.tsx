'use client'

import { Home, Search, User, Plus } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="w-[275px] h-screen sticky top-0 p-4 border-r border-slate-100">
      <div className="flex flex-col space-y-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">
          MusicX
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/" className="flex items-center space-x-4 p-3 rounded-full hover:bg-slate-50 transition-colors">
            <Home size={24} />
            <span className="text-xl">首页</span>
          </Link>
          
          <Link href="/explore" className="flex items-center space-x-4 p-3 rounded-full hover:bg-slate-50 transition-colors">
            <Search size={24} />
            <span className="text-xl">探索</span>
          </Link>
          
          <Link href="/profile" className="flex items-center space-x-4 p-3 rounded-full hover:bg-slate-50 transition-colors">
            <User size={24} />
            <span className="text-xl">个人中心</span>
          </Link>
        </nav>
        
        {/* Post Button */}
        <button className="bg-primary text-white rounded-full py-3 px-8 font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={20} className="inline mr-2" />
          发布
        </button>
      </div>
    </div>
  )
}