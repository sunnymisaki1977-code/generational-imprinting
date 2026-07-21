"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    // Reveal elements
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

    gsap.fromTo(playerRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: playerRef.current,
          start: "top 75%",
        }
      }
    );
    
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: playerRef.current,
          start: "top 75%",
        }
      }
    );

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-rice transition-colors duration-700">
      <div className="max-w-7xl w-full flex flex-col">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center tracking-widest opacity-0">
          【說書・影音】
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:h-[600px] border-2 border-ink bg-rice">
          
          {/* 左側劇集清單 (墨黑反白區塊) */}
          <div className="w-full lg:w-1/3 bg-ink text-rice p-8 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-ink relative">
            <h3 className="text-2xl font-serif mb-8 tracking-widest text-vermilion flex items-center gap-3">
              <span className="w-4 h-4 bg-vermilion inline-block"></span>
              典藏選集
            </h3>
            <ul className="space-y-6 flex-1 overflow-y-auto pr-4">
              <li className="group cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                <span className="text-vermilion text-xs font-sans tracking-widest mb-1 block">01</span>
                <h4 className="text-xl font-serif border-b border-rice/20 pb-4 group-hover:border-vermilion/50 transition-colors">第一回：海上的星芒</h4>
              </li>
              <li className="group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-rice/50 text-xs font-sans tracking-widest mb-1 block">02</span>
                <h4 className="text-xl font-serif border-b border-rice/20 pb-4 group-hover:border-vermilion/50 transition-colors">第二回：煙硝與忠義</h4>
              </li>
              <li className="group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-rice/50 text-xs font-sans tracking-widest mb-1 block">03</span>
                <h4 className="text-xl font-serif border-b border-rice/20 pb-4 group-hover:border-vermilion/50 transition-colors">第三回：田埂間的守護</h4>
              </li>
            </ul>
          </div>
          
          {/* 右側播放器 (米白底) */}
          <div 
            ref={playerRef}
            className="w-full lg:w-2/3 relative bg-rice flex flex-col items-center justify-center p-4 lg:p-8 group cursor-pointer opacity-0"
          >
            <div className="absolute inset-4 lg:inset-8 border border-ink/20 pointer-events-none z-20"></div>
            
            <div className="relative w-full h-full bg-[url('https://images.unsplash.com/photo-1608822646197-09f1cf4be3c1?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 flex items-center justify-center border border-ink">
              <div className="absolute inset-0 bg-rice/30 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-1000"></div>
              
              <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full border border-vermilion flex items-center justify-center bg-rice/90 backdrop-blur-sm group-hover:scale-110 group-hover:bg-vermilion transition-all duration-500 shadow-xl">
                <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[18px] border-l-vermilion group-hover:border-l-white border-b-[10px] md:border-b-[12px] border-b-transparent ml-1 md:ml-2 transition-colors duration-500"></div>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="max-w-3xl mx-auto text-center mt-16">
          <p ref={textRef} className="text-ink/80 font-sans leading-loose text-lg md:text-xl tracking-wide opacity-0">
            透過現代的旁白說書與傳統彩墨視覺的碰撞，
            <br className="hidden md:block" />
            帶您走入巷弄間，聆聽那些被歲月溫柔包裹的信仰故事。
          </p>
        </div>
      </div>
    </div>
  );
}
