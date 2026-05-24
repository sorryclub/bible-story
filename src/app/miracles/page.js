import { getAllMiracles, miracleCategories } from "@/lib/db";
import MiraclesClient from "./MiraclesClient";

export default async function MiraclesPage() {
  const miracles = await getAllMiracles();

  return <MiraclesClient miracles={miracles} miracleCategories={miracleCategories} />;
}
