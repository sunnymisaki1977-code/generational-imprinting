import { getGodsData } from "@/lib/notion";
import WikiSectionClient from "./WikiSectionClient";

export default async function WikiSection() {
  const gods = await getGodsData();
  
  return <WikiSectionClient gods={gods} />;
}
