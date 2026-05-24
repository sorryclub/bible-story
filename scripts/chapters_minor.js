const db = require("./_db");


const chapters = [
  // ── 호세아 (Hosea) 14장 ──
  { book_id: "hosea", chapter: 1, summary: "고멜과의 결혼 — 음란한 여인을 아내로 취함" },
  { book_id: "hosea", chapter: 2, summary: "이스라엘의 음행 심판과 회복의 약속" },
  { book_id: "hosea", chapter: 3, summary: "고멜을 다시 사옴 — 하나님의 변함없는 사랑" },
  { book_id: "hosea", chapter: 4, summary: "이스라엘의 불신앙 고발 — 지식이 없어 망함" },
  { book_id: "hosea", chapter: 5, summary: "에브라임과 유다의 심판 선언" },
  { book_id: "hosea", chapter: 6, summary: "회개 촉구 — 인애를 원하고 제사를 원치 않음" },
  { book_id: "hosea", chapter: 7, summary: "에브라임의 교만과 뒤집지 않은 전병 비유" },
  { book_id: "hosea", chapter: 8, summary: "바람을 심고 폭풍을 거둠 — 우상 심판" },
  { book_id: "hosea", chapter: 9, summary: "이스라엘의 추방 예고 — 열매 없는 포도나무" },
  { book_id: "hosea", chapter: 10, summary: "무성한 포도나무 비유 — 공의를 심으라" },
  { book_id: "hosea", chapter: 11, summary: "어린 이스라엘을 부른 하나님의 부성애" },
  { book_id: "hosea", chapter: 12, summary: "야곱의 역사 회고 — 하나님께 돌아오라" },
  { book_id: "hosea", chapter: 13, summary: "에브라임의 죄와 사망의 권세 심판" },
  { book_id: "hosea", chapter: 14, summary: "회개의 호소 — 이슬 같은 회복의 축복" },

  // ── 요엘 (Joel) 3장 ──
  { book_id: "joel", chapter: 1, summary: "메뚜기 재앙 — 전례 없는 황폐와 금식 촉구" },
  { book_id: "joel", chapter: 2, summary: "여호와의 날 경고와 성령 부어주심의 약속" },
  { book_id: "joel", chapter: 3, summary: "열국 심판 — 여호사밧 골짜기의 최후 심판" },

  // ── 아모스 (Amos) 9장 ──
  { book_id: "amos", chapter: 1, summary: "열국 심판 — 다메섹, 가사, 두로, 에돔 등" },
  { book_id: "amos", chapter: 2, summary: "모압, 유다, 이스라엘에 대한 심판 선언" },
  { book_id: "amos", chapter: 3, summary: "택한 백성의 책임 — 사자가 울면 두렵지 않겠느냐" },
  { book_id: "amos", chapter: 4, summary: "바산 암소 비유 — 다섯 재앙에도 돌아오지 않음" },
  { book_id: "amos", chapter: 5, summary: "이스라엘 애가 — 선을 구하라 악을 구하지 말라" },
  { book_id: "amos", chapter: 6, summary: "안일한 시온 경고 — 교만한 자의 멸망" },
  { book_id: "amos", chapter: 7, summary: "메뚜기·불·다림줄의 세 환상과 아마샤의 대적" },
  { book_id: "amos", chapter: 8, summary: "여름 과일 환상 — 말씀의 기근 예언" },
  { book_id: "amos", chapter: 9, summary: "제단 심판과 다윗의 장막 회복 약속" },

  // ── 오바댜 (Obadiah) 1장 ──
  { book_id: "obadiah", chapter: 1, summary: "에돔의 교만과 멸망 — 형제를 대적한 죄" },

  // ── 요나 (Jonah) 4장 ──
  { book_id: "jonah", chapter: 1, summary: "요나의 도망 — 다시스로 가려다 풍랑을 만남" },
  { book_id: "jonah", chapter: 2, summary: "물고기 뱃속 기도 — 3일 후 토해짐" },
  { book_id: "jonah", chapter: 3, summary: "니느웨 회개 — 왕부터 백성까지 금식함" },
  { book_id: "jonah", chapter: 4, summary: "요나의 분노와 박넝쿨 비유 — 하나님의 긍휼" },

  // ── 미가 (Micah) 7장 ──
  { book_id: "micah", chapter: 1, summary: "사마리아와 예루살렘 심판 — 우상 파괴 선언" },
  { book_id: "micah", chapter: 2, summary: "탐욕한 자의 심판 — 밭을 빼앗는 악인 경고" },
  { book_id: "micah", chapter: 3, summary: "지도자와 거짓 선지자 책망 — 시온이 밭같이 갈림" },
  { book_id: "micah", chapter: 4, summary: "말일의 성전 산 높임과 만국의 평화 예언" },
  { book_id: "micah", chapter: 5, summary: "메시아 탄생 예언 — 베들레헴에서 나리라" },
  { book_id: "micah", chapter: 6, summary: "하나님의 송사 — 공의와 인자와 겸손히 행하라" },
  { book_id: "micah", chapter: 7, summary: "신실한 자의 탄식과 하나님의 용서 찬양" },

  // ── 나훔 (Nahum) 3장 ──
  { book_id: "nahum", chapter: 1, summary: "질투하시는 하나님 — 니느웨 멸망 선언" },
  { book_id: "nahum", chapter: 2, summary: "니느웨 성 함락 장면 — 사자굴의 파멸" },
  { book_id: "nahum", chapter: 3, summary: "피흘린 성 니느웨의 최종 멸망 확정" },

  // ── 하박국 (Habakkuk) 3장 ──
  { book_id: "habakkuk", chapter: 1, summary: "하박국의 질문 — 왜 악을 방관하시는가" },
  { book_id: "habakkuk", chapter: 2, summary: "의인은 믿음으로 살리라 — 다섯 화의 선언" },
  { book_id: "habakkuk", chapter: 3, summary: "하박국의 기도 — 무화과나무에 열매가 없어도" },

  // ── 스바냐 (Zephaniah) 3장 ──
  { book_id: "zephaniah", chapter: 1, summary: "여호와의 큰 날 — 유다의 우상숭배 심판" },
  { book_id: "zephaniah", chapter: 2, summary: "열국 심판 — 블레셋, 모압, 앗수르 멸망" },
  { book_id: "zephaniah", chapter: 3, summary: "예루살렘 책망과 남은 자의 회복 기쁨" },

  // ── 학개 (Haggai) 2장 ──
  { book_id: "haggai", chapter: 1, summary: "성전 재건 촉구 — 너희 집은 짓고 내 집은 황무하냐" },
  { book_id: "haggai", chapter: 2, summary: "후일 성전의 영광과 스룹바벨에게 인장 약속" },

  // ── 스가랴 (Zechariah) 14장 ──
  { book_id: "zechariah", chapter: 1, summary: "홍마 탄 자의 환상 — 예루살렘 회복 약속" },
  { book_id: "zechariah", chapter: 2, summary: "측량줄의 환상 — 성벽 없는 예루살렘 확장" },
  { book_id: "zechariah", chapter: 3, summary: "대제사장 여호수아의 더러운 옷을 벗김" },
  { book_id: "zechariah", chapter: 4, summary: "금 등대와 두 감람나무 환상 — 스룹바벨 격려" },
  { book_id: "zechariah", chapter: 5, summary: "날아가는 두루마리와 에바 속 여인의 환상" },
  { book_id: "zechariah", chapter: 6, summary: "네 병거 환상과 여호수아에게 면류관 씌움" },
  { book_id: "zechariah", chapter: 7, summary: "금식의 참 의미 — 공의와 긍휼을 행하라" },
  { book_id: "zechariah", chapter: 8, summary: "예루살렘 회복과 열국이 하나님을 찾을 약속" },
  { book_id: "zechariah", chapter: 9, summary: "나귀 타고 오실 왕 — 겸손한 메시아 예언" },
  { book_id: "zechariah", chapter: 10, summary: "유다와 에브라임의 회복 — 흩어진 자를 모음" },
  { book_id: "zechariah", chapter: 11, summary: "두 목자 비유 — 은 삼십에 버림받을 목자" },
  { book_id: "zechariah", chapter: 12, summary: "예루살렘을 위한 전쟁 — 찔린 자를 바라봄" },
  { book_id: "zechariah", chapter: 13, summary: "우상과 거짓 선지자 제거 — 목자를 치리라" },
  { book_id: "zechariah", chapter: 14, summary: "여호와의 날 — 감람산이 갈라지고 만국이 경배" },

  // ── 말라기 (Malachi) 4장 ──
  { book_id: "malachi", chapter: 1, summary: "하나님의 사랑 선언과 흠 있는 제물 책망" },
  { book_id: "malachi", chapter: 2, summary: "제사장의 타락과 이혼에 대한 책망" },
  { book_id: "malachi", chapter: 3, summary: "십일조와 언약의 사자 예언" },
  { book_id: "malachi", chapter: 4, summary: "의의 태양과 엘리야 선지자 재림 예언" },
];

async function insertChapters() {
  console.log(`Inserting ${chapters.length} chapter summaries for 소선지서...\n`);

  let success = 0;
  let failed = 0;

  for (const ch of chapters) {
    try {
      await db.execute(
        `INSERT INTO book_chapters (book_id, chapter, summary) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE summary=VALUES(summary)`,
        [ch.book_id, ch.chapter, ch.summary]
      );
      console.log(`  ✓ ${ch.book_id} ${ch.chapter}장: ${ch.summary}`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${ch.book_id} ${ch.chapter}장: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
}

insertChapters().catch(console.error);
