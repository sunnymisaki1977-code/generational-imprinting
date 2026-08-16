import { getGodsData } from "@/lib/notion";
import DrawClient from "./DrawClient";

export const revalidate = 600;

export default async function DrawPage() {
  const gods = await getGodsData();

  return (
    <main className="min-h-screen bg-rice flex flex-col relative font-sans text-ink selection:bg-amber selection:text-xuan">
      <div className="absolute top-0 left-0 w-full h-2 bg-vermilion z-10" />
      <DrawClient gods={gods} />
    </main>
  );
}
