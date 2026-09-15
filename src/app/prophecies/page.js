import { getAllProphecies, prophecyCategories } from "@/lib/db";
import PropheciesClient from "./PropheciesClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function PropheciesPage() {
  const prophecies = await getAllProphecies();

  return <PropheciesClient prophecies={prophecies} prophecyCategories={prophecyCategories} />;
}
