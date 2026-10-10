export const dynamic = 'force-dynamic';
import { getYoutubeVideos } from "@/lib/youtube";
import VideoClient from "./VideoClient";

export const metadata = {
  title: "隤芣敶梢? | 銝誨?",
};

export const revalidate = false;

export default async function VideoPage() {
  // ???拙????剜皜
  const [adultVideos, kidsVideos] = await Promise.all([
    getYoutubeVideos("PLAvQkft9FbPU"), // 憭找犖??    getYoutubeVideos("PLBzrfvnms1-o")  // 撠???
  ]);

  return (
    <main className="min-h-screen bg-ink flex flex-col relative font-sans text-rice selection:bg-amber selection:text-ink">
      <div className="absolute top-0 left-0 w-full h-1 bg-vermilion z-10" />
      <VideoClient adultVideos={adultVideos} kidsVideos={kidsVideos} />
    </main>
  );
}

