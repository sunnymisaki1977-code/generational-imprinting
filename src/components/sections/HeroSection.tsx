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
    <div ref={container} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-xuan">
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-b from-jiang/30 to-xuan z-0 scale-110"
        style={{ transformOrigin: 'top center' }}
      ></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599827552599-eda798622152?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-serif text-amber mb-6 drop-shadow-lg opacity-0">
          講一個
          <br />
          <span className="text-bone">巷弄神明</span>的日常
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl text-bone/80 font-sans max-w-2xl mx-auto leading-relaxed tracking-wider opacity-0">
          解碼那些銘印於心的文化密碼
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce flex flex-col items-center opacity-50">
        <span className="text-bone/50 text-xs mb-2 tracking-widest font-sans uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber to-transparent"></div>
      </div>
    </div>
  );
}
