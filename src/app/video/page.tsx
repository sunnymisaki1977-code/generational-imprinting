import { getYoutubeVideos } from "@/lib/youtube";
import VideoClient from "./VideoClient";

export const metadata = {
  title: "說書影音劇院 | 世代銘印",
};

export const revalidate = false;

export default async function VideoPage() {
  // 抓取兩個不同的播放清單
  const [adultVideos, kidsVideos] = await Promise.all([
    getYoutubeVideos("PLAvQkft9FbPU"), // 大人版
    getYoutubeVideos("PLBzrfvnms1-o")  // 小朋友版
  ]);

  return (
    <main className="min-h-screen bg-ink flex flex-col relative font-sans text-rice selection:bg-amber selection:text-ink">
      <div className="absolute top-0 left-0 w-full h-1 bg-vermilion z-10" />
      <VideoClient adultVideos={adultVideos} kidsVideos={kidsVideos} />
    </main>
  );
}
