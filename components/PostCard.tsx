"use client";

import { MessageCircle, Repeat2, Heart, Share, Play, Pause } from "lucide-react";
import type { Post } from "./Feed";
import { useState, useRef, useEffect } from "react";

export default function PostCard({ post }: { post: Post }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Toggle audio playback
    const togglePlay = () => {
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

    // Format date simply to avoid external deps
    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return `${d.getMonth() + 1}月${d.getDate()}日`;
        } catch {
            return "刚刚";
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
                <div className="flex items-center text-sm md:text-base mb-1">
                    <span className="font-bold text-slate-900 mr-1 hover:underline">
                        {post.author_id.slice(0, 8)}
                    </span>
                    <span className="text-slate-500 mr-1">@{post.author_id.slice(0, 6)}</span>
                    <span className="text-slate-500">· {timeStr}</span>
                </div>

                {/* Text Content */}
                {post.description && (
                    <p className="text-[15px] text-slate-900 mb-3 whitespace-pre-wrap">
                        {post.description}
                    </p>
                )}

                {/* Media Player */}
                {post.media_type === "audio" && (
                    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={togglePlay}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition"
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5 fill-current" />
                                ) : (
                                    <Play className="h-5 w-5 fill-current ml-1" />
                                )}
                            </button>
                            <div className="flex flex-col w-full min-w-0">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                    {post.title || "Unknown Audio"}
                                </span>
                                <span className="text-xs text-slate-500">Audio Preview</span>
                                {/* Progress Bar */}
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
                    <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200">
                        <video
                            src={post.media_url}
                            controls
                            className="w-full h-auto bg-black"
                            preload="metadata"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between text-slate-500 mt-1 pr-6">
                    <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-50">
                            <MessageCircle className="h-[18px] w-[18px]" />
                        </div>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-green-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-green-50">
                            <Repeat2 className="h-[18px] w-[18px]" />
                        </div>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-pink-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-pink-50">
                            <Heart className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-xs">0</span>
                    </button>

                    <button className="group flex items-center gap-2 hover:text-blue-500 transition">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-50">
                            <Share className="h-[18px] w-[18px]" />
                        </div>
                    </button>
                </div>
            </div>
        </article>
    );
}
