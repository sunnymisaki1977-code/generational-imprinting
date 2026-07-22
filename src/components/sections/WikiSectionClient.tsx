"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GodData } from "@/lib/notion";

gsap.registerPlugin(ScrollTrigger);

function GodCard({ god, innerRef }: { god: GodData, innerRef: (el: HTMLDivElement | null) => void }) {
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
            {/* 正面影像 (預設微霧化，Hover變清晰提亮且不裁切) */}
            <div 
              className="absolute inset-0 bg-contain bg-no-repeat bg-center blur-[1px] brightness-95 group-hover:blur-0 group-hover:brightness-110 transition-all duration-700 ease-out group-hover:scale-105"
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

          {/* 左上方直書詩句 */}
          <div className="absolute top-6 left-6 z-20 bg-rice/95 px-1.5 py-3 border border-ink/30 shadow-sm">
            <span className="writing-vertical-rl text-[11px] font-serif text-ink tracking-[0.3em] leading-loose">
              {god.poem || "神威顯赫"}
            </span>
          </div>

          <div className="flex flex-col flex-1 mt-12 ml-10">
            <h3 className="text-3xl font-serif text-ink mb-2 tracking-wider">
              {god.name}
            </h3>
            <h4 className="text-sm font-sans text-ink/60 mb-4 tracking-widest leading-relaxed line-clamp-2">
              {god.title}
            </h4>
            
            <div className="w-full h-px bg-ink/20 mb-6 shrink-0 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/3 bg-vermilion"></div>
            </div>
            
            <p className="text-ink/80 font-sans text-sm md:text-base leading-loose mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {god.desc}
            </p>
            
            {/* Tags (朱紅底白字) */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {god.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-sans tracking-widest text-white bg-vermilion px-2 py-1 shadow-sm">
                  {tag}
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

    // Cards stagger reveal
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 80, rotateX: -15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 60%",
          }
        }
      );
    }
  }, { scope: container, dependencies: [gods] });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-rice relative">
      <div className="absolute top-0 left-0 w-full h-px bg-ink/10"></div>
      
      <div className="max-w-7xl w-full z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-vermilion font-sans tracking-[0.3em] text-sm mb-3 uppercase">Encyclopedia</span>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink text-center tracking-widest opacity-0">
            【諸神・紀略】
          </h2>
        </div>
        
        {gods.length === 0 ? (
          <div className="text-center text-ink/50 py-20 font-sans tracking-widest">
            正在從 Notion 載入文獻資料...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {gods.map((god, i) => (
              <GodCard 
                key={god.id} 
                god={god} 
                innerRef={(el) => { cardsRef.current[i] = el; }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
