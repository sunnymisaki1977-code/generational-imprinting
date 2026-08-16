import { NextResponse } from "next/server";
import { messagingApi } from "@line/bot-sdk";
import { getAllLineUsers } from "@/lib/crm";
import { getGodsData } from "@/lib/notion";

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

export async function GET() {
  try {
    // 1. 取得所有註冊的 LINE 使用者
    const users = await getAllLineUsers();
    if (users.length === 0) {
      return NextResponse.json({ status: "skipped", reason: "no users" });
    }

    // 2. 取得歲時節氣資料
    const allData = await getGodsData();
    const solars = allData.filter(d => d.category === "歲時");
    
    if (solars.length === 0) {
      return NextResponse.json({ status: "skipped", reason: "no solar data" });
    }

    // 這裡為了展示概念，隨機取一個節氣來做推播 (實務上應依照日期推算下一個節氣)
    const upcomingSolar = solars[Math.floor(Math.random() * solars.length)];

    // 3. 廣播推播訊息 (Broadcast)
    await client.broadcast({
      messages: [
        {
          type: "flex",
          altText: `【節氣提醒】即將迎來：${upcomingSolar.name}`,
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: upcomingSolar.image,
              size: "full",
              aspectRatio: "3:4",
              aspectMode: "cover"
            },
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "【溫馨提醒】",
                  color: "#06C755",
                  weight: "bold",
                  size: "sm"
                },
                {
                  type: "text",
                  text: upcomingSolar.name,
                  weight: "bold",
                  size: "xl",
                  color: "#a43329",
                  margin: "md"
                },
                {
                  type: "text",
                  text: upcomingSolar.title,
                  size: "md",
                  color: "#171717",
                  margin: "sm"
                },
                {
                  type: "text",
                  text: upcomingSolar.desc.length > 80 ? upcomingSolar.desc.substring(0, 80) + "..." : upcomingSolar.desc,
                  wrap: true,
                  margin: "lg",
                  color: "#333333"
                }
              ]
            }
          }
        }
      ]
    });

    return NextResponse.json({ status: "success", pushed: upcomingSolar.name, userCount: users.length });
  } catch (error) {
    console.error("Solar Push Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
