import { getBooksByTestament } from "@/lib/db";
import GospelsClient from "./GospelsClient";

const gospelIds = ["matthew", "mark", "luke", "john"];

export default async function GospelsPage() {
  const ntBooks = await getBooksByTestament("new");
  const gospelBooks = gospelIds.map((id) => ntBooks.find((b) => b.id === id));

  return <GospelsClient gospelBooks={gospelBooks} />;
}
