import { getBooksByTestament } from "@/lib/db";
import BooksClient from "./BooksClient";

export default async function BooksPage() {
  const [oldTestament, newTestament] = await Promise.all([
    getBooksByTestament("old"),
    getBooksByTestament("new"),
  ]);
  return <BooksClient oldTestament={oldTestament} newTestament={newTestament} />;
}
