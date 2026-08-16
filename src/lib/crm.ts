import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function saveLineUser(userId: string, displayName?: string) {
  const crmDbId = process.env.NOTION_CRM_ID;
  if (!crmDbId) {
    console.warn("NOTION_CRM_ID is not set. Skipping user save.");
    return;
  }

  try {
    // 1. 檢查使用者是否已經存在
    const existingUsers = await notion.databases.query({
      database_id: crmDbId,
      filter: {
        property: "userId",
        rich_text: {
          equals: userId,
        },
      },
    });

    if (existingUsers.results.length > 0) {
      console.log(`User ${userId} already exists in CRM.`);
      return;
    }

    // 2. 建立新使用者
    await notion.pages.create({
      parent: { database_id: crmDbId },
      properties: {
        "Name": {
          title: [
            {
              text: {
                content: displayName || "LINE User",
              },
            },
          ],
        },
        "userId": {
          rich_text: [
            {
              text: {
                content: userId,
              },
            },
          ],
        },
        "RegisteredAt": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });
    console.log(`Successfully saved user ${userId} to CRM.`);
  } catch (error) {
    console.error("Failed to save LINE user to CRM", error);
  }
}

export async function getAllLineUsers(): Promise<string[]> {
  const crmDbId = process.env.NOTION_CRM_ID;
  if (!crmDbId) return [];

  try {
    let users: string[] = [];
    let hasMore = true;
    let cursor: string | undefined = undefined;

    while (hasMore) {
      const response = await notion.databases.query({
        database_id: crmDbId,
        start_cursor: cursor,
      });

      const batch = response.results.map((page: any) => {
        const userIdProp = page.properties.userId?.rich_text;
        if (userIdProp && userIdProp.length > 0) {
          return userIdProp[0].plain_text;
        }
        return null;
      }).filter(Boolean);

      users = [...users, ...batch];
      hasMore = response.has_more;
      cursor = response.next_cursor || undefined;
    }

    return users;
  } catch (error) {
    console.error("Failed to fetch LINE users", error);
    return [];
  }
}
