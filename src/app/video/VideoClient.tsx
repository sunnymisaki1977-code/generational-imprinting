"use client";

import { useState, useEffect, useCallback } from "react";
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

// 真正均勻隨機的 Fisher-Yates 洗牌演算法
function getRandomVideos(videos: YouTubeVideo[], count = 3): YouTubeVideo[] {
  if (!videos || videos.length === 0) return [];
  const copy = [...videos];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function VideoClient({
  adultVideos,
  kidsVideos,
}: {
  adultVideos?: YouTubeVideo[];
  kidsVideos?: YouTubeVideo[];
}) {
  const { isReady } = useLiff();
  const [viewMode, setViewMode] = useState<ViewMode>("adult");
  const [playlist, setPlaylist] = useState<YouTubeVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const currentSourceVideos = viewMode === "adult" ? adultVideos : kidsVideos;
  const currentTotal = currentSourceVideos?.length || 0;

  // 隨機抽選 3 部影片
  const shuffleThree = useCallback(() => {
    setIsShuffling(true);
    const source = viewMode === "adult" ? adultVideos : kidsVideos;

    if (source && source.length > 0) {
      const selected = getRandomVideos(source, 3);
      setPlaylist(selected);
      setCurrentVideo(selected[0]);
    } else {
      setPlaylist(DEFAULT_PLAYLIST);
      setCurrentVideo(DEFAULT_PLAYLIST[0]);
    }

    setTimeout(() => setIsShuffling(false), 400);
  }, [viewMode, adultVideos, kidsVideos]);

  // 當 viewMode 改變時，自動隨機抽取該版本的 3 部片單
  useEffect(() => {
    shuffleThree();
    setShowAll(false);
  }, [shuffleThree]);

  if (!currentVideo) {
    return (
      <div className="flex-1 flex items-center justify-center font-sans tracking-widest text-rice/60 h-[100dvh] bg-ink">
        正在為您挑選今日選集...
      </div>
    );
  }

  // 顯示的影片列表：若是精選模式則為隨機 3 部，展開時為完整片單
  const displayVideos = showAll ? currentSourceVideos || playlist : playlist;

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto h-[100dvh] overflow-hidden bg-ink">
      {/* 頂部：YouTube 播放器 */}
      <div className="w-full bg-black aspect-video relative flex-shrink-0 shadow-2xl z-20">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo.id}?playsinline=1&rel=0&modestbranding=1&autoplay=1`}
          title={currentVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-none"
        ></iframe>
      </div>

      {/* 影片資訊區 */}
      <div className="px-6 py-5 bg-ink flex-shrink-0 border-b border-rice/10">
        <h1 className="text-lg md:text-xl font-serif tracking-widest text-rice font-bold mb-2 leading-snug">
          {currentVideo.title}
        </h1>
        <p className="text-rice/60 font-sans text-xs md:text-sm tracking-wide leading-relaxed line-clamp-2">
          {currentVideo.description}
        </p>
      </div>

      {/* 底部：分眾頁籤與選集清單 */}
      <div className="flex-1 overflow-y-auto bg-ink/95 px-4 py-4 scrollbar-hide pb-20">
        {/* 切換按鈕 (Tabs) */}
        <div className="flex p-1 bg-rice/5 rounded-xl mb-5 relative">
          <button
            onClick={() => setViewMode("adult")}
            className={`flex-1 py-2.5 text-sm font-sans tracking-widest font-bold rounded-lg transition-all duration-300 z-10 ${
              viewMode === "adult" ? "text-ink shadow-sm" : "text-rice/50 hover:text-rice/80"
            }`}
          >
            大人版 ({adultVideos?.length || 0})
          </button>
          <button
            onClick={() => setViewMode("kids")}
            className={`flex-1 py-2.5 text-sm font-sans tracking-widest font-bold rounded-lg transition-all duration-300 z-10 ${
              viewMode === "kids" ? "text-ink shadow-sm" : "text-rice/50 hover:text-rice/80"
            }`}
          >
            小朋友 ({kidsVideos?.length || 0})
          </button>
          {/* 滑動背景標籤 */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-rice rounded-lg transition-all duration-300 shadow-sm ease-out ${
              viewMode === "adult" ? "left-1" : "left-[calc(50%+2px)]"
            }`}
          ></div>
        </div>

        {/* 片單標題列與隨機換一批按鈕 */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-vermilion inline-block rounded-full"></span>
            <h3 className="text-sm font-sans tracking-widest text-rice font-bold">
              {showAll ? `完整片單（共 ${currentTotal} 部）` : "今日精選（隨機 3 部）"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!showAll && (
              <button
                onClick={shuffleThree}
                disabled={isShuffling}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion/15 hover:bg-vermilion/25 active:scale-95 text-rice text-xs font-sans tracking-wider transition-all duration-200 border border-vermilion/30 shadow-sm"
                title="隨機換三部影片"
              >
                <svg
                  className={`w-3.5 h-3.5 text-amber transition-transform duration-500 ${
                    isShuffling ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="font-medium text-amber">隨機換一批</span>
              </button>
            )}

            {currentTotal > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-2.5 py-1.5 rounded-full bg-rice/5 hover:bg-rice/10 active:scale-95 text-rice/70 hover:text-rice text-xs font-sans tracking-wider transition-all duration-200 border border-rice/10"
              >
                {showAll ? "收合為精選 3 部" : "查看全部"}
              </button>
            )}
          </div>
        </div>

        {/* 影片卡片列表 */}
        <div className="flex flex-col gap-3">
          {displayVideos.map((video, index) => {
            const isPlaying = currentVideo.id === video.id;
            return (
              <button
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video);
                  // 平滑捲動回頂部以觀賞影片
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`
                  w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3.5 group
                  ${
                    isPlaying
                      ? "bg-rice/10 border border-amber/40 shadow-md scale-[1.01]"
                      : "bg-rice/[0.03] border border-rice/5 hover:bg-rice/5 hover:border-rice/15"
                  }
                `}
              >
                <div className="flex-shrink-0 relative overflow-hidden rounded-lg border border-rice/10 w-24 aspect-video bg-black/60 shadow-inner">
                  {video.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-vermilion/80 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        播放中
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span
                    className={`text-xs font-serif tracking-widest ${
                      isPlaying ? "text-amber font-bold" : "text-rice/40"
                    }`}
                  >
                    {!showAll
                      ? `第 ${["一", "二", "三"][index] || index + 1} 回`
                      : `第 ${index + 1} 集`}
                  </span>
                  <span
                    className={`text-sm md:text-base font-bold font-sans tracking-wider line-clamp-2 leading-snug ${
                      isPlaying ? "text-white" : "text-rice/80 group-hover:text-white"
                    }`}
                  >
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
