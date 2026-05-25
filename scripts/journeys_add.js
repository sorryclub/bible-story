// 여정 보강: 구약 2 + 신약 1 추가 (기존 지역으로 구성, 1회성)
const db = require("./_db");

const NEW = [
  {
    id: "elijah_flight", name: "엘리야의 도피", color: "#C2410C", era: "구약",
    description: "갈멜산에서 바알 선지자들을 이긴 뒤 이세벨의 위협을 피해 브엘세바를 거쳐 호렙(시내)산으로 도망, 세미한 음성으로 하나님을 만났습니다.",
    path: ["mtCarmel", "beersheba", "sinai"],
  },
  {
    id: "exile_return", name: "바벨론 포로와 귀환", color: "#57534E", era: "구약",
    description: "유다가 멸망하며 백성이 바벨론으로 끌려갔고(BC 586), 약 70년 뒤 페르시아 치하에서 예루살렘으로 돌아와 성전과 성벽을 재건했습니다.",
    path: ["jerusalem", "babylon", "shushan", "jerusalem"],
  },
  {
    id: "philip_mission", name: "빌립의 전도 여정", color: "#BE185D", era: "신약",
    description: "사마리아에 복음을 전하고, 가사로 가는 길에서 에디오피아 내시에게 세례를 준 뒤 가이사랴까지 전도하며 올라갔습니다.",
    path: ["samaria", "gaza", "caesarea"],
  },
];

async function main() {
  let n = 0;
  for (const j of NEW) {
    await db.execute(
      `INSERT INTO journeys (id, name, color, era, description, path)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color), era=VALUES(era),
         description=VALUES(description), path=VALUES(path)`,
      [j.id, j.name, j.color, j.era, j.description, JSON.stringify(j.path)]
    );
    n++;
  }
  console.log(`여정 추가: ${n}개`);
  const tot = await db.execute("SELECT COUNT(*) AS n FROM journeys");
  console.log(`전체 여정: ${tot[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
