"use client";

import { MessageCircle, Repeat2, Heart, BarChart2, Share, Play, Pause } from "lucide-react";
import type { Post } from "./Feed";
import { useState, useRef, useEffect } from "react";

export default function PostCard({ post }: { post: Post }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Toggle audio playback
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Update progress bar
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    // Format date simply
    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return `${d.getMonth() + 1}月${d.getDate()}日`;
        } catch {
            return "Just now";
        }
    };
    const timeStr = formatDate(post.created_at);

    return (
        <article className="flex cursor-pointer border-b border-slate-100 p-4 hover:bg-slate-50 transition">
            {/* Avatar */}
            <div className="mr-3 shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-300"></div>
            </div>

            <div className="flex w-full flex-col">
                {/* Header */}
                <div className="flex items-center text-[15px] mb-1">
                    <span className="font-bold text-slate-900 mr-1 hover:underline truncate">
                        {post.author_id}
                    </span>
                    <span className="text-slate-500 mr-1 truncate">@{post.author_id}</span>
                    <span className="text-slate-500">· {timeStr}</span>
                </div>

                {/* Text Content */}
                {post.description && (
                    <p className="text-[15px] text-slate-900 mb-3 whitespace-pre-wrap leading-normal">
                        {post.description}
                    </p>
                )}

                {/* Media Player */}
                {post.media_type === "audio" && (
                    <div className="mb-3 w-full rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm hover:bg-blue-600 transition"
                            >
                                {isPlaying ? (
                                    <Pause className="h-4 w-4 fill-current" />
                                ) : (
                                    <Play className="h-4 w-4 fill-current ml-0.5" />
                                )}
                            </button>
                            <div className="flex flex-col w-full min-w-0 justify-center">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                    {post.title || "Untitled Track"}
                                </span>
                                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-100"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <audio ref={audioRef} src={post.media_url} preload="metadata" />
                    </div>
                )}

                {post.media_type === "video" && (
                    <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <video
                            src={post.media_url}
                            controls
                            className="w-full max-h-[400px] object-cover bg-black"
                            preload="metadata"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between text-slate-500 mt-1 max-w-[425px]">
                    <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-50 transition">
                            <MessageCircle className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-xs group-hover:text-blue-500">0</span>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-green-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-green-50 transition">
                            <Repeat2 className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-xs group-hover:text-green-500">0</span>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-pink-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-pink-50 transition">
                            <Heart className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-xs group-hover:text-pink-500">0</span>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-50 transition">
                            <BarChart2 className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-xs group-hover:text-blue-500">0</span>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-50 transition">
                            <Share className="h-[18px] w-[18px]" />
                        </div>
                    </button>
                </div>
            </div>
        </article>
    );
}
