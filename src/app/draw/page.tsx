export const dynamic = 'force-dynamic';
import fs from "fs";
import path from "path";
import DrawClient from "./DrawClient";

export const revalidate = false;

export default async function DrawPage() {
  // 銝???Notion嚗?箏? public/Wish Card 鞈?憭曇?????瑼?  const dirPath = path.join(process.cwd(), "public", "Wish Card");
  let wishCards: any[] = [];

  try {
    const files = fs.readdirSync(dirPath);
    wishCards = files
      .filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"))
      .map((file, index) => {
        // 敺???????蝔梧?靘? "銝控?? (1).png" -> "銝控??"
        const name = file.replace(/\s*\(\d+\)\.(png|jpe?g)$/i, '').replace(/\.(png|jpe?g)$/i, '');
        
        return {
          id: `wish-${index}`,
          name: name,
          title: "",
          desc: "",
          tags: [],
          image: `/Wish Card/${file}`, // ??喟策摰Ｘ蝡舐??詨?頝臬?
          category: "?? // 蝚血? GodData 隞??閮剖?        };
      });
  } catch (error) {
    console.error("霈??Wish Card 鞈?憭曉仃??", error);
  }

  return (
    <main className="min-h-screen bg-rice flex flex-col relative font-sans text-ink selection:bg-amber selection:text-xuan">
      <div className="absolute top-0 left-0 w-full h-2 bg-vermilion z-10" />
      <DrawClient gods={wishCards} />
    </main>
  );
}

