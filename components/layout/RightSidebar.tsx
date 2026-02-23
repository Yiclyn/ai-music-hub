'use client'

import { Search, Flame, UserPlus } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'
import Link from 'next/link'

export default function RightSidebar() {
    const { user, loading } = useAuth()

    return (
        <aside className="sticky top-0 h-screen hidden lg:flex flex-col w-[350px] pt-1 pl-4 font-sans">

            {/* Universal Search Bar */}
            <div className="relative group mb-4 mt-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-500 group-focus-within:text-[#1D9BF0] transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="搜索"
                    className="w-full bg-[#EFF3F4] border-none rounded-full py-3.5 pl-12 pr-4 text-[#0F1419] text-[15px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1D9BF0] transition-all"
                />
            </div>

            {/* Auth / Profile Card */}
            <div className="bg-[#F7F9F9] rounded-2xl p-4 mb-4 border border-[#EFF3F4]">
                {loading ? (
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ) : user ? (
                    <div className="flex flex-col gap-2">
                        <p className="font-extrabold text-[#0F1419] text-xl">已登录</p>
                        <p className="text-[#536471] text-[15px]">欢迎回来, @{user.email?.split('@')[0]}</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <h3 className="font-extrabold text-[#0F1419] text-[20px] mb-2 leading-tight">初次使用 AI Music Hub？</h3>
                        <p className="text-[#536471] text-[13px] mb-4">立即注册，获取属于你的个性化时间线！</p>
                        <Link
                            href="/login"
                            className="block w-full py-2 rounded-full border border-slate-300 bg-white text-[#0F1419] font-bold text-[15px] hover:bg-slate-100 transition text-center mb-2"
                        >
                            创建账号
                        </Link>
                        <p className="text-[13px] text-[#536471]">
                            已有账号？ <Link href="/login" className="text-[#1D9BF0] hover:underline">登录</Link>
                        </p>
                    </div>
                )}
            </div>

            {/* Trending Block */}
            <div className="bg-[#F7F9F9] rounded-2xl pt-4 pb-2 border border-[#EFF3F4] flex-1">
                <h2 className="font-extrabold text-[20px] text-[#0F1419] mb-4 px-4">
                    流行趋势
                </h2>

                <div className="space-y-0">
                    {/* Mock Trend Item */}
                    <div className="cursor-pointer hover:bg-slate-200/50 px-4 py-3 transition">
                        <div className="flex justify-between items-center text-[13px] text-[#536471] mb-0.5">
                            <span>音乐 • 娱乐</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-[#0F1419] text-[15px] mb-0.5">#赛博朋克音轨</p>
                        <p className="text-[13px] text-[#536471]">12.5k 帖子</p>
                    </div>

                    <div className="cursor-pointer hover:bg-slate-200/50 px-4 py-3 transition">
                        <div className="flex justify-between items-center text-[13px] text-[#536471] mb-0.5">
                            <span>科技 • 热门</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-[#0F1419] text-[15px] mb-0.5">数字极光可视化</p>
                        <p className="text-[13px] text-[#536471]">8,230 帖子</p>
                    </div>
                </div>

                <button className="text-[#1D9BF0] hover:bg-slate-200/50 px-4 py-3 w-full text-left text-[15px] transition rounded-b-2xl mt-2">
                    显示更多
                </button>
            </div>

            {/* Footer Text */}
            <div className="text-[13px] text-[#536471] mt-4 px-4 flex flex-wrap gap-x-3 gap-y-1 mb-6">
                <a href="#" className="hover:underline">服务条款</a>
                <a href="#" className="hover:underline">隐私政策</a>
                <a href="#" className="hover:underline">Cookie 政策</a>
                <span>© 2026 AI Music Hub.</span>
            </div>

        </aside>
    )
}
