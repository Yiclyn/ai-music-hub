"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Composer from "./Composer";
import PostCard from "./PostCard";

export type Post = {
    id: string;
    title: string;
    description: string | null;
    media_url: string;
    media_type: "audio" | "video";
    cover_url: string | null;
    author_id: string;
    created_at: string;
};

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // Initial fetch
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
            } else {
                setPosts((data as Post[]) || []);
            }
        };

        fetchPosts();

        // Subscribe to realtime changes
        const channel = supabase
            .channel("supabase_realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "posts" },
                (payload) => {
                    setPosts((prevPosts) => [payload.new as Post, ...prevPosts]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <>
            {/* Sticky Top Header */}
            <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900 px-4 py-3">主页</h1>
            </div>

            {/* Composer Section */}
            <Composer />

            {/* Feed List */}
            <div className="flex flex-col">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
                {posts.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        暂时没有帖子，来发第一条吧！
                    </div>
                )}
            </div>
        </>
    );
}
