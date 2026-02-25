'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RightPanel() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="w-[350px] h-screen sticky top-0 p-4 hidden lg:block">
      <div className="space-y-4">
        {/* User Card */}
        {user ? (
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold text-primary">音乐爱好者</div>
                <div className="text-sm text-secondary">@musiclover</div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="font-semibold">128</div>
                <div className="text-secondary">关注</div>
              </div>
              <div>
                <div className="font-semibold">1.2K</div>
                <div className="text-secondary">粉丝</div>
              </div>
              <div>
                <div className="font-semibold">89</div>
                <div className="text-secondary">作品</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-2">加入音乐社区</h3>
            <p className="text-secondary text-sm mb-4">
              发现最新音乐，分享你的创作
            </p>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-primary/90 transition-colors">
                注册
              </button>
              <button className="w-full border border-slate-300 rounded-full py-2 font-semibold hover:bg-slate-50 transition-colors">
                登录
              </button>
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="bg-slate-50 rounded-2xl p-4">
          <h3 className="font-bold text-lg mb-4">热门话题</h3>
          <div className="space-y-3">
            <div className="hover:bg-slate-100 p-2 rounded cursor-pointer">
              <div className="text-sm text-secondary">音乐 · 热门</div>
              <div className="font-semibold">#AI音乐创作</div>
              <div className="text-sm text-secondary">12.5K 讨论</div>
            </div>
            <div className="hover:bg-slate-100 p-2 rounded cursor-pointer">
              <div className="text-sm text-secondary">流行 · 趋势</div>
              <div className="font-semibold">#电子音乐</div>
              <div className="text-sm text-secondary">8.9K 讨论</div>
            </div>
            <div className="hover:bg-slate-100 p-2 rounded cursor-pointer">
              <div className="text-sm text-secondary">创作 · 热门</div>
              <div className="font-semibold">#独立音乐人</div>
              <div className="text-sm text-secondary">5.2K 讨论</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}