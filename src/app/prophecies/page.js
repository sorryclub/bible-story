import { getAllProphecies, prophecyCategories } from "@/lib/db";
import PropheciesClient from "./PropheciesClient";

export default async function PropheciesPage() {
  const prophecies = await getAllProphecies();

  return <PropheciesClient prophecies={prophecies} prophecyCategories={prophecyCategories} />;
}
