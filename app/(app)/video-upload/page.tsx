"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UploadCloud, FileVideo, CheckCircle2 } from "lucide-react";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post("/api/video-uploads", formData);
      router.push("/home");
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Upload Video</h1>
        <p className="text-gray-400 font-medium">Compress and optimize your footage in seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#161920] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
          <input
            type="text"
            className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors text-white"
            placeholder="Give your video a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
          <textarea
            className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors text-white h-32 resize-none"
            placeholder="Describe the content..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Media File</label>
          <div className={`relative group border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${file ? "border-green-500/50 bg-green-500/5" : "border-white/10 hover:border-indigo-500/50 hover:bg-white/5"}`}>
            <input 
              type="file" 
              accept="video/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : (
              <UploadCloud className="w-12 h-12 text-gray-600 group-hover:text-indigo-500 transition-colors" />
            )}
            <div className="text-center">
              <p className="font-bold text-white">{file ? file.name : "Select your video"}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase">Max size: 70MB • MP4, WEBM</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileVideo className="w-5 h-5" />}
          {isUploading ? "Uploading to Cloud..." : "Publish Video"}
        </button>
      </form>
    </div>
  );
}