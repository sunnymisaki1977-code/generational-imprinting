"use client";

import { useState } from "react";
import { useLiff } from "@/components/providers/LiffProvider";

// 預設播放清單 (您可以隨時在這裡更改 YouTube ID)
const DEFAULT_PLAYLIST = [
  {
    id: "ep1",
    episode: "01",
    title: "第一回：海上的星芒",
    description: "透過現代的旁白說書與傳統彩墨視覺的碰撞，帶您走入巷弄間，聆聽媽祖信仰的故事。",
    // 請將這裡的 YouTube ID 換成您真實的影片 ID (例如 v= 後面那一串)
    youtubeId: "dQw4w9WgXcQ", 
  },
  {
    id: "ep2",
    episode: "02",
    title: "第二回：煙硝與忠義",
    description: "關聖帝君的忠義精神是如何從三國時代流傳至今，成為商業與守護的象徵？",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "ep3",
    episode: "03",
    title: "第三回：田埂間的守護",
    description: "土地公伯是台灣人最親近的神明，探討其在農業社會與現代都市中的角色轉換。",
    youtubeId: "dQw4w9WgXcQ",
  },
];

export default function VideoClient() {
  const { isReady } = useLiff();
  const [currentVideo, setCurrentVideo] = useState(DEFAULT_PLAYLIST[0]);

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto h-[100dvh] overflow-hidden">
      
      {/* 頂部：YouTube 播放器 */}
      <div className="w-full bg-black aspect-video relative flex-shrink-0 shadow-2xl z-20">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?playsinline=1&rel=0&modestbranding=1`}
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

      {/* 底部：選集清單 (可捲動) */}
      <div className="flex-1 overflow-y-auto bg-ink px-4 py-2">
        <div className="flex items-center gap-3 px-2 py-4">
          <span className="w-1 h-4 bg-vermilion inline-block"></span>
          <h2 className="text-lg font-serif tracking-widest text-vermilion">選集清單</h2>
        </div>
        
        <ul className="space-y-2 pb-10">
          {DEFAULT_PLAYLIST.map((video) => {
            const isPlaying = currentVideo.id === video.id;
            
            return (
              <li 
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className={`
                  group cursor-pointer p-4 rounded-xl transition-all duration-300 flex items-start gap-4
                  ${isPlaying ? 'bg-rice/10 border border-rice/20' : 'hover:bg-rice/5 border border-transparent'}
                `}
              >
                {/* 集數標籤 */}
                <div className={`
                  flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-sans text-sm font-bold tracking-wider transition-colors
                  ${isPlaying ? 'bg-vermilion text-rice' : 'bg-rice/10 text-rice/50 group-hover:bg-rice/20 group-hover:text-rice'}
                `}>
                  {video.episode}
                </div>
                
                {/* 標題 */}
                <div className="flex flex-col justify-center py-1">
                  <h3 className={`
                    font-serif tracking-widest transition-colors
                    ${isPlaying ? 'text-vermilion font-bold' : 'text-rice/80 group-hover:text-rice'}
                  `}>
                    {video.title}
                  </h3>
                  {isPlaying && (
                    <span className="text-xs text-vermilion/80 font-sans mt-1 tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-pulse"></span>
                      正在播放
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {!isReady && (
        <div className="absolute inset-0 bg-ink/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <p className="text-rice/70 tracking-widest animate-pulse">載入中...</p>
        </div>
      )}
    </div>
  );
}
