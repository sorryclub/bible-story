// 메시아 예언 6개 추가 (1회성)
const db = require("./_db");

const NEW = [
  {
    id: "eternal-king", title: "영원한 왕 (다윗의 위)", category: "탄생",
    ot_verse: "이사야 9:6-7", ot_text: "이는 한 아기가 우리에게 났고 한 아들을 우리에게 주신 바 되었는데 그의 어깨에는 정사를 메었고 그의 이름은 기묘자라, 모사라, 전능하신 하나님이라, 영존하시는 아버지라, 평강의 왕이라 할 것임이라",
    nt_verse: "누가복음 1:32-33", nt_text: "그가 큰 자가 되고 지극히 높으신 이의 아들이라 일컬어질 것이요 주 하나님께서 그 조상 다윗의 왕위를 그에게 주시리니 영원히 야곱의 집을 다스리실 것이며 그 나라가 무궁하리라",
  },
  {
    id: "anointed-jubilee", title: "희년의 기름부음", category: "사역",
    ot_verse: "이사야 61:1-2", ot_text: "주 여호와의 영이 내게 내리셨으니 이는 여호와께서 내게 기름을 부으사 가난한 자에게 아름다운 소식을 전하게 하려 하심이라",
    nt_verse: "누가복음 4:18-19", nt_text: "주의 성령이 내게 임하셨으니 이는 가난한 자에게 복음을 전하게 하시려고 내게 기름을 부으시고 나를 보내사 포로 된 자에게 자유를, 눈먼 자에게 다시 보게 함을 전파하게 하려 하심이라",
  },
  {
    id: "forsaken", title: "버림받으심", category: "수난",
    ot_verse: "시편 22:1", ot_text: "내 하나님이여 내 하나님이여 어찌 나를 버리셨나이까 어찌 나를 멀리 하여 돕지 아니하시오며",
    nt_verse: "마태복음 27:46", nt_text: "엘리 엘리 라마 사박다니 하시니 이는 곧 나의 하나님, 나의 하나님, 어찌하여 나를 버리셨나이까 하는 뜻이라",
  },
  {
    id: "vinegar-drink", title: "신 포도주를 마심", category: "수난",
    ot_verse: "시편 69:21", ot_text: "그들이 쓸개를 나의 음식물로 주며 내가 목마를 때에 초를 마시게 하였사오니",
    nt_verse: "요한복음 19:28-29", nt_text: "예수께서 내가 목마르다 하시니 신 포도주를 적신 해면을 우슬초에 매어 예수의 입에 대니라",
  },
  {
    id: "buried-with-rich", title: "부자의 무덤에 장사됨", category: "수난",
    ot_verse: "이사야 53:9", ot_text: "그는 강포를 행하지 아니하였고 그의 입에 거짓이 없었으나 그의 무덤이 악인과 함께 되었으며 그가 죽은 후에 부자와 함께 있었도다",
    nt_verse: "마태복음 27:57-60", nt_text: "아리마대의 부자 요셉이 예수의 시체를 가져다가 깨끗한 세마포로 싸서 바위 속에 판 자기 새 무덤에 넣어 두고",
  },
  {
    id: "seated-right-hand", title: "하나님 우편에 앉으심", category: "부활/승천",
    ot_verse: "시편 110:1", ot_text: "여호와께서 내 주에게 말씀하시기를 내가 네 원수들로 네 발판이 되게 하기까지 너는 내 오른쪽에 앉아 있으라 하셨도다",
    nt_verse: "마가복음 16:19", nt_text: "주 예수께서 말씀을 마치신 후에 하늘로 올려지사 하나님 우편에 앉으시니라",
  },
];

async function main() {
  let n = 0;
  for (const p of NEW) {
    await db.execute(
      `INSERT INTO prophecies (id, title, ot_verse, ot_text, nt_verse, nt_text, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), ot_verse=VALUES(ot_verse), ot_text=VALUES(ot_text),
         nt_verse=VALUES(nt_verse), nt_text=VALUES(nt_text), category=VALUES(category)`,
      [p.id, p.title, p.ot_verse, p.ot_text, p.nt_verse, p.nt_text, p.category]
    );
    n++;
  }
  console.log(`예언 추가: ${n}개`);
  const tot = await db.execute("SELECT COUNT(*) AS n FROM prophecies");
  console.log(`전체 예언: ${tot[0].n}개`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
