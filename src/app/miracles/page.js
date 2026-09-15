import { getAllMiracles, miracleCategories } from "@/lib/db";
import MiraclesClient from "./MiraclesClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function MiraclesPage() {
  const miracles = await getAllMiracles();

  return <MiraclesClient miracles={miracles} miracleCategories={miracleCategories} />;
}
