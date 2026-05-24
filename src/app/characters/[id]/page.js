import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  Users,
  ChevronRight,
} from "lucide-react";
import { getCharacter, getAllCharacters, getBook, getAllTimelineEvents } from "@/lib/db";
import CharacterAvatar from "@/components/CharacterAvatar";
import { StyledDescription, CharacterHeroAvatar } from "./CharacterDetailClient";

// 주요 사건의 (창세기 2:7) 참조를 분리하여 표시
function StyledEvent({ text }) {
  const match = text.match(/^(.*?)\s*(\([^)]*\d+[:\d\-,\s장]*[^)]*\))$/);
  if (match) {
    return (
      <div>
        <p className="text-stone-700 text-base">{match[1]}</p>
        <p className="text-stone-500 text-[14px] mt-0.5">{match[2].slice(1, -1)}</p>
      </div>
    );
  }
  return <p className="text-stone-700 text-base">{text}</p>;
}

export default async function CharacterDetailPage({ params }) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-stone-300" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            인물을 찾을 수 없습니다
          </h1>
          <p className="text-stone-500 text-base mb-6">
            요청하신 인물 정보가 존재하지 않습니다
          </p>
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            인물 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // Fetch related data in parallel
  const [allCharacters, allTimelineEvents, ...relatedBookResults] = await Promise.all([
    getAllCharacters(),
    getAllTimelineEvents(),
    ...character.books.map((bookId) => getBook(bookId)),
  ]);

  // Build character lookup
  const characterMap = {};
  allCharacters.forEach((c) => { characterMap[c.id] = c; });

  const relatedCharacters = character.relatedCharacters
    .map((cid) => characterMap[cid])
    .filter(Boolean);

  const relatedBooks = relatedBookResults.filter(Boolean);

  const relatedEvents = allTimelineEvents.filter((e) =>
    e.characters.includes(character.id)
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-stone-100 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 text-base mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            인물 목록
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <CharacterHeroAvatar character={character} />

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">
                {character.name}
              </h1>
              <p className="text-stone-400 mb-2">{character.nameEn}</p>
              <p className="text-lg font-medium text-stone-600 mb-3">
                {character.role}
              </p>
              <div className="inline-block px-3 py-1 rounded-full text-base bg-stone-800 text-white mb-4">
                {character.period}
              </div>
              <p className="text-stone-500 leading-relaxed max-w-lg">
                {character.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content - 2/3 */}
          <div className="md:col-span-2 space-y-8">
            {/* Story */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-stone-500" />
                이야기
              </h2>
              <StyledDescription text={character.description} characterId={character.id} />
            </div>

            {/* Key Events */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-stone-500" />
                주요 사건
              </h2>
              <div className="space-y-4">
                {character.keyEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-stone-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-800 text-white text-base font-bold shrink-0">
                      {i + 1}
                    </div>
                    <StyledEvent text={event} />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-stone-200">
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-stone-600" />
                  타임라인 속 사건
                </h2>
                <div className="space-y-4">
                  {relatedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100"
                    >
                      <Clock className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-stone-900 text-base">
                          {event.title}
                        </h4>
                        <p className="text-base text-stone-400 mt-0.5">
                          {event.year}
                        </p>
                        <p className="text-base text-stone-500 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-6">
            {/* Key Verses */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-stone-600" />
                핵심 성경 구절
              </h3>
              <div className="space-y-2">
                {character.keyVerses.map((verse, i) => {
                  const ref = typeof verse === "object" ? verse.ref : verse;
                  const summary = typeof verse === "object" ? verse.summary : null;
                  return (
                    <div
                      key={i}
                      className="px-3 py-2 bg-white rounded-lg border border-stone-100"
                    >
                      <p className="font-medium text-stone-800">{ref}</p>
                      {summary && (
                        <p className="text-stone-500 mt-0.5">{summary}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-stone-200">
                <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stone-600" />
                  관련 성경
                </h3>
                <div className="space-y-1">
                  {relatedBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <span className="text-base text-stone-700">
                        {book.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Characters */}
            {relatedCharacters.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-stone-200">
                <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-600" />
                  관련 인물
                </h3>
                <div className="space-y-3">
                  {relatedCharacters.map((char) => (
                    <Link
                      key={char.id}
                      href={`/characters/${char.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <CharacterAvatar character={char} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-stone-900">
                          {char.name}
                        </p>
                        <p className="text-base text-stone-500">{char.role}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
