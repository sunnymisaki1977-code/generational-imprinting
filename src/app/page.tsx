import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import WikiSection from "@/components/sections/WikiSection";
import StorySection from "@/components/sections/StorySection";
import CalendarSection from "@/components/sections/CalendarSection";
import LiteratureSection from "@/components/sections/LiteratureSection";
import MapSection from "@/components/sections/MapSection";

export const revalidate = false; // 永久不自動更新

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-xuan text-bone selection:bg-amber selection:text-xuan">
      <Navbar />
      
      <div className="w-full">
        {/* 卷首・映象 */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* 諸神・紀略 */}
        <section id="wiki">
          <WikiSection />
        </section>

        {/* 歲時・紀曆 */}
        <section id="calendar">
          <CalendarSection />
        </section>

        {/* 說書・影音 */}
        <section id="story">
          <StorySection />
        </section>

        {/* 研考・文獻 */}
        <section id="literature">
          <LiteratureSection />
        </section>

        {/* 尋蹤・地圖 */}
        <section id="map">
          <MapSection />
        </section>
      </div>
    </main>
  );
}
