import { getAllCharacters } from "@/lib/db";
import { topics } from "@/data/topics";
import { parseVerseRef } from "@/lib/verseLink";
import CharacterAvatar from "@/components/CharacterAvatar";
import Link from "next/link";
import { Tags, BookOpen, Users } from "lucide-react";

export const metadata = {
  title: "주제별 성경",
  description:
    "사랑·믿음·소망·용서·기도·고난·회개 등 주제로 모아 보는 성경. 주제마다 핵심 구절과 관련 인물을 한눈에.",
};

export default async function TopicsPage() {
  const characters = await getAllCharacters();
  const charMap = {};
  characters.forEach((c) => {
    charMap[c.id] = c;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Tags size={22} className="text-stone-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">주제별 성경</h1>
        </div>
        <p className="text-lg text-stone-500">
          한 가지 주제에 대해 성경이 무엇이라 말하는지, 핵심 구절과 관련 인물을 모아 보세요.
        </p>
      </section>

      {/* Topics */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-6">
        {topics.map((tp) => {
          const chars = tp.characters.map((id) => charMap[id]).filter(Boolean);
          return (
            <div key={tp.id} className="rounded-2xl border border-stone-200 overflow-hidden">
              {/* 주제 헤더 */}
              <div
                className="px-5 py-4"
                style={{
                  backgroundColor: `${tp.color}0F`,
                  borderBottom: `1px solid ${tp.color}22`,
                }}
              >
                <h2 className="text-xl font-bold" style={{ color: tp.color }}>
                  {tp.title}
                </h2>
                <p className="text-base text-stone-600 mt-1">{tp.desc}</p>
              </div>

              <div className="p-5">
                {/* 핵심 구절 */}
                <p className="text-sm font-medium text-stone-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen size={13} />
                  핵심 구절
                </p>
                <ul className="space-y-1.5 mb-5">
                  {tp.verses.map((v, i) => {
                    const link = parseVerseRef(v.ref);
                    return (
                      <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                        {link ? (
                          <Link
                            href={link.href}
                            className="text-base font-medium text-stone-700 hover:text-stone-950 hover:underline decoration-stone-300 underline-offset-2"
                          >
                            {v.ref}
                          </Link>
                        ) : (
                          <span className="text-base font-medium text-stone-700">{v.ref}</span>
                        )}
                        {v.note && <span className="text-sm text-stone-500">— {v.note}</span>}
                      </li>
                    );
                  })}
                </ul>

                {/* 관련 인물 */}
                {chars.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-stone-400 mb-3 flex items-center gap-1.5">
                      <Users size={13} />
                      관련 인물
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                      {chars.map((c) => (
                        <Link
                          key={c.id}
                          href={`/characters/${c.id}`}
                          className="flex items-center gap-2 group"
                        >
                          <CharacterAvatar character={c} size={36} />
                          <span className="text-base text-stone-600 group-hover:text-stone-900 transition-colors">
                            {c.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
