import { getAllCharacters, getAllTimelineEvents } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const [characters, timelineEvents] = await Promise.all([
    getAllCharacters(),
    getAllTimelineEvents(),
  ]);

  return <HomeClient characters={characters} timelineEvents={timelineEvents} />;
}
