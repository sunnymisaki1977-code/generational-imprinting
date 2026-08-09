"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CalendarSection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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

    gsap.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        }
      }
    );

  }, { scope: container });

  return (
    <div ref={container} className="min-h-[80vh] flex flex-col items-center justify-center py-24 px-4 md:px-10 bg-rice transition-colors duration-700">
      <div className="max-w-7xl w-full flex flex-col items-center">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center tracking-widest opacity-0 font-bold">
          【歲時・紀曆】
        </h2>
        
        <div className="w-full max-w-4xl bg-ink/[0.02] border border-ink/10 rounded-2xl p-12 text-center shadow-inner">
          <p ref={textRef} className="text-ink/60 font-sans text-lg tracking-widest leading-loose opacity-0">
            歲時紀曆內容建置中...<br/>
            敬請期待
          </p>
        </div>
      </div>
    </div>
  );
}
