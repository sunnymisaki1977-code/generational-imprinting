import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function testNotion(id: string, name: string) {
  try {
    console.log(`Testing ${name} (${id})...`);
    const response = await notion.dataSources.query({ data_source_id: id });
    console.log(`✅ Success for ${name}! Found ${response.results.length} items.`);
  } catch (error: any) {
    console.log(`❌ Failed for ${name}: ${error.message}`);
  }
}

async function run() {
  await testNotion(process.env.NOTION_DATABASE_ID as string, "NOTION_DATABASE_ID");
  await testNotion(process.env.NOTION_GODS_ID as string, "NOTION_GODS_ID");
}

run();
