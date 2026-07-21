"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MapSection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

    // Map box scale up
    gsap.fromTo(mapBoxRef.current,
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mapBoxRef.current,
          start: "top 75%",
        }
      }
    );

    // Continuous breathing glow effect
    gsap.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-xuan relative overflow-hidden flex-col">
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--color-jiang)_0%,_transparent_70%)] opacity-30 z-0 pointer-events-none mix-blend-screen"
      ></div>
      
      <div className="max-w-6xl w-full relative z-10 flex-1 flex flex-col justify-center">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-amber mb-16 text-center tracking-widest opacity-0">
          【尋蹤・地圖】
        </h2>
        
        <div 
          ref={mapBoxRef}
          className="w-full aspect-[2/1] md:aspect-[2.5/1] bg-xuan/60 border border-jiang/60 rounded-2xl flex flex-col items-center justify-center text-bone mb-16 backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(58,23,36,0.3)] opacity-0 group"
        >
          {/* Subtle grid background to look like a map */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsIDE3NSwgNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-4xl mb-6 text-amber animate-bounce">📍</span>
            <span className="font-sans text-xl md:text-2xl tracking-[0.2em] font-light text-bone/90 group-hover:text-amber transition-colors duration-500">
              信仰場域導覽 即將開放
            </span>
            <div className="mt-4 w-12 h-px bg-amber/50"></div>
          </div>
        </div>
      </div>

      <footer className="w-full relative z-10 border-t border-jiang/30 pt-8 pb-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div className="text-amber font-serif text-xl font-bold tracking-widest mb-4 md:mb-0">
            世代銘印
          </div>
          <p className="text-bone/50 font-sans text-xs md:text-sm tracking-wider">
            © {new Date().getFullYear()} Generational Imprinting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
