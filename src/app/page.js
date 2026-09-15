import { getAllCharacters, getAllTimelineEvents } from "@/lib/db";
import HomeClient from "./HomeClient";

// TiDB 드라이버가 fetch 를 no-store 로 보내 페이지가 요청마다 렌더됐다.
// 콘텐츠는 배포 사이에 바뀌지 않으므로 조회까지 캐시해 빌드 때 미리 만든다.
// (fetchCache = "force-cache" 로는 드라이버가 명시한 no-store 를 못 이긴다.)
// DB 콘텐츠를 고친 뒤에는 (빈 커밋으로라도) 재배포해야 반영된다.
// 오늘의 인물 순환은 브라우저에서 날짜로 고르므로 영향이 없다.
export const dynamic = "force-static";

export default async function HomePage() {
  const [characters, timelineEvents] = await Promise.all([
    getAllCharacters(),
    getAllTimelineEvents(),
  ]);

  return <HomeClient characters={characters} timelineEvents={timelineEvents} />;
}
