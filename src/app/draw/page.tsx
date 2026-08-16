import { getGodsData } from "@/lib/notion";
import DrawClient from "./DrawClient";

export const revalidate = 600;

export default async function DrawPage() {
  const allGods = await getGodsData();
  
  // 排除冥府系列 (一殿到十殿等)
  const gods = allGods.filter(god => {
    const textToMatch = `${god.name} ${god.title}`.toLowerCase();
    return !/(一殿|二殿|三殿|四殿|五殿|六殿|七殿|八殿|九殿|十殿|冥府|閻羅|地府)/.test(textToMatch);
  });

  return (
    <main className="min-h-screen bg-rice flex flex-col relative font-sans text-ink selection:bg-amber selection:text-xuan">
      <div className="absolute top-0 left-0 w-full h-2 bg-vermilion z-10" />
      <DrawClient gods={gods} />
    </main>
  );
}
