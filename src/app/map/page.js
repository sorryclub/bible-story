import { getAllLocations, getAllJourneys, getAllCharacters } from "@/lib/db";
import MapClient from "./MapClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function MapPage() {
  const [locations, journeys, characters] = await Promise.all([
    getAllLocations(),
    getAllJourneys(),
    getAllCharacters(),
  ]);

  return <MapClient locations={locations} journeys={journeys} characters={characters} />;
}
