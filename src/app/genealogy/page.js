import { getAllCharacters } from "@/lib/db";
import { lineages } from "@/data/genealogy";
import GenealogyTree from "./GenealogyTree";
import { Network, BookOpen } from "lucide-react";

export const metadata = {
  title: "성경 인물 계보",
  description:
    "성경 본문에 근거한 인물 계보. 아담·아브라함·다윗에서 예수 그리스도까지 이어지는 계보를 한눈에.",
};

export default async function GenealogyPage() {
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
          <Network size={22} className="text-stone-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
            성경 인물 계보
          </h1>
        </div>
        <p className="text-lg text-stone-500">
          성경 본문에 근거한 주요 계보입니다. 이름을 누르면 인물 상세로 이동하며,
          <span className="text-stone-400"> 회색 이름</span>은 아직 개별 페이지가 없는 인물입니다.
        </p>
      </section>

      {/* Lineages */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
        {lineages.map((lin) => (
          <div
            key={lin.id}
            className="rounded-2xl border border-stone-200 overflow-hidden"
          >
            <div
              className="px-5 py-4"
              style={{
                backgroundColor: `${lin.accent}0F`,
                borderBottom: `1px solid ${lin.accent}22`,
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold" style={{ color: lin.accent }}>
                  {lin.title}
                </h2>
                <span className="text-sm text-stone-400">{lin.era}</span>
              </div>
              <p className="text-base text-stone-600 mt-1">{lin.desc}</p>
              <p className="text-sm text-stone-400 mt-1.5 flex items-center gap-1.5">
                <BookOpen size={13} />
                {lin.scripture}
              </p>
            </div>

            <div className="p-5 overflow-x-auto">
              <GenealogyTree lineage={lin} charMap={charMap} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
