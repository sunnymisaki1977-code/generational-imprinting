"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LiteratureSection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | HTMLQuoteElement | HTMLHeadingElement | null)[]>([]);

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

    // Box border reveal
    gsap.fromTo(textBlockRef.current,
      { opacity: 0, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textBlockRef.current,
          start: "top 75%",
        }
      }
    );

    // Text lines highlight/reveal sequentially
    gsap.fromTo(linesRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: textBlockRef.current,
          start: "top 60%",
        }
      }
    );

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-rice relative">
      {/* Decorative vertical text (simulating ancient scroll) */}
      <div className="absolute right-10 top-1/4 bottom-1/4 hidden lg:flex flex-col items-center justify-center pointer-events-none opacity-40">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-vermilion to-transparent"></div>
        <div className="writing-vertical-rl text-vermilion font-serif tracking-[1em] text-lg absolute bg-rice py-8">
          稽古考證以傳世
        </div>
      </div>

      <div className="max-w-5xl w-full z-10">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink mb-20 text-center tracking-widest opacity-0">
          【研考・文獻】
        </h2>
        
        <div className="font-sans">
          <div 
            ref={textBlockRef}
            className="flex flex-col md:flex-row relative border-y-2 border-ink py-16 opacity-0"
          >
            {/* 朱紅垂直分隔線 */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-vermilion opacity-30 transform -translate-x-1/2"></div>
            
            {/* 左欄 (古文原文) */}
            <div className="flex-1 md:pr-16 flex flex-col justify-center items-end text-right md:border-none border-b border-ink/20 pb-12 md:pb-0 mb-12 md:mb-0">
              <span className="text-vermilion font-sans text-xs tracking-widest mb-4 block">原文典籍</span>
              <h3 ref={(el) => { linesRef.current[0] = el; }} className="text-2xl font-serif text-ink mb-6 opacity-0">
                源流考證：尋根與轉譯
              </h3>
              <blockquote ref={(el) => { linesRef.current[1] = el; }} className="font-serif text-xl md:text-2xl text-ink/80 leading-loose opacity-0 tracking-widest">
                「古籍節錄對照，重塑民俗美感，<br/>使其昇華至藝術層次。」
              </blockquote>
            </div>
            
            {/* 右欄 (現代譯文) */}
            <div className="flex-1 md:pl-16 flex flex-col justify-center text-left">
              <span className="text-vermilion font-sans text-xs tracking-widest mb-4 block">現代釋解</span>
              <p ref={(el) => { linesRef.current[2] = el; }} className="mb-6 text-lg text-ink/80 leading-loose opacity-0">
                以嚴謹的文獻考究取代民間迷信，我們致力於提供具公信力的文化知識。將艱澀難懂的古文智慧轉化為現代語境，打破世代間的溝通隔閡。
              </p>
              <p ref={(el) => { linesRef.current[3] = el; }} className="text-lg text-ink/80 leading-loose opacity-0">
                透過數位典藏的形式，確保民俗文化在快速變遷的現代社會中得以延續。我們企圖翻轉傳統民俗往往被視為「低俗、陳舊」的刻板印象，賦予其全新的生命力。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
