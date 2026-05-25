// 예수님의 비유 6개 추가 (1회성)
const db = require("./_db");

const NEW = [
  { id: "rich-fool", title: "어리석은 부자", verse: "누가복음 12:16-21", theme: "재물", gospels: ["luke"],
    summary: "풍년이 든 부자가 곳간을 헐고 더 크게 지어 재물을 쌓아 두고 평안히 즐기려 했으나, 하나님이 '오늘 밤 네 영혼을 도로 찾으리니'라 하셨습니다. 하나님께 대하여 부요하지 못한 채 재물만 쌓는 어리석음을 경고합니다." },
  { id: "unforgiving-servant", title: "무자비한 종", verse: "마태복음 18:21-35", theme: "용서", gospels: ["matthew"],
    summary: "임금에게 일만 달란트의 큰 빚을 탕감받은 종이, 자기에게 백 데나리온 빚진 동료는 옥에 가두었습니다. 받은 용서만큼 형제를 진심으로 용서해야 함을 가르칩니다." },
  { id: "lost-coin", title: "잃은 동전", verse: "누가복음 15:8-10", theme: "구원", gospels: ["luke"],
    summary: "열 드라크마 중 하나를 잃은 여인이 등불을 켜고 집을 쓸며 찾다가, 찾고는 이웃을 불러 함께 기뻐했습니다. 죄인 하나가 회개할 때 하늘에서 기뻐함을 보여줍니다." },
  { id: "leaven", title: "누룩", verse: "마태복음 13:33", theme: "하나님 나라", gospels: ["matthew", "luke"],
    summary: "여인이 가루 서 말 속에 누룩을 넣어 전체를 부풀게 했습니다. 작고 보이지 않게 시작한 하나님 나라가 온 세상으로 퍼져 나감을 비유합니다." },
  { id: "wise-builder", title: "반석 위에 지은 집", verse: "마태복음 7:24-27", theme: "믿음", gospels: ["matthew", "luke"],
    summary: "말씀을 듣고 행하는 자는 반석 위에 집을 지은 지혜로운 사람 같아 비바람에도 무너지지 않으나, 듣고 행하지 않는 자는 모래 위에 지은 집처럼 무너집니다." },
  { id: "dragnet", title: "그물", verse: "마태복음 13:47-50", theme: "심판", gospels: ["matthew"],
    summary: "바다에 친 그물이 온갖 물고기를 모으면 좋은 것은 그릇에 담고 못된 것은 버립니다. 세상 끝에 천사들이 의인과 악인을 갈라낼 것을 비유합니다." },
];

async function main() {
  let n = 0;
  for (const p of NEW) {
    await db.execute(
      `INSERT INTO parables (id, title, verse, gospels, theme, summary)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), verse=VALUES(verse), gospels=VALUES(gospels),
         theme=VALUES(theme), summary=VALUES(summary)`,
      [p.id, p.title, p.verse, JSON.stringify(p.gospels), p.theme, p.summary]
    );
    n++;
  }
  console.log(`비유 추가: ${n}개`);
  const tot = await db.execute("SELECT COUNT(*) AS n FROM parables");
  console.log(`전체 비유: ${tot[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
