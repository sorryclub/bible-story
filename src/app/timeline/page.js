import { getAllTimelineEvents, getAllCharacters } from "@/lib/db";
import TimelineClient from "./TimelineClient";

export default async function TimelinePage() {
  const [events, characters] = await Promise.all([
    getAllTimelineEvents(),
    getAllCharacters(),
  ]);
  return <TimelineClient events={events} characters={characters} />;
}
