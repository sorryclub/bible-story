import { getAllParables, parableThemes } from "@/lib/db";
import ParablesClient from "./ParablesClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function ParablesPage() {
  const parables = await getAllParables();

  return <ParablesClient parables={parables} parableThemes={parableThemes} />;
}
