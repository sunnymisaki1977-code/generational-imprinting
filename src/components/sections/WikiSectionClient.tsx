"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GodData } from "@/lib/notion";

gsap.registerPlugin(ScrollTrigger);

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
              <div 
                key={god.id} 
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative transition-all duration-700 opacity-0 transform-gpu flex flex-col h-full"
              >
                {/* 墨黑粗細雙框之外框 (偽裝成雙線) */}
                <div className="absolute -inset-1 border border-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* 卡牌主體 - 移除 overflow-hidden 避免內文被裁切 */}
                <div className="relative bg-rice p-5 md:p-6 flex flex-col h-full border-2 border-ink group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0_#171717] transition-all duration-300">
                  
                  {/* 極細朱紅印章 (右上角) */}
                  <div className="absolute top-6 right-6 w-8 h-8 border border-vermilion text-vermilion flex items-center justify-center text-[10px] font-serif writing-vertical-rl z-20 opacity-80 select-none">
                    典藏
                  </div>

                  {/* 影像與左上直書 - 調整比例為 1:1 避免在小螢幕上過高擠壓文字 */}
                  <div className="relative w-full aspect-square mb-6 shrink-0 border border-ink p-1.5 bg-rice">
                    <div className="relative w-full h-full overflow-hidden border border-ink/20">
                      <div 
                        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-[1000ms] ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url("${god.image}")` }}
                      ></div>
                      
                      {/* 左上方直書詩句 */}
                      <div className="absolute top-2 left-2 z-20 bg-rice/95 px-1.5 py-3 border border-ink/30 shadow-sm">
                        <span className="writing-vertical-rl text-[11px] font-serif text-ink tracking-[0.3em] leading-loose">
                          {god.poem || "神威顯赫"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags (朱紅底白字) */}
                    <div className="absolute bottom-4 right-4 z-20 flex flex-wrap gap-1.5 justify-end">
                      {god.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-sans tracking-widest text-white bg-vermilion px-2 py-1 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 內文排版 */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-3xl font-serif text-ink mb-2 tracking-wider">
                      {god.name}
                    </h3>
                    <h4 className="text-sm font-sans text-ink/60 mb-4 tracking-widest leading-relaxed line-clamp-1">
                      {god.title}
                    </h4>
                    
                    <div className="w-full h-px bg-ink/20 mb-4 shrink-0 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-0 bg-vermilion group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                    
                    <p className="text-ink/80 font-sans text-sm md:text-base leading-loose mb-8 flex-1 overflow-hidden line-clamp-3">
                      {god.desc}
                    </p>
                    
                    {/* 按鈕 */}
                    <div className="mt-auto pt-4 border-t border-ink/20 shrink-0">
                      <button className="flex items-center justify-between w-full text-vermilion text-sm font-sans tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">
                        <span>研閱列傳</span>
                        <span className="font-serif">→</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
