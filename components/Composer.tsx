"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import MediaUpload from "./MediaUpload";
import { Loader2 } from "lucide-react";

export default function Composer() {
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"audio" | "video" | null>(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null); // Just for UI display before submission

    const handleUploadSuccess = (url: string, type: "audio" | "video") => {
        setMediaUrl(url);
        setMediaType(type);
    };

    const handleSubmit = async () => {
        if (!content.trim() && !mediaUrl) return;
        if (!mediaUrl || !mediaType) {
            alert("请上传音频或视频！(Media is required)");
            return;
        }

        setIsSubmitting(true);

        try {
            const title = content.trim() ? content.substring(0, 50) : "Untitled";
            const { error } = await supabase.from("posts").insert([
                {
                    title,
                    description: content,
                    media_url: mediaUrl,
                    media_type: mediaType,
                    author_id: "user_test", // Since auth is not implemented yet
                },
            ]);

            if (error) {
                throw error;
            }

            // Reset on success
            setContent("");
            setMediaUrl(null);
            setMediaType(null);
            setMediaFile(null);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex border-b border-slate-100 p-4">
            {/* Avatar */}
            <div className="mr-4 shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-300"></div>
            </div>

            <div className="flex w-full flex-col pt-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="有什么新鲜事？上传音乐或视频分享吧！"
                    className="w-full resize-none border-none bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-500"
                    rows={3}
                    disabled={isSubmitting}
                />

                {mediaFile && (
                    <div className="my-2 rounded-2xl border border-slate-100 p-3 bg-slate-50 relative">
                        <span className="text-sm font-medium text-slate-700">
                            {mediaType === "audio" ? "🎵 Audio" : "🎬 Video"}: {mediaFile.name}
                        </span>
                        {isUploadingMedia && (
                            <span className="ml-2 text-xs text-blue-500 animate-pulse">
                                上传中...
                            </span>
                        )}
                        {!isUploadingMedia && mediaUrl && (
                            <span className="ml-2 text-xs text-green-500">
                                上传完成
                            </span>
                        )}
                        {!isUploadingMedia && mediaUrl && (
                            <button
                                onClick={() => {
                                    setMediaUrl(null);
                                    setMediaType(null);
                                    setMediaFile(null);
                                }}
                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}

                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-blue-500">
                        <MediaUpload
                            onUploadSuccess={handleUploadSuccess}
                            isUploading={isUploadingMedia}
                            setIsUploading={setIsUploadingMedia}
                            mediaFile={mediaFile}
                            setMediaFile={setMediaFile}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={(!content.trim() && !mediaUrl) || isUploadingMedia || isSubmitting || !mediaUrl}
                        className="flex h-9 items-center justify-center rounded-full bg-blue-500 px-4 font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "发帖"}
                    </button>
                </div>
            </div>
        </div>
    );
}
