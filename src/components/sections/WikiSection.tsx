import fs from "fs";
import path from "path";
import { getGodsData } from "@/lib/notion";
import WikiSectionClient from "./WikiSectionClient";

export default async function WikiSection() {
  let allData: any[] = [];
  try {
    allData = await getGodsData();
  } catch (error) {
    console.error("Failed to fetch Notion data for Gods:", error);
  }
  const notionGods = allData.filter(d => d.category !== "歲時");

  // Read local Gods card directory
  const dirPath = path.join(process.cwd(), "public", "Gods card");
  let localFiles: string[] = [];
  try {
    const files = fs.readdirSync(dirPath);
    localFiles = files.filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"));
  } catch (error) {
    console.error("Failed to read Gods card directory:", error);
  }

  // Merge local files with Notion data (or fallback)
  const mergedGods = localFiles.map((file, index) => {
    const godName = file.replace(/\s*\(\d+\)\.(png|jpe?g)$/i, '').replace(/\.(png|jpe?g)$/i, '');
    const notionData = notionGods.find(d => d.name === godName);

    return {
      id: notionData?.id || `local-god-${index}`,
      name: godName,
      title: notionData?.title || "世傳信仰",
      desc: notionData?.desc || "資料整理中，即將更新...",
      tags: notionData?.tags || [],
      image: `/Gods card/${file}`, // Always use local image for the front
      poem: notionData?.poem || "",
      category: notionData?.category || "道"
    };
  });

  return <WikiSectionClient gods={mergedGods} />;
}
