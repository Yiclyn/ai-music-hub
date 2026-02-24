"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface MediaUploadProps {
    onUploadSuccess: (url: string, type: "audio" | "video") => void;
    isUploading: boolean;
    setIsUploading: (uploading: boolean) => void;
    mediaFile: File | null;
    setMediaFile: (file: File | null) => void;
}

export default function MediaUpload({
    onUploadSuccess,
    isUploading,
    setIsUploading,
    mediaFile,
    setMediaFile,
}: MediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileType = file.type.startsWith("audio/") ? "audio" : "video";

        // We do NOT upload immediately. We just set the file, so Composer can preview it.
        // Upload happens when user clicks "Post".
        // Alternatively, upload immediately and return URL. Let's do the latter for simplicity, 
        // but the prompt says "文件上传至 Supabase media... 并将记录写入 posts".
        // Doing it on "Post" is cleaner because if they cancel, we don't have orphan files.
        // But X uploads immediately to show preview. I will upload immediately, so we can preview securely or just show the name.

        setIsUploading(true);
        setMediaFile(file);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from("media")
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from("media")
                .getPublicUrl(filePath);

            onUploadSuccess(publicUrl, fileType);
        } catch (error) {
            console.error("Error uploading media:", error);
            alert("Failed to upload media.");
            setMediaFile(null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                accept="audio/mpeg, video/mp4"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <button
                type="button"
                disabled={isUploading || !!mediaFile}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 disabled:opacity-50 transition"
                title="Upload Audio or Video"
            >
                {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                )}
            </button>
        </div>
    );
}
