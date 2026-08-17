import fs from "fs";
import path from "path";
import { getGodsData } from "@/lib/notion";
import CalendarSectionClient from "./CalendarSectionClient";

export default async function CalendarSection() {
  let allData: any[] = [];
  try {
    allData = await getGodsData();
  } catch (error) {
    console.error("Failed to fetch Notion data for Solar:", error);
  }
  const notionSolars = allData.filter(d => d.category === "歲時");

  // Read local Solar card directory
  const dirPath = path.join(process.cwd(), "public", "Solar card");
  let localFiles: string[] = [];
  try {
    const files = fs.readdirSync(dirPath);
    localFiles = files.filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"));
  } catch (error) {
    console.error("Failed to read Solar card directory:", error);
  }

  // Merge local files with Notion data (or fallback)
  const mergedSolars = localFiles.map((file, index) => {
    const solarName = file.replace(/\s*\(\d+\)\.(png|jpe?g)$/i, '').replace(/\.(png|jpe?g)$/i, '');
    const notionData = notionSolars.find(d => d.name === solarName);

    return {
      id: notionData?.id || `local-solar-${index}`,
      name: solarName,
      title: notionData?.title || "節氣與智慧",
      desc: notionData?.desc || "資料整理中，即將更新...",
      tags: notionData?.tags || [],
      image: `/Solar card/${file}`, // Always use local image for the front
      poem: notionData?.poem || "",
      category: "歲時" as const
    };
  });

  return <CalendarSectionClient solars={mergedSolars} />;
}
