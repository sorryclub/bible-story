// 예수님의 기적: 6개 추가 + 복음서 출처 3건 보완 (1회성)
const db = require("./_db");

const NEW = [
  { id: "centurion-servant", title: "백부장의 종", verse: "마태복음 8:5-13", category: "치유", gospels: ["matthew", "luke"],
    summary: "로마 백부장이 중풍으로 누운 종을 위해 간구하며 '말씀만 하옵소서' 하였습니다. 예수께서 '이스라엘 중 아무에게서도 이만한 믿음을 보지 못하였노라' 하시고 그 종을 고치셨습니다." },
  { id: "syrophoenician-daughter", title: "수로보니게 여인의 딸", verse: "마가복음 7:24-30", category: "귀신", gospels: ["matthew", "mark"],
    summary: "이방인 수로보니게 여인이 귀신 들린 딸을 위해 끈질기게 간구하자, 예수께서 그 큰 믿음을 보시고 딸에게서 귀신을 쫓아내셨습니다." },
  { id: "feeding-4000", title: "사천 명을 먹이심", verse: "마가복음 8:1-10", category: "자연", gospels: ["matthew", "mark"],
    summary: "사흘을 함께한 무리가 굶주리자, 예수께서 떡 일곱 개와 작은 생선 몇 마리로 사천 명을 먹이시고 일곱 광주리를 거두셨습니다. 오병이어와는 별개의 급식 기적입니다." },
  { id: "capernaum-demoniac", title: "회당의 귀신 들린 자", verse: "마가복음 1:21-28", category: "귀신", gospels: ["mark", "luke"],
    summary: "가버나움 회당에서 더러운 귀신 들린 사람이 소리치자, 예수께서 꾸짖어 귀신을 내쫓으셨습니다. 권위 있는 가르침과 축귀에 사람들이 크게 놀랐습니다." },
  { id: "officials-son", title: "왕의 신하의 아들", verse: "요한복음 4:46-54", category: "치유", gospels: ["john"],
    summary: "가버나움 왕의 신하가 죽어가는 아들을 위해 간구하자, 예수께서 '네 아들이 살아 있다' 하셨고 바로 그 시각에 아들의 열이 떨어졌습니다. 요한복음의 두 번째 표적입니다." },
  { id: "blind-bethsaida", title: "벳새다 소경", verse: "마가복음 8:22-26", category: "치유", gospels: ["mark"],
    summary: "벳새다에서 소경의 눈에 안수하시자 사람이 나무처럼 보였고, 다시 안수하시니 모든 것을 밝히 보게 되었습니다. 두 단계로 고치신 독특한 치유입니다." },
];

// 복음서 출처 보완
const FIX = {
  "gerasene-demoniac": ["matthew", "mark", "luke"], // 마 8:28-34 추가
  "blind-bartimaeus": ["matthew", "mark", "luke"],  // 마 20:29-34 추가
  "great-catch-of-fish": ["luke"],                  // 요 21(부활 후)과 분리 → 눅 5만
};

async function main() {
  let n = 0;
  for (const m of NEW) {
    await db.execute(
      `INSERT INTO miracles (id, title, verse, gospels, category, summary)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), verse=VALUES(verse), gospels=VALUES(gospels),
         category=VALUES(category), summary=VALUES(summary)`,
      [m.id, m.title, m.verse, JSON.stringify(m.gospels), m.category, m.summary]
    );
    n++;
  }
  console.log(`기적 추가: ${n}개`);

  let f = 0;
  for (const [id, gospels] of Object.entries(FIX)) {
    await db.execute("UPDATE miracles SET gospels=? WHERE id=?", [JSON.stringify(gospels), id]);
    f++;
  }
  console.log(`출처 보완: ${f}건`);

  const tot = await db.execute("SELECT COUNT(*) AS n FROM miracles");
  console.log(`전체 기적: ${tot[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
