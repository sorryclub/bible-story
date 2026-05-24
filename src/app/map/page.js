import { getAllLocations, getAllJourneys } from "@/lib/db";
import MapClient from "./MapClient";

export default async function MapPage() {
  const [locations, journeys] = await Promise.all([
    getAllLocations(),
    getAllJourneys(),
  ]);

  return <MapClient locations={locations} journeys={journeys} />;
}
