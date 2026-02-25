'use client'

import { Home, Search, User, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function MobileNav() {
  const router = useRouter()
  const { user } = useAuth()

  const handlePostClick = () => {
    if (!user) {
      alert('请先登录后再发布内容')
      router.push('/login')
    } else {
      router.push('/compose')
    }
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
      <div className="flex justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center p-2">
          <Home size={24} />
          <span className="text-xs mt-1">首页</span>
        </Link>
        
        <Link href="/explore" className="flex flex-col items-center p-2">
          <Search size={24} />
          <span className="text-xs mt-1">探索</span>
        </Link>
        
        <button onClick={handlePostClick} className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-xs mt-1">发布</span>
        </button>
        
        <Link href="/profile" className="flex flex-col items-center p-2">
          <User size={24} />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </div>
    </div>
  )
}