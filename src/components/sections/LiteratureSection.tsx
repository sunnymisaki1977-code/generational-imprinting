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
      { opacity: 0, scale: 0.98, borderColor: "rgba(244, 240, 235, 0)" },
      {
        opacity: 1,
        scale: 1,
        borderColor: "rgba(244, 240, 235, 0.1)",
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
    <div ref={container} className="min-h-screen flex items-center justify-center py-24 px-4 md:px-10 bg-xuan relative">
      {/* Decorative vertical text (simulating ancient scroll) */}
      <div className="absolute right-10 top-1/4 bottom-1/4 hidden lg:flex flex-col items-center justify-center pointer-events-none opacity-20">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-amber to-transparent"></div>
        <div className="writing-vertical-rl text-amber font-serif tracking-[1em] text-lg absolute bg-xuan py-8">
          稽古考證以傳世
        </div>
      </div>

      <div className="max-w-3xl w-full z-10">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-amber mb-16 text-center tracking-widest opacity-0">
          【研考・文獻】
        </h2>
        
        <div className="prose prose-invert prose-stone max-w-none font-sans">
          <div 
            ref={textBlockRef}
            className="bg-bone/[0.02] p-8 md:p-12 rounded-xl border border-bone/0 leading-loose text-bone/90 opacity-0 relative backdrop-blur-sm"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber/50 rounded-tl"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber/50 rounded-tr"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber/50 rounded-bl"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber/50 rounded-br"></div>

            <h3 ref={(el) => { linesRef.current[0] = el; }} className="text-2xl md:text-3xl font-serif text-bone mb-8 border-b border-jiang/40 pb-6 opacity-0">
              源流考證：尋根與轉譯
            </h3>
            
            <p ref={(el) => { linesRef.current[1] = el; }} className="mb-8 text-lg opacity-0">
              以嚴謹的文獻考究取代民間迷信，我們致力於提供具公信力的文化知識。將艱澀難懂的古文智慧轉化為現代語境，打破世代間的溝通隔閡。
            </p>
            
            <blockquote ref={(el) => { linesRef.current[2] = el; }} className="border-l-4 border-amber/80 pl-6 md:pl-8 italic text-bone/70 my-10 bg-jiang/10 py-6 pr-6 rounded-r-lg opacity-0 font-serif text-xl">
              「古籍節錄對照，重塑民俗美感，使其昇華至藝術層次。」
            </blockquote>
            
            <p ref={(el) => { linesRef.current[3] = el; }} className="text-lg opacity-0">
              透過數位典藏的形式，確保民俗文化在快速變遷的現代社會中得以延續。我們企圖翻轉傳統民俗往往被視為「低俗、陳舊」的刻板印象，賦予其全新的生命力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
