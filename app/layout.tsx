import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Music Hub",
    description: "AI Music Creation Community",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="mx-auto flex w-full max-w-[1265px] justify-center">
                    {/* Left Sidebar - Hidden on mobile, shows on sm and up */}
                    <div className="hidden sm:flex w-[88px] xl:w-[275px] shrink-0">
                        <LeftSidebar />
                    </div>

                    {/* Main Feed Content - Max width 600px */}
                    <main className="w-full sm:max-w-[600px] min-h-screen border-x border-slate-100 flex-1">
                        {children}
                    </main>

                    {/* Right Sidebar - Hidden on smaller screens, shows on lg and up */}
                    <div className="hidden lg:block w-[350px] shrink-0">
                        <RightSidebar />
                    </div>
                </div>
            </body>
        </html>
    );
}
