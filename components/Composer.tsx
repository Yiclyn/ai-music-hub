"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import MediaUpload from "./MediaUpload";
import { Loader2, Smile, Calendar, MapPin, BarChart2 } from "lucide-react";

export default function Composer() {
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"audio" | "video" | null>(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    const handleUploadSuccess = (url: string, type: "audio" | "video") => {
        setMediaUrl(url);
        setMediaType(type);
    };

    const handleSubmit = async () => {
        if (!content.trim() && !mediaUrl) return;
        
        setIsSubmitting(true);

        try {
            const title = content.trim() ? content.substring(0, 50) : "Untitled";
            const { error } = await supabase.from("posts").insert([
                {
                    title,
                    description: content,
                    media_url: mediaUrl,
                    media_type: mediaType,
                    author_id: "user_test",
                },
            ]);

            if (error) {
                throw error;
            }

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
            <div className="mr-4 shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-300"></div>
            </div>

            <div className="flex w-full flex-col pt-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What is happening?!"
                    className="w-full resize-none border-none bg-transparent text-xl text-slate-900 outline-none placeholder:text-slate-500"
                    rows={2}
                    disabled={isSubmitting}
                />

                {mediaFile && (
                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-200">
                         {mediaType === 'video' ? (
                            <video src={mediaUrl || undefined} className="w-full max-h-[300px] object-cover bg-black" controls />
                         ) : (
                            <div className="flex items-center gap-3 p-4 bg-slate-50">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                    🎵
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{mediaFile.name}</span>
                                    <span className="text-xs text-slate-500">Audio file</span>
                                </div>
                            </div>
                         )}
                        
                        {isUploadingMedia && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        )}
                        
                        {!isUploadingMedia && (
                            <button
                                onClick={() => {
                                    setMediaUrl(null);
                                    setMediaType(null);
                                    setMediaFile(null);
                                }}
                                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}

                <div className="mt-2 flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 -ml-2 text-blue-400">
                        <MediaUpload
                            onUploadSuccess={handleUploadSuccess}
                            isUploading={isUploadingMedia}
                            setIsUploading={setIsUploadingMedia}
                            mediaFile={mediaFile}
                            setMediaFile={setMediaFile}
                        />
                        <button className="rounded-full p-2 hover:bg-blue-50 transition" title="GIF">
                            <span className="font-bold text-xs border border-current rounded px-0.5">GIF</span>
                        </button>
                        <button className="rounded-full p-2 hover:bg-blue-50 transition">
                            <BarChart2 className="h-5 w-5 rotate-90" />
                        </button>
                        <button className="rounded-full p-2 hover:bg-blue-50 transition">
                            <Smile className="h-5 w-5" />
                        </button>
                        <button className="rounded-full p-2 hover:bg-blue-50 transition">
                            <Calendar className="h-5 w-5" />
                        </button>
                        <button className="rounded-full p-2 hover:bg-blue-50 transition disabled:opacity-50">
                            <MapPin className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={(!content.trim() && !mediaUrl) || isUploadingMedia || isSubmitting}
                        className="flex h-9 items-center justify-center rounded-full bg-blue-500 px-4 font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}
