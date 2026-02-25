'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function RightPanel() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="w-[350px] h-screen sticky top-0 p-4 hidden lg:block">
      <div className="space-y-4">
        {/* User Card */}
        {user && profile ? (
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={profile.avatar_url}
                alt={profile.nickname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-primary">{profile.nickname}</div>
                <div className="text-sm text-secondary">@{profile.username}</div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="font-semibold">0</div>
                <div className="text-secondary">关注</div>
              </div>
              <div>
                <div className="font-semibold">0</div>
                <div className="text-secondary">粉丝</div>
              </div>
              <div>
                <div className="font-semibold">0</div>
                <div className="text-secondary">作品</div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full mt-4 border border-slate-300 rounded-full py-2 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              退出登录
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-2">加入音乐社区</h3>
            <p className="text-secondary text-sm mb-4">
              发现最新音乐，分享你的创作
            </p>
            <div className="space-y-2">
              <Link href="/register" className="block">
                <button className="w-full bg-primary text-white rounded-full py-2 font-semibold hover:bg-primary/90 transition-colors">
                  注册
                </button>
              </Link>
              <Link href="/login" className="block">
                <button className="w-full border border-slate-300 rounded-full py-2 font-semibold hover:bg-slate-50 transition-colors">
                  登录
                </button>
              </Link>
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