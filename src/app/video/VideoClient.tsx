"use client";

import { useState, useEffect } from "react";
import { useLiff } from "@/components/providers/LiffProvider";
import { YouTubeVideo } from "@/lib/youtube";

// 備用預設清單（以防 API 發生錯誤）
const DEFAULT_PLAYLIST: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "歡迎來到世代銘印",
    description: "暫時無法取得最新影片，這是一支預設影片。",
    thumbnailUrl: "",
    publishedAt: "",
  },
];

type ViewMode = "adult" | "kids";

export default function VideoClient({ adultVideos, kidsVideos }: { adultVideos?: YouTubeVideo[], kidsVideos?: YouTubeVideo[] }) {
  const { isReady } = useLiff();
  const [viewMode, setViewMode] = useState<ViewMode>("adult");
  const [playlist, setPlaylist] = useState<YouTubeVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);

  // 當 viewMode 改變時，重新抽取並設定該版本的隨機片單
  useEffect(() => {
    const sourceVideos = viewMode === "adult" ? adultVideos : kidsVideos;
    
    if (sourceVideos && sourceVideos.length > 0) {
      const shuffled = [...sourceVideos].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setPlaylist(selected);
      setCurrentVideo(selected[0]);
    } else {
      setPlaylist(DEFAULT_PLAYLIST);
      setCurrentVideo(DEFAULT_PLAYLIST[0]);
    }
  }, [viewMode, adultVideos, kidsVideos]);

  if (!currentVideo) {
    return (
      <div className="flex-1 flex items-center justify-center font-sans tracking-widest text-rice/60 h-[100dvh] bg-ink">
        正在為您挑選今日選集...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto h-[100dvh] overflow-hidden bg-ink">
      
      {/* 頂部：YouTube 播放器 */}
      <div className="w-full bg-black aspect-video relative flex-shrink-0 shadow-2xl z-20">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo.id}?playsinline=1&rel=0&modestbranding=1`}
          title={currentVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-none"
        ></iframe>
      </div>

      {/* 影片資訊區 */}
      <div className="px-6 py-6 bg-ink flex-shrink-0 border-b border-rice/10">
        <h1 className="text-xl md:text-2xl font-serif tracking-widest text-rice font-bold mb-3 leading-snug">
          {currentVideo.title}
        </h1>
        <p className="text-rice/60 font-sans text-sm tracking-wide leading-relaxed line-clamp-2">
          {currentVideo.description}
        </p>
      </div>

      {/* 底部：分眾頁籤與選集清單 */}
      <div className="flex-1 overflow-y-auto bg-ink/95 px-4 py-4 scrollbar-hide pb-20">
        
        {/* 切換按鈕 (Tabs) */}
        <div className="flex p-1 bg-rice/5 rounded-xl mb-6 relative">
          <button
            onClick={() => setViewMode("adult")}
            className={`flex-1 py-3 text-sm font-sans tracking-widest font-bold rounded-lg transition-all duration-300 z-10 ${
              viewMode === "adult" ? "text-ink shadow-sm" : "text-rice/50 hover:text-rice/80"
            }`}
          >
            大人版
          </button>
          <button
            onClick={() => setViewMode("kids")}
            className={`flex-1 py-3 text-sm font-sans tracking-widest font-bold rounded-lg transition-all duration-300 z-10 ${
              viewMode === "kids" ? "text-ink shadow-sm" : "text-rice/50 hover:text-rice/80"
            }`}
          >
            小朋友
          </button>
          {/* 滑動背景標籤 */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-rice rounded-lg transition-all duration-300 shadow-sm ease-out ${
              viewMode === "adult" ? "left-1" : "left-[calc(50%+2px)]"
            }`}
          ></div>
        </div>

        <h3 className="text-sm font-sans tracking-widest text-vermilion mb-4 pl-2 font-bold flex items-center gap-2">
          <span className="w-1.5 h-4 bg-vermilion inline-block"></span>
          今日精選片單
        </h3>
        
        <div className="flex flex-col gap-3">
          {playlist.map((video, index) => {
            const isPlaying = currentVideo.id === video.id;
            return (
              <button
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className={`
                  w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 group
                  ${isPlaying
                    ? 'bg-rice/10 border border-rice/20 shadow-md scale-[1.02]' 
                    : 'bg-transparent border border-transparent hover:bg-rice/5'
                  }
                `}
              >
                <div className="flex-shrink-0 relative overflow-hidden rounded border border-rice/10 w-24 aspect-video bg-black/50">
                  {video.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-vermilion/80 flex items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-widest flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                        播放中
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className={`text-xs font-serif tracking-widest ${isPlaying ? 'text-vermilion' : 'text-rice/40'}`}>
                    第 {['一', '二', '三'][index]} 回
                  </span>
                  <span className={`text-sm md:text-base font-bold font-sans tracking-wider truncate ${isPlaying ? 'text-white' : 'text-rice/80 group-hover:text-white'}`}>
                    {video.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {!isReady && (
          <p className="text-center text-xs text-rice/30 mt-8 tracking-widest">
            (尚未在 LINE 中開啟，部分功能可能無法運作)
          </p>
        )}
      </div>
    </div>
  );
}
