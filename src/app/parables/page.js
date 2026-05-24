import { getAllParables, parableThemes } from "@/lib/db";
import ParablesClient from "./ParablesClient";

export default async function ParablesPage() {
  const parables = await getAllParables();

  return <ParablesClient parables={parables} parableThemes={parableThemes} />;
}
