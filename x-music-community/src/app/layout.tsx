import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicX - AI音乐社区",
  description: "发现音乐，分享创作，连接音乐人",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-white text-primary">
        {children}
      </body>
    </html>
  );
}
