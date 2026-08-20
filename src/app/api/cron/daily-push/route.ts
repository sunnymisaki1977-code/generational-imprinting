import { NextResponse } from "next/server";
import { messagingApi } from "@line/bot-sdk";
import { getAllLineUsers } from "@/lib/crm";
import { getGodsData, GodData } from "@/lib/notion";
// @ts-ignore
import { Solar, Lunar } from "lunar-javascript";

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

export const revalidate = 0; // Disable cache for this route

export async function GET() {
  try {
    // 1. 計算日期 (今天 & 三天後)
    const today = new Date();
    const todaySolar = Solar.fromDate(today);
    const todayLunar = Lunar.fromDate(today);
    
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    const futureSolar = Solar.fromDate(threeDaysLater);
    const futureLunar = Lunar.fromDate(threeDaysLater);

    // 格式化農曆日期，例如 "06-24" (關聖帝君生日)
    const formatLunarDate = (lunar: typeof Lunar) => {
      const m = lunar.getMonth().toString().padStart(2, '0');
      const d = lunar.getDay().toString().padStart(2, '0');
      return `${m}-${d}`;
    };

    const todayLunarStr = formatLunarDate(todayLunar);
    const futureLunarStr = formatLunarDate(futureLunar);

    // 節氣名稱對應 (簡體轉繁體)
    const tradJieQiMap: Record<string, string> = {
      '立春':'立春','雨水':'雨水','惊蛰':'驚蟄','春分':'春分','清明':'清明','谷雨':'穀雨',
      '立夏':'立夏','小满':'小滿','芒种':'芒種','夏至':'夏至','小暑':'小暑','大暑':'大暑',
      '立秋':'立秋','处暑':'處暑','白露':'白露','秋分':'秋分','寒露':'寒露','霜降':'霜降',
      '立冬':'立冬','小雪':'小雪','大雪':'大雪','冬至':'冬至','小寒':'小寒','大寒':'大寒'
    };

    // 取得節氣
    const getJieQiExactDay = (solar: typeof Solar, lunar: typeof Lunar) => {
      // lunar.getJieQi() 會回傳當天的節氣名稱，如果當天不是節氣則回傳空字串
      const jq = lunar.getJieQi();
      return jq ? (tradJieQiMap[jq] || jq) : null;
    };

    const todayJieQi = getJieQiExactDay(todaySolar, todayLunar);
    const futureJieQi = getJieQiExactDay(futureSolar, futureLunar);

    // 2. 讀取所有資料
    const allData = await getGodsData();
    
    // 找出符合的資料
    const todayGods = allData.filter(d => d.birthday && (d.birthday.includes(todayLunarStr) || d.birthday.includes(`${todayLunar.getMonth()}月${todayLunar.getDay()}日`)));
    const futureGods = allData.filter(d => d.birthday && (d.birthday.includes(futureLunarStr) || d.birthday.includes(`${futureLunar.getMonth()}月${futureLunar.getDay()}日`)));
    
    const todaySolarCard = todayJieQi ? allData.find(d => d.name === todayJieQi) : null;
    const futureSolarCard = futureJieQi ? allData.find(d => d.name === futureJieQi) : null;

    let pushedMessages = [];

    // --- 【預告推播】三天後的事件 (廣播給所有人) ---
    const broadcastMessages = [];
    if (futureJieQi) {
      broadcastMessages.push({
        type: "text",
        text: `【節氣預告】再過三天就是「${futureJieQi}」了！\n記得留意天氣變化，當天我們將會準備專屬的節氣圖卡送給您喔！`
      });
    }
    for (const god of futureGods) {
      broadcastMessages.push({
        type: "text",
        text: `【聖誕預告】再過三天 (農曆 ${futureLunar.getMonth()}月${futureLunar.getDay()}日) 就是「${god.name}」的聖誕千秋！\n誠心祝壽，保佑平安順心。`
      });
    }

    if (broadcastMessages.length > 0 && channelAccessToken) {
      // @ts-ignore
      await client.broadcast({ messages: broadcastMessages });
      pushedMessages.push("Broadcast 3-day warning");
    }

    // --- 【當天推播】今天的事件 (發送圖卡給會員) ---
    const users = await getAllLineUsers();
    if (users.length > 0 && channelAccessToken) {
      const multicastMessages = [];
      
      if (todaySolarCard) {
        multicastMessages.push(createFlexMessage(todaySolarCard, "節氣圖卡"));
      }
      for (const god of todayGods) {
        multicastMessages.push(createFlexMessage(god, "神諭圖卡"));
      }

      if (multicastMessages.length > 0) {
        // LINE Multicast API 每次最多發送給 500 人，如果會員超過 500 人需要分批
        // 這裡先簡單實作單次發送 (假設初期人數 < 500)
        // @ts-ignore
        await client.multicast({
          to: users,
          messages: multicastMessages
        });
        pushedMessages.push("Multicast today cards to " + users.length + " users");
      }
    }

    return NextResponse.json({ 
      status: "success", 
      todayLunar: todayLunarStr,
      todayJieQi,
      futureJieQi,
      todayGods: todayGods.map(g => g.name),
      futureGods: futureGods.map(g => g.name),
      pushedMessages 
    });

  } catch (error) {
    console.error("Daily Push Error:", error);
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 });
  }
}

// 產生精美的 Flex Message 卡片
function createFlexMessage(data: GodData, cardType: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://genimpring.vercel.app";
  // 如果圖片是相對路徑，補上 baseUrl
  const imageUrl = data.image.startsWith("http") ? data.image : `${baseUrl}${data.image}`;
  
  return {
    type: "flex",
    altText: `收到專屬的${cardType}：${data.name}`,
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: imageUrl,
        size: "full",
        aspectRatio: "9:16",
        aspectMode: "cover",
        action: {
          type: "uri",
          label: "查看詳情",
          uri: `${baseUrl}/gods`
        }
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `【會員專屬${cardType}】`,
            color: "#06C755",
            weight: "bold",
            size: "sm"
          },
          {
            type: "text",
            text: data.name,
            weight: "bold",
            size: "xl",
            color: "#a43329",
            margin: "md"
          },
          {
            type: "text",
            text: data.poem || data.title,
            size: "md",
            color: "#171717",
            margin: "sm"
          }
        ]
      }
    }
  };
}
