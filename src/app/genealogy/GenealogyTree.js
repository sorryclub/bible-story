import Link from "next/link";
import { Heart } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";

function normalizeUnions(node) {
  if (node.unions) return node.unions;
  if (node.children) return [{ children: node.children }];
  return [];
}

/* ── 트리 모드 ─────────────────────────────────────────── */

function Avatar({ node, charMap, accent }) {
  const char = node.id ? charMap[node.id] : null;
  if (char) return <CharacterAvatar character={char} size={36} />;
  // 인물 DB에 없는 사람: 이름 첫 글자를 계보 시대 색으로 은은하게
  const tint = accent || "#78716C";
  return (
    <div
      className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-semibold shrink-0"
      style={{ backgroundColor: `${tint}14`, color: tint }}
    >
      {(node.name || "·")[0]}
    </div>
  );
}

function PersonChip({ node, charMap, accent }) {
  const char = node.id ? charMap[node.id] : null;
  const content = (
    <span className="inline-flex items-center gap-2">
      <Avatar node={node} charMap={charMap} accent={accent} />
      <span className="flex flex-col leading-tight">
        <span
          className={`text-base font-medium ${
            char ? "text-stone-800" : "text-stone-500"
          }`}
        >
          {node.name || char?.name}
        </span>
        {node.note && <span className="text-sm text-stone-400">{node.note}</span>}
      </span>
    </span>
  );
  if (char) {
    return (
      <Link
        href={`/characters/${char.id}`}
        className="inline-block hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }
  return content;
}

function PersonRow({ node, charMap, accent }) {
  return (
    <div className="py-1">
      <PersonChip node={node} charMap={charMap} accent={accent} />
    </div>
  );
}

function SpouseLink({ spouse, charMap }) {
  const char = spouse.id ? charMap[spouse.id] : null;
  return (
    <span>
      {char ? (
        <Link
          href={`/characters/${char.id}`}
          className="text-stone-500 hover:text-stone-800 hover:underline decoration-stone-300 underline-offset-2"
        >
          {spouse.name}
        </Link>
      ) : (
        <span className="text-stone-500">{spouse.name}</span>
      )}
      {spouse.note && <span className="text-stone-400"> ({spouse.note})</span>}
    </span>
  );
}

function TreeNode({ node, charMap, accent }) {
  if (node.ellipsis) {
    return (
      <div className="flex items-center gap-2 py-1 text-stone-400">
        <span className="w-9 h-9 flex items-center justify-center text-stone-300 text-lg">
          ⋯
        </span>
        <span className="text-sm">{node.note}</span>
      </div>
    );
  }

  const unions = normalizeUnions(node);
  // 배우자가 한 명뿐이면 부부를 한 줄에 나란히 배치 (아담 ❤ 하와)
  const inlineCouple = unions.length === 1 && unions[0].spouse;

  return (
    <div>
      {/* 본인 (+ 단일 배우자는 같은 줄에 나란히) */}
      {inlineCouple ? (
        <div className="flex items-center gap-2 flex-wrap py-1">
          <PersonChip node={node} charMap={charMap} accent={accent} />
          <Heart size={14} className="text-rose-300 shrink-0" />
          <PersonChip node={unions[0].spouse} charMap={charMap} accent={accent} />
        </div>
      ) : (
        <PersonRow node={node} charMap={charMap} accent={accent} />
      )}

      {/* 자녀 */}
      {unions.length > 0 && (
        <div className="ml-[18px] sm:ml-5 pl-4 border-l border-stone-200">
          {unions.map((u, i) => (
            <div key={i} className="mb-1 last:mb-0">
              {/* 배우자가 여럿일 때만 배우자/라벨을 소제목으로 표기 */}
              {!inlineCouple && (u.spouse || u.label) && (
                <div className="flex items-center gap-1.5 py-0.5 text-sm">
                  <Heart size={11} className="text-rose-300 shrink-0" />
                  {u.spouse && <SpouseLink spouse={u.spouse} charMap={charMap} />}
                  {u.label && <span className="text-stone-400">· {u.label}</span>}
                </div>
              )}
              {(u.children || []).map((child, j) => (
                <TreeNode
                  key={child.id || child.name || j}
                  node={child}
                  charMap={charMap}
                  accent={accent}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 체인 모드 (직선 계보) ─────────────────────────────── */

function ChainNode({ node, charMap, accent }) {
  const char = node.id ? charMap[node.id] : null;
  const color = node.ellipsis ? "#D6D3D1" : char?.color || accent || "#A8A29E";
  return (
    <li className="relative pl-7 pb-4 last:pb-0">
      <span
        className="absolute -left-[8px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white"
        style={{ backgroundColor: color }}
      />
      {node.ellipsis ? (
        <span className="text-sm text-stone-400">⋯ {node.note}</span>
      ) : (
        <div>
          <span>
            {char ? (
              <Link
                href={`/characters/${char.id}`}
                className="text-base font-semibold text-stone-800 hover:text-stone-950 hover:underline decoration-stone-300 underline-offset-2"
              >
                {node.name}
              </Link>
            ) : (
              <span className="text-base font-semibold text-stone-700">
                {node.name}
              </span>
            )}
            {node.spouse && (
              <span className="text-sm text-stone-400">
                {"  ×  "}
                <SpouseLink spouse={node.spouse} charMap={charMap} />
              </span>
            )}
          </span>
          {node.note && (
            <p className="text-sm text-stone-500 mt-0.5">{node.note}</p>
          )}
        </div>
      )}
    </li>
  );
}

/* ── 진입점 ────────────────────────────────────────────── */

export default function GenealogyTree({ lineage, charMap }) {
  if (lineage.mode === "chain") {
    return (
      <ol className="relative border-l-2 border-stone-200 ml-[8px]">
        {lineage.chain.map((n, i) => (
          <ChainNode
            key={n.id || n.name || i}
            node={n}
            charMap={charMap}
            accent={lineage.accent}
          />
        ))}
      </ol>
    );
  }

  const roots = lineage.roots || (lineage.root ? [lineage.root] : []);
  return (
    <div className="space-y-4">
      {roots.map((r, i) => (
        <TreeNode
          key={r.id || r.name || i}
          node={r}
          charMap={charMap}
          accent={lineage.accent}
        />
      ))}
    </div>
  );
}
