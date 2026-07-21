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
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-rice relative overflow-hidden flex-col">
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--color-vermilion)_0%,_transparent_70%)] opacity-[0.03] z-0 pointer-events-none mix-blend-multiply"
      ></div>
      
      <div className="max-w-6xl w-full relative z-10 flex-1 flex flex-col justify-center">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center tracking-widest opacity-0">
          【尋蹤・地圖】
        </h2>
        
        <div 
          ref={mapBoxRef}
          className="w-full aspect-[2/1] md:aspect-[2.5/1] bg-rice border border-ink rounded-lg flex flex-col items-center justify-center text-ink mb-16 relative overflow-hidden shadow-[8px_8px_0_#171717] opacity-0 group"
        >
          {/* Subtle grid background to look like a map */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMywgMjMsIDIzLCAwLjE1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* 閃爍的朱紅地標 Pin 點 */}
            <div className="relative mb-6">
              <div className="w-6 h-6 bg-vermilion rounded-full animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-6 h-6 bg-vermilion rounded-full relative z-10 border-2 border-rice shadow-md"></div>
            </div>
            
            <span className="font-sans text-xl md:text-2xl tracking-[0.2em] font-light text-ink/80 group-hover:text-ink transition-colors duration-500">
              信仰場域導覽 即將開放
            </span>
            <div className="mt-4 w-12 h-px bg-vermilion/50"></div>
          </div>
        </div>
      </div>

      <footer className="w-full relative z-10 border-t border-ink/20 pt-8 pb-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div className="text-ink font-serif text-xl font-bold tracking-widest mb-4 md:mb-0 flex items-center gap-2">
            <span className="w-2 h-2 bg-vermilion inline-block"></span>
            世代銘印
          </div>
          <p className="text-ink/60 font-sans text-xs md:text-sm tracking-wider">
            © {new Date().getFullYear()} Generational Imprinting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
