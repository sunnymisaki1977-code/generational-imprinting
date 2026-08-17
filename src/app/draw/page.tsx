import fs from "fs";
import path from "path";
import DrawClient from "./DrawClient";

export const revalidate = false;

export default async function DrawPage() {
  // 不讀取 Notion，改為從 public/Wish Card 資料夾讀取所有圖檔
  const dirPath = path.join(process.cwd(), "public", "Wish Card");
  let wishCards: any[] = [];

  try {
    const files = fs.readdirSync(dirPath);
    wishCards = files
      .filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"))
      .map((file, index) => {
        // 從檔名萃取神明名稱，例如 "三山國王 (1).png" -> "三山國王"
        const name = file.replace(/\s*\(\d+\)\.(png|jpe?g)$/i, '').replace(/\.(png|jpe?g)$/i, '');
        
        return {
          id: `wish-${index}`,
          name: name,
          title: "",
          desc: "",
          tags: [],
          image: `/Wish Card/${file}`, // 這是傳給客戶端的相對路徑
          category: "道" // 符合 GodData 介面的預設值
        };
      });
  } catch (error) {
    console.error("讀取 Wish Card 資料夾失敗:", error);
  }

  return (
    <main className="min-h-screen bg-rice flex flex-col relative font-sans text-ink selection:bg-amber selection:text-xuan">
      <div className="absolute top-0 left-0 w-full h-2 bg-vermilion z-10" />
      <DrawClient gods={wishCards} />
    </main>
  );
}
