// 구절 참조 텍스트 → 성경 책 링크 변환
// "창 22:1-14" → { bookId: "genesis", chapter: 22, href: "/books/genesis#22" }

const BOOK_MAP = {
  "창": "genesis", "창세기": "genesis",
  "출": "exodus", "출애굽기": "exodus",
  "레": "leviticus", "레위기": "leviticus",
  "민": "numbers", "민수기": "numbers",
  "신": "deuteronomy", "신명기": "deuteronomy",
  "수": "joshua", "여호수아": "joshua",
  "삿": "judges", "사사기": "judges",
  "룻": "ruth", "룻기": "ruth",
  "삼상": "1samuel", "사무엘상": "1samuel",
  "삼하": "2samuel", "사무엘하": "2samuel",
  "왕상": "1kings", "열왕기상": "1kings",
  "왕하": "2kings", "열왕기하": "2kings",
  "대상": "1chronicles", "역대상": "1chronicles",
  "대하": "2chronicles", "역대하": "2chronicles",
  "스": "ezra", "에스라": "ezra",
  "느": "nehemiah", "느헤미야": "nehemiah",
  "에": "esther", "에스더": "esther",
  "욥": "job", "욥기": "job",
  "시": "psalms", "시편": "psalms",
  "잠": "proverbs", "잠언": "proverbs",
  "전": "ecclesiastes", "전도서": "ecclesiastes",
  "아": "songofsolomon", "아가": "songofsolomon",
  "사": "isaiah", "이사야": "isaiah",
  "렘": "jeremiah_book", "예레미야": "jeremiah_book",
  "애": "lamentations", "예레미야애가": "lamentations",
  "겔": "ezekiel", "에스겔": "ezekiel",
  "단": "daniel", "다니엘": "daniel",
  "호": "hosea", "호세아": "hosea",
  "욜": "joel", "요엘": "joel",
  "암": "amos", "아모스": "amos",
  "옵": "obadiah", "오바댜": "obadiah",
  "욘": "jonah", "요나": "jonah",
  "미": "micah", "미가": "micah",
  "나": "nahum", "나훔": "nahum",
  "합": "habakkuk", "하박국": "habakkuk",
  "습": "zephaniah", "스바냐": "zephaniah",
  "학": "haggai", "학개": "haggai",
  "슥": "zechariah", "스가랴": "zechariah",
  "말": "malachi", "말라기": "malachi",
  "마": "matthew", "마태복음": "matthew",
  "막": "mark", "마가복음": "mark",
  "눅": "luke", "누가복음": "luke",
  "요": "john", "요한복음": "john",
  "행": "acts", "사도행전": "acts",
  "롬": "romans", "로마서": "romans",
  "고전": "1corinthians", "고린도전서": "1corinthians",
  "고후": "2corinthians", "고린도후서": "2corinthians",
  "갈": "galatians", "갈라디아서": "galatians",
  "엡": "ephesians", "에베소서": "ephesians",
  "빌": "philippians", "빌립보서": "philippians",
  "골": "colossians", "골로새서": "colossians",
  "살전": "1thessalonians", "데살로니가전서": "1thessalonians",
  "살후": "2thessalonians", "데살로니가후서": "2thessalonians",
  "딤전": "1timothy", "디모데전서": "1timothy",
  "딤후": "2timothy", "디모데후서": "2timothy",
  "딛": "titus", "디도서": "titus",
  "몬": "philemon", "빌레몬서": "philemon",
  "히": "hebrews", "히브리서": "hebrews",
  "약": "james", "야고보서": "james",
  "벧전": "1peter", "베드로전서": "1peter",
  "벧후": "2peter", "베드로후서": "2peter",
  "요일": "1john", "요한일서": "1john",
  "요이": "2john", "요한이서": "2john",
  "요삼": "3john", "요한삼서": "3john",
  "유": "jude", "유다서": "jude",
  "계": "revelation", "요한계시록": "revelation",
};

// 각 책의 '정식 한글 이름'(가장 긴 key)만 추출. 약어("사","막")는 단어 안에서
// 오매칭하므로 제외 (예: "사복음서"의 "사"가 이사야로 잘못 잡히는 것 방지).
const FULL_BOOK_NAMES = (() => {
  const byId = {};
  for (const [name, id] of Object.entries(BOOK_MAP)) {
    if (!byId[id] || name.length > byId[id].length) byId[id] = name;
  }
  return Object.values(byId).sort((a, b) => b.length - a.length);
})();
const FULL_NAMES_RE = FULL_BOOK_NAMES
  .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

// 괄호 안 텍스트에서 책(+장) 참조를 링크 토큰으로 분해해 out 에 push.
function tokenizeRefs(out, inner) {
  const re = new RegExp(
    `(${FULL_NAMES_RE})(\\s*\\d+(?::\\d+)?(?:[-~]\\d+(?::\\d+)?)?장?)?`,
    "g"
  );
  let last = 0;
  let m;
  while ((m = re.exec(inner)) !== null) {
    if (m.index > last) out.push({ text: inner.slice(last, m.index) });
    const bookId = BOOK_MAP[m[1]];
    const chapMatch = m[2] && m[2].match(/\d+/);
    const chapter = chapMatch ? parseInt(chapMatch[0], 10) : null;
    out.push({
      text: m[0],
      href: chapter ? `/books/${bookId}?ch=${chapter}` : `/books/${bookId}`,
    });
    last = m.index + m[0].length;
  }
  if (last < inner.length) out.push({ text: inner.slice(last) });
}

// 문장 속 성구 참조를 토큰 배열로 분해. 링크는 '괄호 안' 참조에만 적용
// (본문의 인물 이름이 책 이름과 겹쳐 오링크되는 것을 방지).
// 반환: [{ text }, { text, href }, ...] — href 있으면 링크, 없으면 일반 텍스트.
export function tokenizeVerses(text) {
  if (!text) return [{ text: "" }];
  const out = [];
  const parenRe = /\(([^)]*)\)/g;
  let last = 0;
  let pm;
  while ((pm = parenRe.exec(text)) !== null) {
    if (pm.index > last) out.push({ text: text.slice(last, pm.index) });
    out.push({ text: "(" });
    tokenizeRefs(out, pm[1]);
    out.push({ text: ")" });
    last = pm.index + pm[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export function parseVerseRef(text, fromCharacterId) {
  // "창 22:1-14" or "창세기 22:1-14" or "출 2장" or "삼상 17:45-50"
  const match = text.match(/^([가-힣]+)\s*(\d+)/);
  if (!match) return null;

  const bookName = match[1];
  const chapter = parseInt(match[2]);
  const bookId = BOOK_MAP[bookName];

  if (!bookId) return null;

  // 해시(#ch) 대신 쿼리(?ch=)를 사용 — 라우터 캐시에서도 반응형으로 해당 장으로 이동
  const query = new URLSearchParams();
  query.set("ch", String(chapter));
  if (fromCharacterId) query.set("from", fromCharacterId);

  return {
    bookId,
    chapter,
    href: `/books/${bookId}?${query.toString()}`,
  };
}
