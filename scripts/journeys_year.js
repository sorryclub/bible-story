// 여정에 연대(year) 라벨 추가 — 타임라인 연도와 일치, 추정치는 '약' 표기 (1회성)
const db = require("./_db");

const YEAR = {
  abraham:        "약 BC 2091",
  jacob:          "약 BC 1900",
  exodus:         "약 BC 1446~1406",
  ruth_naomi:     "약 BC 1100",
  david_flight:   "약 BC 1015",
  elijah_flight:  "약 BC 860",
  jonah:          "약 BC 780",
  exile_return:   "BC 586~538",
  jesus:          "약 BC 4 ~ AD 30",
  philip_mission: "약 AD 35",
  paul1:          "약 AD 46~48",
  paul2:          "약 AD 49~52",
  paul3:          "약 AD 53~57",
  paul_rome:      "약 AD 59~62",
  revelation:     "약 AD 95",
};

async function main() {
  const col = await db.execute(
    "SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='journeys' AND column_name='year'"
  );
  if (col[0].n == 0) {
    await db.execute("ALTER TABLE journeys ADD COLUMN year VARCHAR(40) NULL");
    console.log("year 컬럼 추가됨");
  } else console.log("year 컬럼 이미 존재");

  let n = 0;
  for (const [id, y] of Object.entries(YEAR)) {
    await db.execute("UPDATE journeys SET year=? WHERE id=?", [y, id]);
    n++;
  }
  console.log(`여정 연대 업데이트: ${n}개`);

  const miss = await db.execute("SELECT COUNT(*) AS n FROM journeys WHERE year IS NULL");
  console.log(`미할당: ${miss[0].n}개 (0이어야 정상)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
