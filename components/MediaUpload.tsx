"use client";

import { useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Image, FileAudio, Film } from "lucide-react";

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
        setIsUploading(true);
        setMediaFile(file);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
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
        <>
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
                className="group flex items-center justify-center rounded-full p-2 text-blue-400 hover:bg-blue-50 disabled:opacity-50 transition"
                title="Upload Media"
            >
                <Image className="h-5 w-5" />
            </button>
        </>
    );
}
