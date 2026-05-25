import { getAllLocations, getAllJourneys, getAllCharacters } from "@/lib/db";
import MapClient from "./MapClient";

export default async function MapPage() {
  const [locations, journeys, characters] = await Promise.all([
    getAllLocations(),
    getAllJourneys(),
    getAllCharacters(),
  ]);

  return <MapClient locations={locations} journeys={journeys} characters={characters} />;
}
