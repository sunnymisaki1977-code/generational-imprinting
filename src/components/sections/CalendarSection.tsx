import { getGodsData } from "@/lib/notion";
import CalendarSectionClient from "./CalendarSectionClient";

export default async function CalendarSection() {
  const allData = await getGodsData();
  const solars = allData.filter(d => d.category === "歲時");
  
  return <CalendarSectionClient solars={solars} />;
}
