import { getBooksByTestament } from "@/lib/db";
import BooksClient from "./BooksClient";

// 빌드 때 미리 만든다(app/page.js 참고). DB 콘텐츠를 고치면 재배포.
export const dynamic = "force-static";

export default async function BooksPage() {
  const [oldTestament, newTestament] = await Promise.all([
    getBooksByTestament("old"),
    getBooksByTestament("new"),
  ]);
  return <BooksClient oldTestament={oldTestament} newTestament={newTestament} />;
}
