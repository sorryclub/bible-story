import { getBooksByTestament } from "@/lib/db";
import GospelsClient from "./GospelsClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

const gospelIds = ["matthew", "mark", "luke", "john"];

export default async function GospelsPage() {
  const ntBooks = await getBooksByTestament("new");
  const gospelBooks = gospelIds.map((id) => ntBooks.find((b) => b.id === id));

  return <GospelsClient gospelBooks={gospelBooks} />;
}
