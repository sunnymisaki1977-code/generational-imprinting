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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top center",
        end: "center center",
        scrub: 1,
      }
    });

    // Darken background to create cinematic feel
    tl.to(container.current, {
      backgroundColor: "#050505", // Very dark color, darker than xuan
      duration: 1
    });

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
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
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
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-gradient-to-b from-xuan to-jiang/10 transition-colors duration-700">
      <div className="max-w-6xl w-full">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-amber mb-16 text-center tracking-widest opacity-0">
          【說書・影音】
        </h2>
        
        <div 
          ref={playerRef}
          className="relative aspect-video bg-black/80 border border-jiang/50 rounded-xl flex items-center justify-center text-bone/50 text-xl font-serif mb-12 overflow-hidden shadow-2xl opacity-0 group cursor-pointer"
        >
          {/* Placeholder for video/animation */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1608822646197-09f1cf4be3c1?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-xuan/90 via-transparent to-transparent"></div>
          
          <div className="relative z-10 w-20 h-20 rounded-full border-2 border-amber/70 flex items-center justify-center bg-xuan/50 backdrop-blur-sm group-hover:scale-110 group-hover:border-amber group-hover:bg-jiang/40 transition-all duration-500">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-bone border-b-[10px] border-b-transparent ml-1"></div>
          </div>
          
          <div className="absolute bottom-6 left-8 z-10">
            <span className="bg-jiang/80 text-bone text-xs px-3 py-1 rounded-full font-sans tracking-widest">數位說書</span>
            <h3 className="text-2xl font-serif text-bone mt-3 drop-shadow-md">第一回：海上的星芒</h3>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p ref={textRef} className="text-bone/80 font-sans leading-loose text-lg md:text-xl tracking-wide opacity-0">
            透過現代的旁白說書與傳統彩墨視覺的碰撞，
            <br className="hidden md:block" />
            帶您走入巷弄間，聆聽那些被歲月溫柔包裹的信仰故事。
          </p>
        </div>
      </div>
    </div>
  );
}
