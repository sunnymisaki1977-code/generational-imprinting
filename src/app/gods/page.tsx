import Navbar from "@/components/layout/Navbar";
import WikiSection from "@/components/sections/WikiSection";

export const revalidate = false;

export const metadata = {
  title: "諸神・紀略 | 世代銘印",
  description: "收錄臺灣世代信仰神仙列傳，應用儒、釋、道三教分類與主題標籤進行探索與研考。",
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
