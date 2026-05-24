import { getBooksByTestament, getAllParables, getAllMiracles } from "@/lib/db";
import GospelsClient from "./GospelsClient";

const gospelIds = ["matthew", "mark", "luke", "john"];

export default async function GospelsPage() {
  const [ntBooks, parables, miracles] = await Promise.all([
    getBooksByTestament("new"),
    getAllParables(),
    getAllMiracles(),
  ]);

  const gospelBooks = gospelIds.map((id) => ntBooks.find((b) => b.id === id));

  return (
    <GospelsClient
      gospelBooks={gospelBooks}
      parables={parables}
      miracles={miracles}
    />
  );
}
