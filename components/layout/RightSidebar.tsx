'use client'

import { Search, Flame } from 'lucide-react'

export default function RightSidebar() {
    return (
        <aside className="sticky top-0 h-screen hidden lg:block w-[350px] pt-4 pl-6 font-sans">

            {/* Universal Search Bar */}
            <div className="relative group mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500 group-focus-within:text-electric-purple transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="搜索音乐、视频或创作者"
                    className="w-full bg-[#16181C] border border-transparent rounded-full py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-electric-purple focus:bg-black transition-all"
                />
            </div>

            {/* Trending Block */}
            <div className="bg-[#16181C] rounded-2xl p-4 border border-gray-800/40">
                <h2 className="font-extrabold text-xl text-white mb-4 flex items-center gap-2">
                    发现趋势 <Flame className="text-orange-500" size={20} />
                </h2>

                <div className="space-y-4">
                    {/* Mock Trend Item */}
                    <div className="cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold mb-1">
                            <span>合成器波 • 流行</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-white text-[15px] mb-1">#赛博朋克音轨</p>
                        <p className="text-xs text-gray-500">12.5k 帖子</p>
                    </div>

                    <div className="cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold mb-1">
                            <span>AI 生成视频 • 热门</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-white text-[15px] mb-1">数字极光可视化</p>
                        <p className="text-xs text-gray-500">8,230 帖子</p>
                    </div>

                    <div className="cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold mb-1">
                            <span>氛围电子音乐 • 新兴</span>
                            <span>···</span>
                        </div>
                        <p className="font-bold text-white text-[15px] mb-1">#睡眠冥想</p>
                        <p className="text-xs text-gray-500">3,492 帖子</p>
                    </div>
                </div>

                <button className="text-electric-purple hover:underline text-sm font-normal mt-4 block p-2 -mx-2">
                    显示更多
                </button>
            </div>

            {/* Footer Text */}
            <div className="text-[13px] text-gray-500 mt-6 px-4 flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:underline">服务条款</a>
                <a href="#" className="hover:underline">隐私政策</a>
                <a href="#" className="hover:underline">Cookie 政策</a>
                <a href="#" className="hover:underline">可访问性</a>
                <a href="#" className="hover:underline">© 2026 AI Music Hub.</a>
            </div>

        </aside>
    )
}
