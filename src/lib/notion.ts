/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";
import { cache } from "react";

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
  poem?: string;
  category: "儒" | "釋" | "道" | "歲時";
}

export const getGodsData = cache(async (): Promise<GodData[]> => {
  let databaseId = process.env.NOTION_GODS_ID || process.env.NOTION_DATABASE_ID || "3a483ac4-2037-80aa-9964-000b61961d9e";
  if (databaseId.replace(/-/g, "") === "3a483ac4203780c89a41d8f53601c864") {
    databaseId = "3a483ac4-2037-80aa-9964-000b61961d9e";
  }
  
  if (!databaseId || !process.env.NOTION_API_KEY) {
    console.warn("Missing Notion API keys");
    return [];
  }

  try {
    // 1. 取得資料庫中的所有頁面，處理分頁 (Notion API 預設單次最多 100 筆)
    let allPages: any[] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const queryParams: any = {
        database_id: databaseId,
      };
      if (cursor) {
        queryParams.start_cursor = cursor;
      }
      const response = await (notion.databases as any).query(queryParams);
      
      allPages.push(...response.results);
      hasMore = response.has_more;
      cursor = response.next_cursor || undefined;
    }

    const gods: GodData[] = [];
    const nameCounts: Record<string, number> = {};

    // 2. 針對每一個頁面，取得裡面的內容 (Blocks)
    for (const page of allPages) {
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
      let poem = "";
      let isPromptSection = false;
      let imageUrl = "";

      for (const block of blocks) {
        if (!('type' in block)) continue;

        // 處理標題 (Heading 2 或 Heading 3)
        if (block.type === 'heading_2' || block.type === 'heading_3') {
          const headingObj = (block as any)[block.type];
          if (headingObj?.rich_text && Array.isArray(headingObj.rich_text) && headingObj.rich_text.length > 0) {
            const headingText = (headingObj.rich_text as any[]).map(t => t.plain_text).join("");
            
            // 如果遇到 "生成圖像", 則標記並跳過後續所有內容
            if (headingText.includes("生成圖像")) {
              isPromptSection = true;
              continue;
            }
            
            // 如果還沒設定過副標題，則將第一個標題設為副標題
            if (!title) {
              title = headingText;
            }
          }
          continue;
        }

        // 如果進入了生成圖像區塊，直接跳過 (包含英文提示詞)
        if (isPromptSection) continue;

        // 處理引言 (Quote) - 作為卡片左上角的詩句
        if (block.type === 'quote') {
          const textArr = (block as any).quote?.rich_text;
          if (textArr && Array.isArray(textArr) && textArr.length > 0) {
            poem = (textArr as any[]).map(t => t.plain_text).join("");
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
          } else {
            // 一般內文描述
            desc += desc ? `\n${text}` : text;
          }
        }
      }

      // 分類邏輯 (儒、釋、道、歲時)
      let category: "儒" | "釋" | "道" | "歲時" = "道"; // 預設為道教與民間信仰
      const textToMatch = `${name} ${title} ${tags.join(" ")} ${desc}`.toLowerCase();
      const strictTextToMatch = `${name} ${title} ${tags.join(" ")}`.toLowerCase();
      
      if (/節氣|歲時|七十二候|物候|立春|雨水|驚蟄|春分|清明|穀雨|立夏|小滿|芒種|夏至|小暑|大暑|立秋|處暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至|小寒|大寒/.test(strictTextToMatch)) {
        category = "歲時";
      } else if (/佛|菩薩|觀音|觀世音|如來|彌勒|濟公|羅漢|禪|僧|普賢|文殊|地藏|達摩|釋迦|金剛|般若|藏王/.test(textToMatch)) {
        category = "釋";
      } else if (/孔子|至聖|文昌|魁星|朱衣|魁斗|儒|學士|狀元|四書|五經|孟子|朱熹|王陽明|夫子|書院|倉頡|主考|文衡|考運|科舉|學業/.test(textToMatch)) {
        category = "儒";
      }

      nameCounts[name] = (nameCounts[name] || 0) + 1;
      const index = nameCounts[name];
      const imageSuffix = index === 1 ? "" : ` (${index})`; // 加上一個空白以符合 Windows 預設的命名習慣
      const filename = `${name}${imageSuffix}.png`;
      const folderName = category === "歲時" ? "Solar%20card" : "Gods%20card";
      const defaultImage = `/${folderName}/${encodeURIComponent(filename)}`;

      gods.push({
        id: page.id,
        name,
        title: title || "神明列傳",
        desc: desc || "尚無文獻資料。",
        tags: tags.length > 0 ? tags : ["信仰", "傳承"],
        image: defaultImage,
        poem: poem || "神威顯赫",
        category,
      });
    }

    if (gods.length === 0) {
      throw new Error("No data found in Notion");
    }

    return gods;
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    // 為了不讓版面變成空白，當 Notion 無法連線時，提供一組預設展示用的卡片資料 (包含 public 內所有神明)
    return [
      { 
        id: "mock1", name: "關聖帝君", title: "忠義雙全的武財神", desc: "探討從三國將領至民間信仰的造神軌跡，結合商業守護與忠義精神的演變。",
        tags: ["武財神", "忠義", "商賈"], image: "", poem: "青龍偃月鎮千秋，忠義神武耀神州。", category: "儒"
      },
      { 
        id: "mock2", name: "玉皇大帝", title: "天界至尊的權威信仰", desc: "解析民間對於天界最高主宰的崇拜，以及其在道教與民間信仰中的融合與演變。",
        tags: ["天公", "至尊", "主宰"], image: "", poem: "統御萬靈主造化，恩光普照護蒼生。", category: "道"
      },
      { 
        id: "mock3", name: "五殿閻羅王", title: "掌管生死的冥界判官", desc: "深入探討十殿閻羅的民間傳說，以及其勸人向善、善惡分明的宗教意義。",
        tags: ["冥界", "審判", "輪迴"], image: "", poem: "鐵面無私明善惡，森羅殿上判幽明。", category: "道"
      },
      {
        id: "mock4", name: "上元賜福天官大帝", title: "三官大帝之上元", desc: "正月十五天官賜福，考證三官信仰與道教天地的宇宙觀。",
        tags: ["天官", "賜福", "三官"], image: "", poem: "賜福消災解厄難，上元降駕紫微宮。", category: "道"
      },
      {
        id: "mock5", name: "五年千歲羅千歲", title: "代天巡狩的王爺信仰", desc: "解析王爺信仰中五年一科的祭典儀式與瘟神信仰的轉化。",
        tags: ["王爺", "千歲", "代天巡狩"], image: "", poem: "代天巡狩威靈顯，五年一科佑萬民。", category: "道"
      },
      {
        id: "mock6", name: "元始天尊", title: "道教最高神明", desc: "探討三清尊神之首的起源，以及道教創世神話的神學建構。",
        tags: ["三清", "道教", "創世"], image: "", poem: "混元初判道為尊，無極生太極肇玄黃。", category: "道"
      },
      {
        id: "mock7", name: "孫天醫真人", title: "藥王孫思邈", desc: "從歷史名醫到民間醫神的造神過程，解析傳統醫學與宗教的結合。",
        tags: ["醫神", "藥王", "治病"], image: "", poem: "妙手回春施聖手，千金要方濟世間。", category: "道"
      },
      {
        id: "mock8", name: "彌勒尊佛", title: "未來佛的歡喜象徵", desc: "解析彌勒信仰在漢傳佛教中的流變，從莊嚴菩薩到大肚彌勒的形象轉化。",
        tags: ["佛教", "未來佛", "歡喜"], image: "", poem: "大肚能容天下事，笑口常開度群迷。", category: "釋"
      },
      {
        id: "mock9", name: "武德尊侯沈祖公", title: "[道] 唐代開漳功臣與沈氏血緣地緣守護神", desc: "原名沈世紀，為唐代開漳名將。於台灣民間信仰中，具備血緣祖靈與地緣守護神之雙重性格，深受沈氏族人崇祀。",
        tags: ["開漳功臣", "血緣神明", "沈氏宗親"], image: "", poem: "武烈昭彰護閩台，德馨遠播祖風長。", category: "道"
      },
      {
        id: "mock10", name: "清水祖師", title: "除瘟祈雨的高僧", desc: "從北宋禪師至閩南安溪人的守護神，解析佛教僧侶神格化的過程。",
        tags: ["高僧", "祈雨", "閩南"], image: "", poem: "落鼻示警顯神威，黑面祖師鎮蓬萊。", category: "道"
      },
      {
        id: "mock11", name: "臨水夫人陳靖姑", title: "婦幼的慈悲守護者", desc: "解析傳統社會中婦幼醫療匱乏下的救贖信仰，與閭山派法術的關聯。",
        tags: ["婦幼", "安產", "閭山"], image: "", poem: "斬蛇除妖救產難，護國佑民顯母恩。", category: "道"
      },
      {
        id: "mock12", name: "門神戶尉", title: "守衛門戶的辟邪神", desc: "從神荼鬱壘到秦瓊敬德，探討門神信仰的歷史演進與民俗意涵。",
        tags: ["門神", "辟邪", "鎮宅"], image: "", poem: "威武持鐧護朱門，鎮宅驅邪保平安。", category: "道"
      }
    ];
  }
});
