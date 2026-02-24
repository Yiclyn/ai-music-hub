import Link from "next/link";
import { Home, Hash, User, Feather } from "lucide-react";

export default function LeftSidebar() {
    const navItems = [
        { label: "首页", icon: Home, href: "/" },
        { label: "探索", icon: Hash, href: "/" },
        { label: "个人", icon: User, href: "/" },
    ];

    return (
        <div className="fixed top-0 flex h-screen w-[88px] flex-col justify-between py-4 xl:w-[275px]">
            <div className="flex flex-col items-center xl:items-start xl:px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-slate-100 transition xl:w-fit xl:px-4 xl:py-3 xl:h-auto"
                >
                    <span className="text-xl font-bold text-slate-900 hidden xl:inline">
                        AI Music Hub
                    </span>
                    <span className="text-xl font-bold text-slate-900 xl:hidden">
                        🎵
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="mt-4 flex flex-col space-y-2 w-full items-center xl:items-start">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-4 rounded-full p-3 hover:bg-slate-100 transition xl:px-4 xl:py-3 w-fit"
                        >
                            <item.icon className="h-7 w-7 transition-transform group-hover:scale-110" />
                            <span className="hidden text-xl font-medium xl:inline">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Post Button */}
                <div className="mt-8 flex w-full justify-center xl:px-0">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition xl:h-14 xl:w-11/12 xl:justify-center">
                        <Feather className="h-6 w-6 xl:hidden" />
                        <span className="hidden text-lg font-bold xl:inline">发帖</span>
                    </button>
                </div>
            </div>

            {/* User Profile Hook (Placeholder) */}
            <div className="mb-4 flex cursor-pointer items-center justify-center rounded-full p-3 hover:bg-slate-100 transition xl:px-4 xl:py-3 mx-auto w-fit xl:w-11/12 xl:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-300 shrink-0"></div>
                    <div className="hidden flex-col xl:flex text-left">
                        <span className="text-sm font-bold text-slate-900">User</span>
                        <span className="text-sm text-slate-500">@user</span>
                    </div>
                </div>
                <div className="hidden xl:block text-slate-900 font-bold">...</div>
            </div>
        </div>
    );
}
