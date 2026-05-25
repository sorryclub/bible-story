// 타임라인 2차 정리: 중복 분화 + 보강 이벤트 추가 (1회성)
const db = require("./_db");

// ── 중복 분화: 기존 항목 의미 차별화 ──
const UPDATES = [
  {
    id: 9, // 모세와 출애굽 → '이집트 탈출(출발)' 관점 (홍해는 id 58 이 담당)
    year: "약 BC 1446",
    verse: "출애굽기 12:31-42",
    desc: "열 번째 재앙 후 바로가 마침내 항복하자, 430년간 애굽에서 종살이하던 이스라엘이 한밤중에 길을 떠났다. 장정만 약 60만 명에 이르는 큰 무리가 모세를 따라 애굽을 빠져나왔고, 여호와께서 낮에는 구름 기둥, 밤에는 불 기둥으로 그들을 인도하셨다.",
  },
  {
    id: 17, // 바벨론 포로 → '70년 유배 기간' 관점 (성전 함락은 id 63 이 담당)
    year: "약 BC 586-538",
    verse: "예레미야 25:8-11",
    desc: "예루살렘이 무너진 뒤 대부분의 백성이 바벨론으로 끌려가 약 70년간 포로 생활을 했다. 예레미야가 예언한 그대로였으며, 백성은 바벨론 강가에서 시온을 그리며 울었다(시편 137편). 그러나 선지자들은 정한 때가 차면 다시 고향으로 돌아오리라는 회복의 소망을 전했다.",
  },
];

// ── 보강 이벤트 추가 (id 84~87) ──
const NEW_EVENTS = [
  { id: 84, sort: 145, era: "출애굽 시대", year: "약 BC 1446", color: "#C62828",
    title: "열 가지 재앙",
    desc: "바로가 이스라엘을 보내지 않자 하나님은 애굽에 열 가지 재앙을 내리셨다. 피·개구리·이·파리·가축 전염병·악성 종기·우박·메뚜기·흑암에 이어, 마지막으로 모든 처음 난 것의 죽음이 임하자 바로가 비로소 백성을 놓아주었다.",
    verse: "출애굽기 7:14-12:30", chars: ["moses", "aaron", "pharaoh_exodus"] },
  { id: 85, sort: 405, era: "분열 왕국 시대", year: "약 BC 701", color: "#1565C0",
    title: "히스기야의 개혁과 앗수르 격퇴",
    desc: "유다 왕 히스기야가 우상을 제거하고 성전 예배를 회복했다. 앗수르 산헤립이 예루살렘을 포위하며 위협하자 히스기야가 기도했고, 이사야의 예언대로 여호와의 사자가 앗수르 군대를 치니 성이 구원받았다.",
    verse: "열왕기하 18:1-19:37", chars: ["hezekiah", "isaiah"] },
  { id: 86, sort: 413, era: "분열 왕국 시대", year: "약 BC 622", color: "#2E7D32",
    title: "요시야의 개혁과 율법책 발견",
    desc: "여덟 살에 왕이 된 요시야가 성전을 수리하던 중 잃어버렸던 율법책을 발견했다. 그는 말씀 앞에서 옷을 찢고 회개하며, 온 나라의 우상을 헐고 유월절을 다시 지키는 대대적인 신앙 개혁을 단행했다.",
    verse: "열왕기하 22:1-23:25", chars: ["josiah"] },
  { id: 87, sort: 416, era: "분열 왕국 시대", year: "약 BC 600", color: "#6D4C41",
    title: "예레미야와 새 언약 예언",
    desc: "멸망을 앞둔 유다에서 예레미야가 눈물로 회개를 외쳤으나 외면당했다. 그는 70년 포로와 귀환을 예언하는 한편, 하나님이 사람의 마음 판에 율법을 새기시는 '새 언약'을 약속하셨다고 전했다 — 훗날 예수 그리스도로 성취될 약속이었다.",
    verse: "예레미야 31:31-34", chars: ["jeremiah"] },
];

async function main() {
  for (const u of UPDATES) {
    await db.execute(
      "UPDATE timeline_events SET year=?, verse=?, description=? WHERE id=?",
      [u.year, u.verse, u.desc, u.id]
    );
  }
  console.log(`중복 분화 업데이트: ${UPDATES.length}건`);

  let n = 0;
  for (const e of NEW_EVENTS) {
    await db.execute(
      `INSERT INTO timeline_events (id, era, title, year, description, verse, characters, color, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE era=VALUES(era), title=VALUES(title), year=VALUES(year),
         description=VALUES(description), verse=VALUES(verse), characters=VALUES(characters),
         color=VALUES(color), sort_order=VALUES(sort_order)`,
      [e.id, e.era, e.title, e.year, e.desc, e.verse, JSON.stringify(e.chars), e.color, e.sort]
    );
    n++;
  }
  console.log(`보강 이벤트 추가: ${n}건`);

  const total = await db.execute("SELECT COUNT(*) AS n FROM timeline_events");
  const nullsort = await db.execute("SELECT COUNT(*) AS n FROM timeline_events WHERE sort_order IS NULL");
  console.log(`전체 이벤트: ${total[0].n}개 / sort_order 미할당: ${nullsort[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
