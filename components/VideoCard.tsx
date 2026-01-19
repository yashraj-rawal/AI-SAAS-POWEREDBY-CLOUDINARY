"use client";
import React, { useState } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, PlayCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";

dayjs.extend(relativeTime);

export default function VideoCard({ video, onDownload }: { video: Video; onDownload: (url: string, title: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const thumbUrl = getCldImageUrl({ src: video.publicId, width: 400, height: 225, crop: "fill", gravity: "auto", assetType: "video" });
  const previewUrl = getCldVideoUrl({ src: video.publicId, width: 400, height: 225, rawTransformations: ["e_preview:duration_15"] });

  return (
    <div 
      className="bg-[#161920] border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative bg-[#0f1115]">
        {isHovered ? (
          <video src={previewUrl} autoPlay muted loop className="w-full h-full object-cover" />
        ) : (
          <img src={thumbUrl} className="w-full h-full object-cover opacity-80" alt={video.title} />
        )}
        
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/20 group-hover:text-white/60 transition-colors" />
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-indigo-400" />
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-white font-bold text-lg mb-1 truncate group-hover:text-indigo-400 transition-colors">{video.title}</h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2">{video.description}</p>
        
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">Original</span>
            <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
              <FileUp className="w-3.5 h-3.5 text-indigo-500" />
              {filesize(Number(video.originalSize))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">Compressed</span>
            <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
              <FileDown className="w-3.5 h-3.5 text-emerald-500" />
              {filesize(Number(video.compressedSize))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => onDownload(getCldVideoUrl({ src: video.publicId }), video.title)}
          className="w-full bg-white/5 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Download Assets
        </button>
      </div>
    </div>
  );
}