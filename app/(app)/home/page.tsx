"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types';
import { RefreshCw, VideoOff, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/videos");
            if (Array.isArray(response.data)) setVideos(response.data);
        } catch (err) {
            setError("Failed to sync library");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVideos(); }, [fetchVideos]);

    const handleDownload = (url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight italic">
                        Video <span className="text-indigo-500">Vault</span>
                    </h1>
                    <p className="text-gray-400 mt-1 font-medium">Manage your optimized cloud assets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchVideos}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-gray-300"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link href="/video-upload" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-sm">
                        <Plus className="w-4 h-4" />
                        Upload New
                    </Link>
                </div>
            </div>

            {/* Content Logic */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#161920] rounded-3xl p-4 border border-white/5 space-y-4">
                            <div className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
                            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <div className="bg-[#161920] border-2 border-dashed border-white/5 rounded-[3rem] py-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                        <VideoOff className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">No assets found</h2>
                    <p className="text-gray-500 mt-2 max-w-xs">Your cloud library is currently empty. Start uploading to see magic happen.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} onDownload={handleDownload} />
                    ))}
                </div>
            )}
        </div>
    );
}