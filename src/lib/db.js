import { connect } from "@tidbcloud/serverless";

let conn = null;

export function getDB() {
  if (!conn) {
    conn = connect({
      host: process.env.TIDB_HOST,
      username: process.env.TIDB_USERNAME,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE || "bible_story",
    });
  }
  return conn;
}

// ── Characters ──
export async function getAllCharacters() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM characters ORDER BY bible_order ASC, id");
  return rows.map(parseCharacter);
}

export async function getCharacter(id) {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM characters WHERE id = ?", [id]);
  return rows.length > 0 ? parseCharacter(rows[0]) : null;
}

export async function getCharactersByPeriod(period) {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM characters WHERE period = ?", [period]);
  return rows.map(parseCharacter);
}

function parseCharacter(row) {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    role: row.role,
    period: row.period,
    color: row.color,
    avatar: typeof row.avatar === "string" ? JSON.parse(row.avatar) : row.avatar,
    shortDesc: row.short_desc,
    description: row.description,
    keyVerses: typeof row.key_verses === "string" ? JSON.parse(row.key_verses) : row.key_verses,
    keyEvents: typeof row.key_events === "string" ? JSON.parse(row.key_events) : row.key_events,
    relatedCharacters: typeof row.related_characters === "string" ? JSON.parse(row.related_characters) : row.related_characters,
    books: typeof row.books === "string" ? JSON.parse(row.books) : row.books,
    bibleOrder: row.bible_order || 999,
  };
}

// ── Timeline ──
export async function getAllTimelineEvents() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM timeline_events ORDER BY FIELD(era, '창조 시대','홍수 시대','족장 시대','출애굽 시대','정복 시대','사사 시대','왕국 시대','분열 왕국 시대','포로 시대','신약 시대'), year");
  return rows.map(parseTimelineEvent);
}

function parseTimelineEvent(row) {
  return {
    id: row.id,
    era: row.era,
    title: row.title,
    year: row.year,
    description: row.description,
    verse: row.verse,
    characters: typeof row.characters === "string" ? JSON.parse(row.characters) : row.characters,
    color: row.color,
  };
}

// ── Books ──
export async function getAllBooks() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM books ORDER BY FIELD(testament, 'old', 'new'), bible_order");
  return rows.map(parseBook);
}

export async function getBook(id) {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
  return rows.length > 0 ? parseBook(rows[0]) : null;
}

export async function getBookChapters(bookId) {
  const db = getDB();
  const [chapters, charLinks] = await Promise.all([
    db.execute("SELECT chapter, summary FROM book_chapters WHERE book_id = ? ORDER BY chapter", [bookId]),
    db.execute("SELECT chapter, character_id FROM chapter_characters WHERE book_id = ? ORDER BY chapter", [bookId]),
  ]);

  // 장별 인물 ID 그룹핑
  const charMap = {};
  charLinks.forEach(r => {
    const ch = r.chapter;
    if (!charMap[ch]) charMap[ch] = [];
    charMap[ch].push(r.character_id);
  });

  return chapters.map(r => ({
    chapter: r.chapter,
    summary: r.summary,
    characterIds: charMap[r.chapter] || [],
  }));
}

export async function getBooksByTestament(testament) {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM books WHERE testament = ? ORDER BY bible_order", [testament]);
  return rows.map(parseBook);
}

function parseBook(row) {
  return {
    id: row.id,
    testament: row.testament,
    name: row.name,
    nameEn: row.name_en,
    category: row.category,
    chapters: row.chapters,
    color: row.color,
    summary: row.summary,
    keyTheme: row.key_theme,
    uniquePerspective: row.unique_perspective,
    highlights: typeof row.highlights === "string" ? JSON.parse(row.highlights) : row.highlights,
  };
}

// ── Parables ──
export async function getAllParables() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM parables");
  return rows.map(parseParable);
}

function parseParable(row) {
  return {
    id: row.id,
    title: row.title,
    verse: row.verse,
    gospels: typeof row.gospels === "string" ? JSON.parse(row.gospels) : row.gospels,
    theme: row.theme,
    summary: row.summary,
  };
}

// ── Miracles ──
export async function getAllMiracles() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM miracles");
  return rows.map(parseMiracle);
}

function parseMiracle(row) {
  return {
    id: row.id,
    title: row.title,
    verse: row.verse,
    gospels: typeof row.gospels === "string" ? JSON.parse(row.gospels) : row.gospels,
    category: row.category,
    summary: row.summary,
  };
}

// ── Prophecies ──
export async function getAllProphecies() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM prophecies");
  return rows.map(parseProphecy);
}

function parseProphecy(row) {
  return {
    id: row.id,
    title: row.title,
    otVerse: row.ot_verse,
    otText: row.ot_text,
    ntVerse: row.nt_verse,
    ntText: row.nt_text,
    category: row.category,
  };
}

// ── Map ──
export async function getAllLocations() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM locations");
  return rows.map(parseLocation);
}

export async function getAllJourneys() {
  const db = getDB();
  const rows = await db.execute("SELECT * FROM journeys");
  return rows.map(parseJourney);
}

function parseLocation(row) {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    region: row.region,
    importance: row.importance,
    labelPos: row.label_pos,
    events: typeof row.events === "string" ? JSON.parse(row.events) : row.events,
  };
}

function parseJourney(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    era: row.era,
    description: row.description,
    path: typeof row.path === "string" ? JSON.parse(row.path) : row.path,
  };
}

// ── Periods (static) ──
export const periods = [
  "창조 시대", "홍수 시대", "족장 시대", "출애굽 시대", "정복 시대",
  "사사 시대", "왕국 시대", "분열 왕국 시대", "포로 시대", "신약 시대",
];

// ── Categories (static) ──
export const categories = {
  율법서: { color: "#2D7A4F" },
  역사서: { color: "#2B5EA7" },
  시가서: { color: "#B5436A" },
  선지서: { color: "#B07830" },
  복음서: { color: "#1A7A5A" },
  서신서: { color: "#5E4CA0" },
  예언서: { color: "#A03040" },
};

// ── Parable/Miracle themes (static) ──
export const parableThemes = ["하나님 나라", "기도", "용서", "재물", "이웃 사랑", "심판", "믿음", "구원"];
export const miracleCategories = ["치유", "자연", "귀신", "부활"];
export const prophecyCategories = ["탄생", "사역", "수난", "부활/승천"];
