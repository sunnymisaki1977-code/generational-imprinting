"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GodData } from "@/lib/notion";

gsap.registerPlugin(ScrollTrigger);

function GodCard({ god, innerRef, onSelectTag }: { god: GodData, innerRef: (el: HTMLDivElement | null) => void, onSelectTag?: (tag: string) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // 翻轉後 5 秒自動翻回正面
  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  return (
    <div 
      ref={innerRef}
      className="group relative transition-all duration-700 opacity-0 transform-gpu flex flex-col h-[450px] md:h-[550px] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D 容器 */}
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* ================= 正面 (Front Face) ================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-rice border-2 border-ink shadow-[8px_8px_0_#171717] flex flex-col overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
          <div className="relative w-full h-full bg-rice">
            {/* 正面影像 (移除霧化，Hover時提亮放大) */}
            <div 
              className="absolute inset-0 bg-contain bg-no-repeat bg-center brightness-95 group-hover:brightness-110 transition-all duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url("${god.image}")` }}
            ></div>
            
            {/* 正面漸層遮罩讓文字清晰 (Hover 時大幅降低透明度以全亮顯示) */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>

            {/* 神明名稱 (置於底部) */}
            <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex flex-col justify-end h-full pb-2">
              <span className="text-vermilion font-sans tracking-[0.4em] text-xs mb-2 block uppercase drop-shadow-md">
                Deity
              </span>
              {/* 避免文字太長被切斷，調整文字大小並設定 leading-tight */}
              <h3 className="text-3xl lg:text-4xl font-serif text-rice tracking-widest drop-shadow-xl font-bold leading-tight group-hover:drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] transition-all duration-700">
                {god.name}
              </h3>
            </div>
          </div>
        </div>

        {/* ================= 背面 (Back Face) ================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-rice border-2 border-ink shadow-[-8px_8px_0_#171717] flex flex-col p-6 md:p-8 group-hover:-translate-y-2 transition-transform duration-300">
          
          {/* 極細朱紅印章 (右上角) */}
          <div className="absolute top-6 right-6 w-8 h-8 border border-vermilion text-vermilion flex items-center justify-center text-[10px] font-serif writing-vertical-rl z-20 opacity-80 select-none">
            典藏
          </div>

          <div className="flex flex-col flex-1 mt-4 mr-8 overflow-y-auto custom-scrollbar">
            {/* 1. 副標題 (對應 Notion Heading 2) */}
            <h4 className="text-lg md:text-xl font-serif text-ink font-bold mb-4 tracking-wider leading-relaxed">
              {god.title}
            </h4>
            
            {/* 分隔線 */}
            <div className="w-full h-px bg-ink/20 mb-4 shrink-0 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/4 bg-vermilion"></div>
            </div>
            
            {/* 2. 內文 (對應 Notion Paragraph) */}
            <p className="text-ink/80 font-sans text-sm leading-loose mb-6">
              {god.desc}
            </p>
            
            {/* 3. 引言詩句 (對應 Notion Quote Block) */}
            {god.poem && (
              <div className="border-l-2 border-ink/40 pl-4 py-1 mb-6">
                <p className="text-ink font-serif text-sm tracking-widest leading-relaxed">
                  {god.poem}
                </p>
              </div>
            )}
            
            {/* 4. 標籤 (對應 Notion 標籤段落) */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs font-sans text-ink/60 tracking-widest flex items-center">標籤:</span>
              {god.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectTag) onSelectTag(tag);
                  }}
                  className="text-[11px] font-sans tracking-widest text-ink/80 bg-ink/5 hover:bg-vermilion hover:text-rice px-2 py-1 border border-ink/10 rounded-sm cursor-pointer transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* 按鈕 */}
            <div className="mt-auto pt-4 border-t border-ink/20 shrink-0">
              <button 
                className="flex items-center justify-between w-full text-ink text-sm font-sans tracking-[0.2em] hover:text-vermilion hover:tracking-[0.3em] transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation(); // 避免點擊按鈕時觸發翻轉
                }}
              >
                <span>研閱列傳</span>
                <span className="font-serif">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WikiSectionClient({ gods }: { gods: GodData[] }) {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 預設取每一尊的第一個版本，避免 SSR 時畫面空白或 Hydration Error
  const [displayGods, setDisplayGods] = useState<GodData[]>(() => {
    const grouped = new Map<string, GodData[]>();
    for (const god of gods) {
      if (!grouped.has(god.name)) {
        grouped.set(god.name, []);
        grouped.get(god.name)!.push(god);
      }
    }
    return Array.from(grouped.values()).map(v => v[0]);
  });

  // 在 Client-side 掛載時，隨機挑選各神明的一個版本
  useEffect(() => {
    const grouped = new Map<string, GodData[]>();
    for (const god of gods) {
      if (!grouped.has(god.name)) {
        grouped.set(god.name, []);
      }
      grouped.get(god.name)!.push(god);
    }
    
    const randomlySelected: GodData[] = [];
    grouped.forEach((versions) => {
      const randomIndex = Math.floor(Math.random() * versions.length);
      randomlySelected.push(versions[randomIndex]);
    });
    
    setDisplayGods(randomlySelected);
  }, [gods]);

  // 篩選與分頁狀態

  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "儒" | "釋" | "道">("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 提取所有不重複標籤
  const allTags = Array.from(new Set(displayGods.flatMap(g => g.tags))).filter(Boolean);

  // 篩選邏輯
  const filteredGods = displayGods.filter(god => {
    if (selectedCategory !== "ALL" && god.category !== selectedCategory) {
      return false;
    }
    if (selectedTag && !god.tags.includes(selectedTag)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = god.name.toLowerCase().includes(q);
      const matchTitle = god.title.toLowerCase().includes(q);
      const matchDesc = god.desc.toLowerCase().includes(q);
      const matchTag = god.tags.some(t => t.toLowerCase().includes(q.replace("#", "")));
      if (!matchName && !matchTitle && !matchDesc && !matchTag) {
        return false;
      }
    }
    return true;
  });

  useGSAP(() => {
    // Title reveal
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  // 當切換分頁或篩選時，為當前頁面的卡片播放進場動畫
  useGSAP(() => {
    const activeCards = cardsRef.current.slice(0, filteredGods.length).filter(Boolean);
    if (activeCards.length > 0) {
      gsap.fromTo(activeCards,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }
  }, { scope: container, dependencies: [selectedCategory, selectedTag, searchQuery, filteredGods.length] });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-rice relative">
      <div className="absolute top-0 left-0 w-full h-px bg-ink/10"></div>
      
      <div className="max-w-7xl w-full z-10">
        <div className="flex flex-col items-center mb-10">
          <span className="text-vermilion font-sans tracking-[0.3em] text-sm mb-3 uppercase font-bold">Deities Encyclopedia</span>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink text-center tracking-widest opacity-0 font-bold mb-4">
            【諸神・紀略】
          </h2>
          <p className="text-ink/70 font-sans text-sm tracking-widest text-center max-w-xl">
            收錄臺灣世代信仰神仙列傳，應用儒、釋、道三教分類與主題標籤進行探索
          </p>
        </div>

        {/* ================= 儒釋道卡片分類 Tabs ================= */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {[
            { id: "ALL", label: "全部諸神", count: displayGods.length, desc: "完整圖鑑" },
            { id: "儒", label: "儒・聖賢文昌", count: displayGods.filter(g => g.category === "儒").length, desc: "科舉名臣與至聖先師" },
            { id: "釋", label: "釋・佛菩薩禪", count: displayGods.filter(g => g.category === "釋").length, desc: "慈悲普度與高僧禪宗" },
            { id: "道", label: "道・民間信仰", count: displayGods.filter(g => g.category === "道").length, desc: "天帝王爺與在地守護" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSelectedCategory(tab.id as any); }}
              className={`group flex flex-col items-center px-6 py-3 rounded-xl font-serif tracking-widest transition-all duration-300 border shadow-sm ${
                selectedCategory === tab.id
                  ? "bg-vermilion text-rice border-vermilion shadow-lg scale-105 font-bold"
                  : "bg-rice/80 text-ink/80 border-ink/20 hover:border-vermilion/80 hover:text-vermilion hover:bg-rice hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2 text-base md:text-lg">
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${
                  selectedCategory === tab.id ? "bg-rice/20 text-rice" : "bg-ink/10 text-ink/70 group-hover:bg-vermilion/10 group-hover:text-vermilion"
                }`}>
                  {tab.count}
                </span>
              </div>
              <span className={`text-[11px] font-sans tracking-normal mt-1 opacity-80 ${
                selectedCategory === tab.id ? "text-rice/90" : "text-ink/50"
              }`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* ================= #tag 搜尋與篩選區域 ================= */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col items-center gap-4 bg-ink/[0.02] p-6 rounded-2xl border border-ink/10 shadow-inner">
          {/* 搜尋輸入框 */}
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50 pointer-events-none font-serif">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); }}
              placeholder="搜尋神明尊號、文獻事蹟或 #標籤 (例如：武財神、文昌、保平安、除瘟)..."
              className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-rice border-2 border-ink/20 focus:border-vermilion text-ink placeholder-ink/40 font-sans text-sm md:text-base tracking-wider focus:outline-none transition-all shadow-sm"
            />
            {(searchQuery || selectedTag || selectedCategory !== "ALL") && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedTag(null); setSelectedCategory("ALL"); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-vermilion hover:bg-vermilion hover:text-rice tracking-widest bg-vermilion/10 px-3 py-1.5 rounded-lg transition-colors font-bold"
              >
                重置全部 ✕
              </button>
            )}
          </div>

          {/* 標籤雲 / 篩選列 */}
          {allTags.length > 0 && (
            <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-serif font-bold text-ink/70 tracking-widest mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-vermilion inline-block"></span>
                熱門主題標籤:
              </span>
              {allTags.slice(0, 28).map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                  }}
                  className={`text-xs font-sans tracking-widest px-3 py-1 rounded-full transition-all duration-200 border flex items-center gap-1 ${
                    selectedTag === tag
                      ? "bg-vermilion text-rice border-vermilion shadow-md font-bold scale-105"
                      : "bg-rice/90 text-ink/80 border-ink/20 hover:border-vermilion hover:text-vermilion hover:bg-white"
                  }`}
                >
                  <span>#{tag}</span>
                  {selectedTag === tag && <span className="text-[10px]">✕</span>}
                </button>
              ))}
            </div>
          )}

          {/* 目前篩選狀態提示 */}
          {(selectedCategory !== "ALL" || selectedTag || searchQuery) && (
            <div className="w-full flex items-center justify-between text-xs font-sans text-ink/70 bg-vermilion/5 border border-vermilion/20 px-4 py-2 rounded-lg mt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-vermilion">目前篩選條件：</span>
                {selectedCategory !== "ALL" && <span className="bg-ink/10 px-2 py-0.5 rounded">分類: {selectedCategory}</span>}
                {selectedTag && <span className="bg-ink/10 px-2 py-0.5 rounded">標籤: #{selectedTag}</span>}
                {searchQuery && <span className="bg-ink/10 px-2 py-0.5 rounded">關鍵字: &quot;{searchQuery}&quot;</span>}
              </div>
              <span className="font-bold text-ink">共找到 {filteredGods.length} 尊</span>
            </div>
          )}
        </div>

        {/* ================= 卡片網格與結果 ================= */}
        {displayGods.length === 0 ? (
          <div className="text-center text-ink/50 py-20 font-sans tracking-widest">
            正在從 Notion 載入文獻資料...
          </div>
        ) : filteredGods.length === 0 ? (
          <div className="text-center py-20 bg-ink/[0.02] rounded-2xl border border-ink/10 max-w-xl mx-auto my-8 p-8">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-serif text-ink font-bold mb-2 tracking-wider">查無神明文獻</h3>
            <p className="text-ink/60 font-sans text-sm tracking-widest mb-6 leading-relaxed">
              目前「{selectedCategory !== "ALL" ? selectedCategory : ""}」分類或「{selectedTag ? `#${selectedTag}` : searchQuery}」條件下沒有對應的神明卡片。
            </p>
            <button
              onClick={() => { setSelectedCategory("ALL"); setSelectedTag(null); setSearchQuery(""); }}
              className="px-6 py-2.5 bg-vermilion text-rice rounded-lg font-serif text-sm tracking-widest hover:bg-vermilion/90 transition-all shadow-md font-bold"
            >
              顯示全部神明 ({displayGods.length} 尊)
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 group">
            {/* Left Button */}
            <button 
              onClick={() => {
                const el = document.getElementById('wiki-carousel');
                if (el) el.scrollBy({ left: -el.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-vermilion hover:text-white rounded-full flex items-center justify-center text-ink shadow-lg border border-ink/10 transition-all z-20 opacity-80 group-hover:opacity-100"
            >
              <span className="font-serif text-xl md:text-2xl font-bold -ml-1">←</span>
            </button>
            
            {/* Carousel Container */}
            <div id="wiki-carousel" className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide gap-6 md:gap-8 pb-10 min-h-[550px]">
              {filteredGods.map((god, i) => (
                <div key={god.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] shrink-0 snap-start">
                  <GodCard 
                    god={god} 
                    innerRef={(el) => { cardsRef.current[i] = el; }}
                    onSelectTag={(tag) => {
                      setSelectedTag(tag);
                      container.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button 
              onClick={() => {
                const el = document.getElementById('wiki-carousel');
                if (el) el.scrollBy({ left: el.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-vermilion hover:text-white rounded-full flex items-center justify-center text-ink shadow-lg border border-ink/10 transition-all z-20 opacity-80 group-hover:opacity-100"
            >
              <span className="font-serif text-xl md:text-2xl font-bold -mr-1">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
