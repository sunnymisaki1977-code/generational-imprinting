import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface GodData {
  id: string;
  name: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
}

export async function getGodsData(): Promise<GodData[]> {
  const databaseId = process.env.NOTION_GODS_ID || process.env.NOTION_DATABASE_ID;
  
  if (!databaseId || !process.env.NOTION_API_KEY) {
    console.warn("Missing Notion API keys");
    return [];
  }

  try {
    // 1. 取得資料庫中的所有頁面
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    });

    const gods: GodData[] = [];

    // 2. 針對每一個頁面，取得裡面的內容 (Blocks)
    for (const page of response.results) {
      if (!('properties' in page)) continue;
      
      const nameProp = page.properties.Name;
      let name = "";
      if (nameProp?.type === 'title' && Array.isArray(nameProp.title) && nameProp.title.length > 0) {
        name = (nameProp.title as any[])[0].plain_text;
      }
      
      if (!name) continue;

      // 取得頁面內容
      const blocksResponse = await notion.blocks.children.list({
        block_id: page.id,
      });
      const blocks = blocksResponse.results;

      let title = "";
      let desc = "";
      let tags: string[] = [];

      for (const block of blocks) {
        if (!('type' in block)) continue;

        // 解析副標題 (通常是 Heading 3 或 Heading 2)
        if (!title && (block.type === 'heading_2' || block.type === 'heading_3')) {
          const headingObj = (block as any)[block.type];
          if (headingObj?.rich_text && Array.isArray(headingObj.rich_text) && headingObj.rich_text.length > 0) {
            title = (headingObj.rich_text as any[]).map(t => t.plain_text).join("");
          }
          continue;
        }

        // 解析段落與標籤
        if (block.type === 'paragraph') {
          const textArr = (block as any).paragraph?.rich_text;
          if (!textArr || !Array.isArray(textArr) || textArr.length === 0) continue;
          
          const text = (textArr as any[]).map(t => t.plain_text).join("");
          
          // 如果這段文字包含 "標籤:"，則解析為標籤
          if (text.includes("標籤:") || text.includes("#")) {
            const rawTags = text.replace("標籤:", "").split("#").map(t => t.trim()).filter(t => t);
            tags = rawTags;
          } 
          // 否則如果是「生成圖像 Prom」之類的系統文字就略過
          else if (!text.includes("生成圖像")) {
            desc += desc ? `\n${text}` : text;
          }
        }
      }

      gods.push({
        id: page.id,
        name,
        title: title || "神明列傳",
        desc: desc || "尚無文獻資料。",
        tags: tags.length > 0 ? tags : ["信仰", "傳承"],
        image: `/Gods card/${name}.png`, // 自動對應 public 目錄下的圖片
      });
    }

    return gods;
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return [];
  }
}
