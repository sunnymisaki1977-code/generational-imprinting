export const dynamic = 'force-dynamic';
import Navbar from "@/components/layout/Navbar";
import WikiSection from "@/components/sections/WikiSection";

export const revalidate = false;

export const metadata = {
  title: "隢貊??餌???| 銝誨?",
  description: "?園??箇銝誨靽∩趕蟡??嚗??典?????銝????蜓憿?蝐日脰??Ｙ揣????,
};

export default function GodsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-xuan text-bone selection:bg-amber selection:text-xuan">
      <Navbar />
      <div className="w-full pt-16">
        <section id="wiki">
          <WikiSection />
        </section>
      </div>
    </main>
  );
}

