// 지도 보강 2차: 신규 지역 5곳 + 여정 2개 (룻과 나오미, 다윗의 도피)
const db = require("./_db");

function toEvents(arr) {
  return JSON.stringify(arr.map(([era, title, verse, summary]) => ({ era, title, verse, summary })));
}

const NEW_LOC = [
  { id: "moab", name: "모압", name_en: "Moab", lat: 31.50, lng: 35.75, region: "모압", importance: 1,
    d: "사해 동편의 고원 지대. 룻의 고향이자, 모세가 약속의 땅을 바라보고 생을 마친 곳.", e: [
    ["구약","룻이 나오미를 따른 곳","룻기 1:16-17","남편을 잃은 룻이 '어머니의 하나님이 나의 하나님'이라며 나오미를 따랐다."],
    ["구약","모세가 약속의 땅을 바라본 곳","신명기 34:1-5","모세가 느보산에서 가나안을 바라본 뒤 모압 땅에서 생을 마쳤다."],
  ]},
  { id: "nob", name: "놉", name_en: "Nob", lat: 31.79, lng: 35.24, region: "베냐민", importance: 0,
    d: "예루살렘 북쪽의 제사장 성읍. 다윗이 쫓기던 중 도움을 받은 곳.", e: [
    ["구약","다윗이 제사장에게 떡과 칼을 받음","사무엘상 21:1-9","쫓기던 다윗이 아히멜렉에게 진설병과 골리앗의 칼을 받았다."],
  ]},
  { id: "gath", name: "가드", name_en: "Gath", lat: 31.70, lng: 34.85, region: "블레셋", importance: 0,
    d: "블레셋 다섯 도시 중 하나. 골리앗의 고향이자 다윗이 피신한 곳.", e: [
    ["구약","골리앗의 고향 / 다윗이 미친 체함","사무엘상 21:10-15","다윗이 적국 가드로 피했다가 위기에서 미친 체하여 벗어났다."],
  ]},
  { id: "adullam", name: "아둘람", name_en: "Adullam", lat: 31.65, lng: 34.97, region: "유다", importance: 0,
    d: "유다 저지대의 굴이 있는 곳. 다윗의 추종자들이 모인 피난처.", e: [
    ["구약","아둘람 굴 — 다윗의 용사들이 모임","사무엘상 22:1-2","곤경에 처한 사백 명이 다윗에게 모여 그를 두목으로 삼았다."],
  ]},
  { id: "engedi", name: "엔게디", name_en: "En Gedi", lat: 31.46, lng: 35.39, region: "유다", importance: 1,
    d: "사해 서편의 오아시스. 다윗이 사울을 살려준 동굴이 있던 피난처.", e: [
    ["구약","다윗이 사울을 살려줌","사무엘상 24:1-7","동굴에 들어온 사울을 죽일 수 있었으나 다윗은 겉옷 자락만 베고 살려주었다."],
  ]},
];

const NEW_JOURNEY = [
  { id: "ruth_naomi", name: "룻과 나오미", color: "#CA8A04", era: "구약",
    description: "흉년에 모압으로 이주했다가 남편과 두 아들을 잃은 나오미가 며느리 룻과 함께 베들레헴으로 돌아왔습니다. 룻은 보아스를 만나 다윗과 예수님의 조상이 되었습니다.",
    path: ["bethlehem", "moab", "bethlehem"] },
  { id: "david_flight", name: "다윗의 도피", color: "#4338CA", era: "구약",
    description: "사울 왕을 피해 놉의 제사장에게 떡을 얻고, 블레셋 가드로 갔다가 아둘람 굴에 동지들을 모았으며, 엔게디 동굴에서는 사울을 죽일 기회를 얻고도 살려주었습니다.",
    path: ["nob", "gath", "adullam", "engedi"] },
];

async function main() {
  let l = 0;
  for (const L of NEW_LOC) {
    await db.execute(
      `INSERT INTO locations (id, name, name_en, lat, lng, region, importance, label_pos, events, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'right', ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), name_en=VALUES(name_en), lat=VALUES(lat), lng=VALUES(lng),
         region=VALUES(region), importance=VALUES(importance), events=VALUES(events), description=VALUES(description)`,
      [L.id, L.name, L.name_en, L.lat, L.lng, L.region, L.importance, toEvents(L.e), L.d]
    );
    l++;
  }
  console.log(`신규 지역 추가: ${l}곳`);

  let j = 0;
  for (const J of NEW_JOURNEY) {
    await db.execute(
      `INSERT INTO journeys (id, name, color, era, description, path)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color), era=VALUES(era),
         description=VALUES(description), path=VALUES(path)`,
      [J.id, J.name, J.color, J.era, J.description, JSON.stringify(J.path)]
    );
    j++;
  }
  console.log(`신규 여정 추가: ${j}개`);

  const lt = await db.execute("SELECT COUNT(*) AS n FROM locations");
  const jt = await db.execute("SELECT COUNT(*) AS n FROM journeys");
  console.log(`전체 지역: ${lt[0].n}곳 / 전체 여정: ${jt[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
