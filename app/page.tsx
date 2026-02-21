import { Upload, Play, Disc } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24 relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content Container */}
            <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-12 text-center mt-12 md:mt-20 flex-grow">

                {/* Title Section */}
                <div className="space-y-4 animate-float">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-sm font-medium text-purple-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        系统即将上线
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 pb-2">
                        AI Music Hub
                    </h1>
                    <p className="text-2xl md:text-3xl font-light text-slate-300 tracking-wide">
                        - 建设中 -
                    </p>
                </div>

                {/* Upload & Player Section (Glassmorphism card) */}
                <div className="w-full max-w-lg p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8 mt-8">

                    {/* Upload Button */}
                    <button className="group relative w-full flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-purple-300" />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-lg font-semibold text-white">上传音频样本</h3>
                            <p className="text-sm text-slate-400 mt-1">支持 MP3, WAV 等格式 (演示)</p>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <div className="h-px flex-1 bg-white/10" />
                        <span>示例预览</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* Placeholder Player */}
                    <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                        <button className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                        </button>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-200">AI 生成示例曲目</span>
                                <span className="text-slate-400 text-xs">0:00 / 3:45</span>
                            </div>
                            {/* Fake Progress Bar */}
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-slow relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]" />
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 animate-[spin_4s_linear_infinite]">
                            <Disc className="w-8 h-8 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="z-10 w-full text-center mt-auto pt-10 pb-4">
                <p className="text-slate-400 font-medium tracking-wide">
                    未来这里将是 AI 音乐创作的交流社区
                </p>
            </footer>
        </main>
    );
}
