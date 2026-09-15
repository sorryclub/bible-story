import { getAllCharacters, periods } from "@/lib/db";
import CharactersClient from "./CharactersClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function CharactersPage() {
  const characters = await getAllCharacters();
  return <CharactersClient characters={characters} periods={periods} />;
}
