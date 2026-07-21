"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Initial reveal animation
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    ).fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=1"
    );

    // Parallax background on scroll
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-rice p-4 md:p-8">
      {/* 墨黑雙線外框 */}
      <div className="absolute inset-4 md:inset-8 border-[12px] md:border-[16px] border-double border-ink pointer-events-none z-20"></div>
      
      {/* 背景 */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-rice z-0 scale-110"
        style={{ transformOrigin: 'top center' }}
      ></div>
      {/* 水墨彩墨畫面區塊 */}
      <div className="absolute inset-16 md:inset-32 bg-[url('https://images.unsplash.com/photo-1599827552599-eda798622152?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-multiply border border-ink/30 z-0"></div>
      
      {/* 大膽直書與大面積留白 */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24 px-4 h-full h-[60vh] md:h-[70vh]">
        <h1 ref={titleRef} className="writing-vertical-rl text-6xl md:text-8xl font-serif text-vermilion opacity-0 tracking-[0.2em] leading-tight">
          講一個
          <br />
          <span className="text-ink mt-8 inline-block">巷弄神明</span>的日常
        </h1>
        <p ref={subtitleRef} className="writing-vertical-rl text-xl md:text-2xl text-ink/80 font-sans leading-relaxed tracking-wider opacity-0 mt-8 md:mt-0">
          解碼那些銘印於心的文化密碼
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 animate-bounce flex flex-col items-center opacity-70">
        <span className="text-ink/50 text-xs mb-2 tracking-widest font-sans uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-vermilion to-transparent"></div>
      </div>
    </div>
  );
}
