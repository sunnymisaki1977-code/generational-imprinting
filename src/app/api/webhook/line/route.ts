import { NextRequest, NextResponse } from "next/server";
import { messagingApi } from "@line/bot-sdk";
import { saveLineUser } from "@/lib/crm";
import { getGodsData } from "@/lib/notion";

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process all events
    for (const event of body.events || []) {
      if (event.type === 'follow') {
        const userId = event.source?.userId;
        if (userId) {
          await saveLineUser(userId);
        }
      }

      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source?.userId;
        if (userId) {
          // 在背景更新使用者 (無須 await 避免卡住回覆)
          saveLineUser(userId).catch(console.error);
        }
        
        const userText = event.message.text.trim();
        const allData = await getGodsData();
        
        // 尋找符合的神明或節氣
        const match = allData.find(d => 
          d.name.includes(userText) || 
          userText.includes(d.name) ||
          d.tags.some(tag => tag.includes(userText))
        );
        
        if (match) {
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "flex",
                altText: `為您查詢到：${match.name}`,
                contents: {
                  type: "bubble",
                  hero: {
                    type: "image",
                    url: match.image,
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
                        text: match.name,
                        weight: "bold",
                        size: "xl",
                        color: "#a43329"
                      },
                      {
                        type: "text",
                        text: match.title,
                        size: "md",
                        color: "#171717",
                        margin: "md"
                      },
                      {
                        type: "text",
                        text: match.desc.length > 80 ? match.desc.substring(0, 80) + "..." : match.desc,
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
        } else {
          // Default reply
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "text",
                text: "抱歉，目前找不到這尊神明或節氣 😥\n您可以輸入例如「關聖帝君」或「立春」試試看喔！"
              }
            ]
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
