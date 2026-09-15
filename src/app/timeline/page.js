import { getAllTimelineEvents, getAllCharacters } from "@/lib/db";
import TimelineClient from "./TimelineClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function TimelinePage() {
  const [events, characters] = await Promise.all([
    getAllTimelineEvents(),
    getAllCharacters(),
  ]);
  return <TimelineClient events={events} characters={characters} />;
}
