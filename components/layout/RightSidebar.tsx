'use client'

import { Search, Flame, Upload } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'
import Link from 'next/link'

export default function RightSidebar() {
    const { user, loading } = useAuth()

    return (
        <aside className="sticky top-0 h-screen hidden lg:flex flex-col w-[350px] pt-4 pl-6 font-sans">

            {/* Universal Search Bar */}
            <div className="relative group mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="搜索音乐、视频或创作者"
                    className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                />
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
                {loading ? (
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ) : user ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 truncate">{user.email?.split('@')[0] || 'User'}</p>
                                <p className="text-slate-500 text-sm truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-center border-y border-slate-100 py-3">
                            <div>
                                <p className="font-bold text-slate-900">12</p>
                                <p className="text-slate-500 text-xs">作品</p>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">834</p>
                                <p className="text-slate-500 text-xs">粉丝</p>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">142</p>
                                <p className="text-slate-500 text-xs">关注</p>
                            </div>
                        </div>
                        <Link
                            href="/upload"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition"
                        >
                            <Upload size={18} />
                            发布作品
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900 text-lg mb-2">加入社区</h3>
                        <p className="text-slate-500 text-sm mb-4">连接 AI 音乐创作者，分享你的灵感与作品。</p>
                        <Link
                            href="/login"
                            className="block w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-sm"
                        >
                            登录 / 注册
                        </Link>
                    </div>
                )}
            </div>

            {/* Trending Block */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex-1">
                <h2 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    发现趋势 <Flame className="text-orange-500" size={20} />
                </h2>

                <div className="space-y-4">
                    {/* Mock Trend Item */}
                    <div className="cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition">
                        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                            <span>合成器波 • 流行</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-slate-900 text-[15px] mb-1">#赛博朋克音轨</p>
                        <p className="text-xs text-slate-500">12.5k 帖子</p>
                    </div>

                    <div className="cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition">
                        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1">
                            <span>AI 生成视频 • 热门</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-slate-900 text-[15px] mb-1">数字极光可视化</p>
                        <p className="text-xs text-slate-500">8,230 帖子</p>
                    </div>
                </div>

                <button className="text-blue-600 hover:underline text-sm font-normal mt-4 block p-2 -mx-2">
                    显示更多
                </button>
            </div>

            {/* Footer Text */}
            <div className="text-[13px] text-slate-400 mt-6 px-4 flex flex-wrap gap-x-3 gap-y-1 mb-8">
                <a href="#" className="hover:underline">服务条款</a>
                <a href="#" className="hover:underline">隐私政策</a>
                <a href="#" className="hover:underline">Cookie 政策</a>
                <a href="#" className="hover:underline">© 2026 AI Music Hub.</a>
            </div>

        </aside>
    )
}
