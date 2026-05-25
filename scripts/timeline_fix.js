// 타임라인 정렬 수정 + 신약 시대 누락 이벤트 추가 (1회성 마이그레이션)
// - timeline_events 에 sort_order(연대순 정렬키) 컬럼 추가
// - 기존 69개 이벤트에 연대순 sort_order 부여
// - 누락된 신약 이벤트 14개 추가
const db = require("./_db");

// ── 기존 69개 이벤트의 연대순 정렬값 (id → sort_order) ──
const ORDER = {
  // 창조
  1: 10, 2: 20, 30: 30,
  // 홍수
  3: 40, 4: 50,
  // 족장
  5: 60, 31: 70, 6: 80, 32: 90, 7: 100, 33: 110, 8: 120, 57: 130,
  // 출애굽
  34: 140, 35: 150, 9: 160, 58: 170, 10: 180, 36: 190, 37: 200,
  // 정복
  38: 210, 59: 220, 11: 230,
  // 사사
  12: 240, 60: 250, 39: 260, 41: 270, 40: 280, 42: 290,
  // 왕국
  43: 300, 44: 310, 13: 320, 61: 330, 45: 340, 14: 350,
  // 분열 왕국
  15: 360, 16: 370, 62: 380, 64: 390, 46: 400, 47: 410, 63: 420,
  // 포로
  17: 430, 65: 440, 48: 450, 18: 460, 49: 470,
  // 신약 (기존)
  19: 480, 50: 510, 24: 520, 26: 530, 20: 540, 25: 560, 66: 590,
  67: 600, 53: 610, 27: 620, 51: 630, 52: 640, 28: 650, 21: 660,
  29: 690, 22: 700, 54: 710, 55: 720, 23: 770, 56: 780, 68: 790, 69: 810,
};

// ── 신약 시대 누락 이벤트 (id 70~83) ──
const NEW_EVENTS = [
  { id: 70, sort: 490, year: "약 BC 4", color: "#FFC107", title: "동방박사의 경배와 애굽 피신",
    desc: "동방에서 박사들이 별을 따라와 아기 예수께 경배하며 황금·유향·몰약을 드렸다. 헤롯 대왕이 베들레헴의 두 살 이하 사내아이를 죽이자, 요셉은 마리아와 아기를 데리고 애굽으로 피신했다.",
    verse: "마태복음 2:1-18", chars: ["jesus", "mary", "herod_great"] },
  { id: 71, sort: 500, year: "약 AD 8", color: "#FFD54F", title: "소년 예수, 성전에서",
    desc: "열두 살 된 예수께서 유월절에 예루살렘 성전에 머물며 선생들과 묻고 답하셨다. 부모가 찾자 '내가 내 아버지 집에 있어야 할 줄을 알지 못하셨나이까'라고 답하셨다.",
    verse: "누가복음 2:41-52", chars: ["jesus", "mary"] },
  { id: 72, sort: 550, year: "약 AD 28", color: "#1565C0", title: "열두 제자를 부르심",
    desc: "예수께서 산에서 밤새 기도하신 후 열두 제자를 세우시고 사도라 칭하셨다. 이들을 늘 함께 두시며 복음을 전파하고 귀신을 내쫓는 권능을 주셨다.",
    verse: "마가복음 3:13-19", chars: ["jesus", "peter", "andrew", "john_apostle", "james_apostle"] },
  { id: 73, sort: 570, year: "약 AD 28", color: "#00838F", title: "사마리아 여인과의 대화",
    desc: "예수께서 수가성 우물가에서 사마리아 여인에게 영원히 목마르지 않는 '생수'를 말씀하셨다. 여인은 그리스도를 만나 마을 사람들에게 그분을 증언하였다.",
    verse: "요한복음 4:1-26", chars: ["jesus"] },
  { id: 74, sort: 580, year: "약 AD 29", color: "#8D6E63", title: "세례 요한의 죽음",
    desc: "헤롯 안디바의 불의를 책망하다 옥에 갇힌 세례 요한이, 헤로디아의 딸의 춤에 대한 경솔한 약속으로 목 베임을 당했다.",
    verse: "마태복음 14:1-12", chars: ["john_baptist", "herod_antipas"] },
  { id: 75, sort: 670, year: "약 AD 30", color: "#5E35B1", title: "도마의 고백",
    desc: "부활하신 예수를 의심하던 도마가 그분의 못 자국과 옆구리를 직접 확인하고 '나의 주님이시요 나의 하나님이시니이다'라고 고백했다.",
    verse: "요한복음 20:24-29", chars: ["jesus", "thomas"] },
  { id: 76, sort: 680, year: "약 AD 30", color: "#B71C1C", title: "지상명령(대위임령)",
    desc: "부활하신 예수께서 제자들에게 '모든 민족을 제자로 삼아 세례를 베풀고 분부한 모든 것을 가르쳐 지키게 하라'고 명하시며 세상 끝날까지 함께하실 것을 약속하셨다.",
    verse: "마태복음 28:18-20", chars: ["jesus", "peter"] },
  { id: 77, sort: 730, year: "약 AD 35", color: "#00695C", title: "빌립과 에티오피아 내시",
    desc: "전도자 빌립이 광야 길에서 이사야서를 읽던 에티오피아 내시에게 예수를 전하고 세례를 주었다. 복음이 예루살렘을 넘어 이방 땅으로 퍼지기 시작했다.",
    verse: "사도행전 8:26-40", chars: ["philip_deacon"] },
  { id: 78, sort: 740, year: "약 AD 37", color: "#1565C0", title: "베드로와 고넬료",
    desc: "베드로가 환상을 통해 이방인도 받으심을 깨닫고, 로마 백부장 고넬료의 집에서 복음을 전했다. 이방인에게도 성령이 임하여 구원의 문이 모든 민족에게 열렸다.",
    verse: "사도행전 10:1-48", chars: ["peter", "cornelius"] },
  { id: 79, sort: 750, year: "약 AD 43", color: "#6A1B9A", title: "안디옥 교회와 '그리스도인'",
    desc: "안디옥에 세워진 교회에서 바나바와 바울이 함께 가르쳤고, 제자들이 비로소 '그리스도인'이라 불리기 시작했다. 안디옥은 이방 선교의 거점이 되었다.",
    verse: "사도행전 11:19-26", chars: ["barnabas", "paul"] },
  { id: 80, sort: 760, year: "약 AD 44", color: "#424242", title: "야고보의 순교와 베드로의 구출",
    desc: "헤롯 아그립바 1세가 사도 야고보를 칼로 죽이고 베드로를 옥에 가두었으나, 교회의 간절한 기도 중에 천사가 베드로를 기적적으로 옥에서 이끌어 냈다.",
    verse: "사도행전 12:1-19", chars: ["james_apostle", "peter", "herod_agrippa1"] },
  { id: 81, sort: 800, year: "약 AD 57", color: "#B22222", title: "바울의 예루살렘 체포와 가이사랴 구금",
    desc: "예루살렘 성전에서 붙잡힌 바울이 로마 시민권으로 보호받으며 총독 벨릭스·베스도와 아그립바 왕 앞에서 복음을 변증했고, 가이사에게 상소하여 로마로 호송되었다.",
    verse: "사도행전 21:27-26:32", chars: ["paul"] },
  { id: 82, sort: 820, year: "AD 70", color: "#6D4C41", title: "예루살렘 성전 파괴",
    desc: "예수께서 예언하신 대로 로마군에 의해 예루살렘과 성전이 무너졌다. 유대교 제사 제도가 끝나고 신앙의 중심이 성전에서 교회로 옮겨졌다.",
    verse: "누가복음 21:5-6", chars: ["jesus"] },
  { id: 83, sort: 830, year: "약 AD 95", color: "#283593", title: "밧모섬의 요한과 요한계시록",
    desc: "노년의 사도 요한이 밧모섬에 유배되어 예수 그리스도의 계시를 받아 요한계시록을 기록했다. 그리스도의 재림과 새 하늘 새 땅의 소망으로 신약 성경이 마무리된다.",
    verse: "요한계시록 1:9-11", chars: ["john_apostle"] },
];

async function main() {
  // 1) sort_order 컬럼 추가 (없으면)
  const colCheck = await db.execute(
    "SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'timeline_events' AND column_name = 'sort_order'"
  );
  if (colCheck[0].n == 0) {
    await db.execute("ALTER TABLE timeline_events ADD COLUMN sort_order INT NULL");
    console.log("sort_order 컬럼 추가됨");
  } else {
    console.log("sort_order 컬럼 이미 존재");
  }

  // 2) 기존 이벤트 sort_order 백필
  let updated = 0;
  for (const [id, sort] of Object.entries(ORDER)) {
    await db.execute("UPDATE timeline_events SET sort_order = ? WHERE id = ?", [sort, Number(id)]);
    updated++;
  }
  console.log(`기존 이벤트 정렬값 업데이트: ${updated}개`);

  // 3) 신약 누락 이벤트 추가
  let inserted = 0;
  for (const e of NEW_EVENTS) {
    await db.execute(
      `INSERT INTO timeline_events (id, era, title, year, description, verse, characters, color, sort_order)
       VALUES (?, '신약 시대', ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), year=VALUES(year), description=VALUES(description),
         verse=VALUES(verse), characters=VALUES(characters), color=VALUES(color), sort_order=VALUES(sort_order)`,
      [e.id, e.title, e.year, e.desc, e.verse, JSON.stringify(e.chars), e.color, e.sort]
    );
    inserted++;
  }
  console.log(`신약 누락 이벤트 추가: ${inserted}개`);

  // 4) 검증: sort_order 누락 행 확인
  const missing = await db.execute("SELECT COUNT(*) AS n FROM timeline_events WHERE sort_order IS NULL");
  console.log(`sort_order 미할당 행: ${missing[0].n}개 (0이어야 정상)`);
  const total = await db.execute("SELECT COUNT(*) AS n FROM timeline_events");
  console.log(`전체 이벤트: ${total[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
