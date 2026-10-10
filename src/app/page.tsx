export const dynamic = 'force-dynamic';
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import WikiSection from "@/components/sections/WikiSection";
import StorySection from "@/components/sections/StorySection";
import CalendarSection from "@/components/sections/CalendarSection";
import LiteratureSection from "@/components/sections/LiteratureSection";
import MapSection from "@/components/sections/MapSection";

export const revalidate = false; // 瘞訾?銝???
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-xuan text-bone selection:bg-amber selection:text-xuan">
      <Navbar />
      
      <div className="w-full">
        {/* ?琿??餅?鞊?*/}
        <section id="hero">
          <HeroSection />
        </section>

        {/* 隢貊??餌???*/}
        <section id="wiki">
          <WikiSection />
        </section>

        {/* 甇脫??餌???*/}
        <section id="calendar">
          <CalendarSection />
        </section>

        {/* 隤芣?餃蔣??*/}
        <section id="story">
          <StorySection />
        </section>

        {/* ?? */}
        <section id="literature">
          <LiteratureSection />
        </section>

        {/* 撠馱?餃??*/}
        <section id="map">
          <MapSection />
        </section>
      </div>
    </main>
  );
}

