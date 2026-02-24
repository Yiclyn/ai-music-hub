import React from "next";

export default function RightSidebar() {
    return (
        <div className="fixed top-0 flex h-screen w-[350px] flex-col py-4 px-6 space-y-6">
            {/* Search Placeholder */}
            <div className="sticky top-0 bg-white/90 pb-2 z-10 backdrop-blur-md">
                <div className="flex w-full items-center rounded-full bg-slate-100 px-4 py-3">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="搜索..."
                        className="ml-3 w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Login / Auth Placeholder */}
            <div className="rounded-2xl border border-slate-100 p-4 shadow-sm bg-white">
                <h2 className="text-xl font-bold text-slate-900 mb-2">New to X?</h2>
                <p className="text-sm text-slate-500 mb-4">
                    Sign up now to get your own personalized timeline!
                </p>
                <button className="w-full rounded-full bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 transition mb-3">
                    Create account
                </button>
                <p className="text-xs text-slate-500">
                    By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                </p>
            </div>

            {/* Trending Placeholder */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 hidden lg:block">
                <h2 className="text-xl font-bold text-slate-900 mb-4">What's happening</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex cursor-pointer flex-col hover:bg-slate-100 p-2 -mx-2 rounded transition">
                            <span className="text-xs text-slate-500">Trending in Tech</span>
                            <span className="font-bold text-slate-900">#AIRevolution</span>
                            <span className="text-xs text-slate-500">54.2k posts</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
