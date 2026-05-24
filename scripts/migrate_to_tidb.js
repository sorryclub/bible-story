const db = require("./_db");

const { characters } = require("../src/data/characters.js");
const { timelineEvents } = require("../src/data/timeline.js");
const { books } = require("../src/data/books.js");
const { parables } = require("../src/data/parables.js");
const { miracles } = require("../src/data/miracles.js");
const { prophecies } = require("../src/data/prophecies.js");
const { locations, journeys } = require("../src/data/map.js");


async function migrate() {
  console.log("Starting migration...\n");

  // 1. Characters
  console.log(`Migrating ${characters.length} characters...`);
  for (const c of characters) {
    await db.execute(
      `INSERT INTO characters (id, name, name_en, role, period, color, avatar, short_desc, description, key_verses, key_events, related_characters, books)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), key_verses=VALUES(key_verses), key_events=VALUES(key_events)`,
      [c.id, c.name, c.nameEn, c.role, c.period, c.color,
       JSON.stringify(c.avatar), c.shortDesc, c.description,
       JSON.stringify(c.keyVerses), JSON.stringify(c.keyEvents),
       JSON.stringify(c.relatedCharacters), JSON.stringify(c.books)]
    );
  }
  console.log(`  Done: ${characters.length} characters\n`);

  // 2. Timeline
  console.log(`Migrating ${timelineEvents.length} timeline events...`);
  for (const e of timelineEvents) {
    await db.execute(
      `INSERT INTO timeline_events (id, era, title, year, description, verse, characters, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)`,
      [e.id, e.era, e.title, e.year, e.description, e.verse,
       JSON.stringify(e.characters), e.color]
    );
  }
  console.log(`  Done: ${timelineEvents.length} events\n`);

  // 3. Books
  const allBooks = [...books.oldTestament.map(b => ({...b, testament: "old"})),
                     ...books.newTestament.map(b => ({...b, testament: "new"}))];
  console.log(`Migrating ${allBooks.length} books...`);
  for (const b of allBooks) {
    await db.execute(
      `INSERT INTO books (id, testament, name, name_en, category, chapters, color, summary, key_theme, unique_perspective, highlights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), summary=VALUES(summary)`,
      [b.id, b.testament, b.name, b.nameEn, b.category, b.chapters, b.color,
       b.summary, b.keyTheme, b.uniquePerspective || null,
       JSON.stringify(b.highlights)]
    );
  }
  console.log(`  Done: ${allBooks.length} books\n`);

  // 4. Parables
  console.log(`Migrating ${parables.length} parables...`);
  for (const p of parables) {
    await db.execute(
      `INSERT INTO parables (id, title, verse, gospels, theme, summary)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [p.id, p.title, p.verse, JSON.stringify(p.gospels), p.theme, p.summary]
    );
  }
  console.log(`  Done: ${parables.length} parables\n`);

  // 5. Miracles
  console.log(`Migrating ${miracles.length} miracles...`);
  for (const m of miracles) {
    await db.execute(
      `INSERT INTO miracles (id, title, verse, gospels, category, summary)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [m.id, m.title, m.verse, JSON.stringify(m.gospels), m.category, m.summary]
    );
  }
  console.log(`  Done: ${miracles.length} miracles\n`);

  // 6. Prophecies
  console.log(`Migrating ${prophecies.length} prophecies...`);
  for (const p of prophecies) {
    await db.execute(
      `INSERT INTO prophecies (id, title, ot_verse, ot_text, nt_verse, nt_text, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [p.id, p.title, p.otVerse, p.otText, p.ntVerse, p.ntText, p.category]
    );
  }
  console.log(`  Done: ${prophecies.length} prophecies\n`);

  // 7. Locations
  console.log(`Migrating ${locations.length} locations...`);
  for (const l of locations) {
    await db.execute(
      `INSERT INTO locations (id, name, name_en, lat, lng, region, importance, label_pos, events)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [l.id, l.name, l.nameEn, l.lat, l.lng, l.region,
       l.importance || 0, l.labelPos || "right", JSON.stringify(l.events)]
    );
  }
  console.log(`  Done: ${locations.length} locations\n`);

  // 8. Journeys
  console.log(`Migrating ${journeys.length} journeys...`);
  for (const j of journeys) {
    await db.execute(
      `INSERT INTO journeys (id, name, color, era, description, path)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [j.id, j.name, j.color, j.era, j.description, JSON.stringify(j.path)]
    );
  }
  console.log(`  Done: ${journeys.length} journeys\n`);

  console.log("=== Migration complete! ===");
}

migrate().catch(console.error);
