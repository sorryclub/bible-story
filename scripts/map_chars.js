// 지도 지역별 관련 인물 매핑 (locations.characters 추가, 1회성)
const db = require("./_db");

const CHARS = {
  jerusalem: ["david", "solomon", "jesus", "peter", "nebuchadnezzar"],
  antioch: ["barnabas", "paul"],
  babylon: ["daniel", "shadrach_meshach_abednego", "nebuchadnezzar"],
  bethlehem: ["jesus", "mary", "david", "ruth", "boaz"],
  capernaum: ["jesus", "peter"],
  damascus: ["paul", "ananias_damascus", "abraham"],
  egypt: ["joseph", "moses", "aaron", "pharaoh_exodus", "jesus"],
  ephesus: ["paul", "priscilla_aquila", "apollos", "john_apostle"],
  nazareth: ["jesus", "mary", "joseph_carpenter"],
  rome: ["paul"],
  sinai: ["moses", "aaron", "elijah"],
  athens: ["paul"],
  bethany: ["jesus", "lazarus", "martha", "mary_bethany"],
  caesarea: ["peter", "cornelius", "paul"],
  cana: ["jesus", "mary"],
  corinth: ["paul", "priscilla_aquila"],
  cyprus: ["barnabas", "paul", "john_mark"],
  ethiopia: ["philip_deacon"],
  haran: ["abraham", "jacob", "laban"],
  hebron: ["abraham", "isaac", "jacob", "david"],
  jericho: ["joshua", "rahab", "jesus", "zacchaeus"],
  joppa: ["jonah", "peter"],
  malta: ["paul"],
  mtCarmel: ["elijah", "ahab"],
  nineveh: ["jonah"],
  patmos: ["john_apostle"],
  pergamum: ["john_apostle"],
  philippi: ["paul", "silas", "lydia", "philippian_jailer"],
  samaria: ["jesus"],
  shushan: ["esther", "mordecai", "nehemiah", "haman"],
  smyrna: ["john_apostle"],
  tarsus: ["paul"],
  thessalonica: ["paul", "silas"],
  thyatira: ["lydia", "john_apostle"],
  tyre_sidon: ["jesus", "solomon"],
  ur: ["abraham"],
  arabia: ["paul"],
  beersheba: ["abraham", "isaac"],
  crete: ["paul", "titus"],
  dan: ["jeroboam"],
  derbe_lystra: ["paul", "barnabas", "timothy"],
  gaza: ["samson", "philip_deacon"],
  laodicea: ["john_apostle"],
  persepolis: ["ezra_priest", "zerubbabel"],
  philadelphia: ["john_apostle"],
  puteoli: ["paul"],
  sardis: ["john_apostle"],
  shechem: ["abraham", "joshua"],
  // 신규 6곳
  jordan_river: ["joshua", "elisha", "naaman", "jesus", "john_baptist"],
  galilee_sea: ["jesus", "peter", "andrew"],
  mt_olives: ["jesus", "peter"],
  sodom: ["lot", "abraham"],
  bethel: ["jacob", "jeroboam"],
  shiloh: ["samuel", "hannah", "eli"],
  // 신규 5곳 (룻 / 다윗 도피)
  moab: ["ruth", "naomi", "moses"],
  nob: ["david"],
  gath: ["david", "goliath"],
  adullam: ["david"],
  engedi: ["david", "saul_king"],
};

async function main() {
  // 1) characters 컬럼 추가
  const col = await db.execute(
    "SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='locations' AND column_name='characters'"
  );
  if (col[0].n == 0) {
    await db.execute("ALTER TABLE locations ADD COLUMN characters JSON NULL");
    console.log("characters 컬럼 추가됨");
  } else console.log("characters 컬럼 이미 존재");

  // 2) 유효성: 존재하는 인물 id 인지 검증
  const all = await db.execute("SELECT id FROM characters");
  const valid = new Set(all.map((r) => r.id));
  const bad = [];
  for (const [loc, ids] of Object.entries(CHARS)) {
    for (const id of ids) if (!valid.has(id)) bad.push(loc + ":" + id);
  }
  if (bad.length) { console.error("⚠️ 없는 인물 id:", bad.join(", ")); process.exit(1); }
  console.log("인물 id 전부 유효");

  // 3) 백필
  let u = 0;
  for (const [loc, ids] of Object.entries(CHARS)) {
    const r = await db.execute("UPDATE locations SET characters=? WHERE id=?", [JSON.stringify(ids), loc]);
    u++;
  }
  console.log(`지역 인물 매핑 업데이트: ${u}곳`);

  const tot = await db.execute("SELECT COUNT(*) AS n FROM locations");
  const none = await db.execute("SELECT COUNT(*) AS n FROM locations WHERE characters IS NULL");
  console.log(`전체 지역: ${tot[0].n}곳 / 인물 미매핑: ${none[0].n}곳`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
