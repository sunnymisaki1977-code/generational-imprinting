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
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-xuan relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl w-full z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-amber/50 font-sans tracking-[0.3em] text-sm mb-3 uppercase">Encyclopedia</span>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-amber text-center tracking-widest opacity-0">
            【諸神・紀略】
          </h2>
        </div>
        
        {gods.length === 0 ? (
          <div className="text-center text-bone/50 py-20 font-sans tracking-widest">
            正在從 Notion 載入文獻資料... <br/>(請確認已設定環境變數 NOTION_TOKEN)
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {gods.map((god, i) => (
              <div 
                key={god.id} 
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative rounded-2xl transition-all duration-700 opacity-0 transform-gpu perspective-1000 flex flex-col h-full min-h-[500px]"
              >
                {/* Outer Golden Glow Border */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-amber/40 via-jiang/20 to-transparent rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                {/* Card Content Container */}
                <div className="relative bg-xuan/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col h-full overflow-hidden border border-xuan shadow-2xl group-hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.15)] transition-shadow duration-700">
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber/0 group-hover:border-amber/50 rounded-tl-2xl transition-colors duration-700"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber/0 group-hover:border-amber/50 rounded-br-2xl transition-colors duration-700"></div>

                  {/* Image Section */}
                  <div className="relative w-full aspect-[4/5] bg-jiang/10 mb-6 rounded-xl overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-jiang/30 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-multiply"></div>
                    <div 
                      className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-50 group-hover:opacity-80 group-hover:scale-110 group-hover:mix-blend-normal transition-all duration-[1000ms] ease-out"
                      style={{ backgroundImage: `url("${god.image}")` }}
                    ></div>
                    
                    {/* Floating Tags */}
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pr-4">
                      {god.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] md:text-xs font-sans tracking-widest text-bone bg-xuan/60 backdrop-blur-md px-3 py-1 rounded-full border border-bone/10 shadow-sm translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${idx * 100}ms`}}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-3xl font-serif text-bone mb-1 group-hover:text-amber transition-colors duration-500 tracking-wider">
                      {god.name}
                    </h3>
                    <h4 className="text-sm font-sans text-amber/80 mb-4 tracking-widest leading-relaxed">
                      {god.title}
                    </h4>
                    <div className="w-12 h-px bg-jiang/50 mb-4 group-hover:w-full group-hover:bg-amber/30 transition-all duration-700 shrink-0"></div>
                    
                    <p className="text-bone/70 font-sans text-sm md:text-base leading-relaxed mb-8 flex-1 overflow-hidden line-clamp-4">
                      {god.desc}
                    </p>
                    
                    {/* Action Button */}
                    <div className="mt-auto pt-4 border-t border-bone/5 group-hover:border-amber/20 transition-colors duration-500 shrink-0">
                      <button className="flex items-center justify-between w-full text-amber/60 text-sm font-sans tracking-[0.2em] group-hover:text-amber transition-colors duration-300">
                        <span>研閱列傳</span>
                        <span className="w-8 h-8 rounded-full border border-amber/30 flex items-center justify-center group-hover:bg-amber/10 group-hover:border-amber group-hover:translate-x-1 transition-all duration-300">
                          →
                        </span>
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
