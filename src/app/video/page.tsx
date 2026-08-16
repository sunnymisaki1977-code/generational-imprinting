import VideoClient from "./VideoClient";

export const metadata = {
  title: "說書影音劇院 | 世代銘印",
};

export default function VideoPage() {
  return (
    <main className="min-h-screen bg-ink flex flex-col relative font-sans text-rice selection:bg-amber selection:text-ink">
      <div className="absolute top-0 left-0 w-full h-1 bg-vermilion z-10" />
      <VideoClient />
    </main>
  );
}
