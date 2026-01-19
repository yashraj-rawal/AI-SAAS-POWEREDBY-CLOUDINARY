"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import { Download, Share2, ImageIcon, Layers, Loader2, Check } from 'lucide-react';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => { if (uploadedImage) setIsTransforming(true); }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/image-upload", { method: "POST", body: formData });
      const data = await res.json();
      setUploadedImage(data.publicId);
    } catch (err) {
      alert("Upload failed");
    } finally { setIsUploading(false); }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src).then(res => res.blob()).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "social-media-post.png";
      a.click();
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
          Social <span className="text-indigo-500">Clipper</span>
        </h1>
        <p className="text-gray-400 font-medium">AI-driven smart cropping for social platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#161920] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ImageIcon className="w-3 h-3 text-indigo-500" /> Source Image
            </h2>
            <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all bg-[#0f1115]">
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center text-center gap-2">
                {uploadedImage ? <Check className="text-emerald-500 w-6 h-6" /> : <Share2 className="text-gray-600 w-6 h-6" />}
                <p className="text-xs font-bold text-gray-400">{uploadedImage ? "Image Ready" : "Upload File"}</p>
              </div>
            </div>
            {isUploading && <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite] w-full" /></div>}
          </div>

          {uploadedImage && (
            <div className="bg-[#161920] border border-white/5 rounded-3xl p-6 shadow-xl animate-in slide-in-from-left-4 duration-500">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Layers className="w-3 h-3 text-indigo-500" /> Aspect Ratio
              </h2>
              <select 
                className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white font-medium appearance-none mb-6"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
              >
                {Object.keys(socialFormats).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <button 
                onClick={handleDownload}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Result
              </button>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8 bg-[#161920] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col min-h-125 shadow-2xl">
          <div className="bg-black/20 p-4 border-b border-white/5 flex justify-between items-center">
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Render Output</span>
             <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{socialFormats[selectedFormat].aspectRatio}</span>
          </div>
          <div className="grow flex items-center justify-center p-12 bg-pattern overflow-hidden relative">
            {uploadedImage ? (
              <div className={`relative transition-all duration-700 ${isTransforming ? 'scale-95 opacity-50 blur-md' : 'scale-100 opacity-100'}`}>
                <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden border border-white/10">
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    alt="Social preview"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
                {isTransforming && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>}
              </div>
            ) : (
              <div className="text-gray-700 font-black text-6xl opacity-20 select-none">PREVIEW</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}