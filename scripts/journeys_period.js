// 여정에 시대(period)·연대순(sort_order) 부여 — 타임라인식 구조화 (1회성)
const db = require("./_db");

// id: [period(타임라인 시대명), sort_order(연대순)]
const META = {
  abraham:        ["족장 시대", 10],
  jacob:          ["족장 시대", 20],
  exodus:         ["출애굽 시대", 30],
  ruth_naomi:     ["사사 시대", 40],
  david_flight:   ["왕국 시대", 50],
  elijah_flight:  ["분열 왕국 시대", 60],
  jonah:          ["분열 왕국 시대", 70],
  exile_return:   ["포로 시대", 80],
  jesus:          ["신약 시대", 90],
  philip_mission: ["신약 시대", 100],
  paul1:          ["신약 시대", 110],
  paul2:          ["신약 시대", 120],
  paul3:          ["신약 시대", 130],
  paul_rome:      ["신약 시대", 140],
  revelation:     ["신약 시대", 150],
};

async function ensureCol(name, ddl) {
  const r = await db.execute(
    "SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='journeys' AND column_name=?",
    [name]
  );
  if (r[0].n == 0) { await db.execute(ddl); console.log(name + " 컬럼 추가됨"); }
  else console.log(name + " 컬럼 이미 존재");
}

async function main() {
  await ensureCol("period", "ALTER TABLE journeys ADD COLUMN period VARCHAR(20) NULL");
  await ensureCol("sort_order", "ALTER TABLE journeys ADD COLUMN sort_order INT NULL");

  let n = 0;
  for (const [id, [period, sort]] of Object.entries(META)) {
    await db.execute("UPDATE journeys SET period=?, sort_order=? WHERE id=?", [period, sort, id]);
    n++;
  }
  console.log(`여정 시대/순서 업데이트: ${n}개`);

  const miss = await db.execute("SELECT COUNT(*) AS n FROM journeys WHERE period IS NULL OR sort_order IS NULL");
  console.log(`미할당: ${miss[0].n}개 (0이어야 정상)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
