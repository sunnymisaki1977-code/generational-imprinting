import { getGodsData } from "@/lib/notion";
import WikiSectionClient from "./WikiSectionClient";

export default async function WikiSection() {
  const allData = await getGodsData();
  const gods = allData.filter(d => d.category !== "歲時");
  
  return <WikiSectionClient gods={gods} />;
}
