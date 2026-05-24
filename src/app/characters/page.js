import { getAllCharacters, periods } from "@/lib/db";
import CharactersClient from "./CharactersClient";

export default async function CharactersPage() {
  const characters = await getAllCharacters();
  return <CharactersClient characters={characters} periods={periods} />;
}
