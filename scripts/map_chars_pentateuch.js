const db = require("./_db");


// Helper: expand a range like [1, 5] into [1, 2, 3, 4, 5]
function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

// Build all (book_id, chapter, character_id) tuples
const mappings = [];

function add(bookId, characterId, chapters) {
  for (const ch of chapters) {
    mappings.push([bookId, ch, characterId]);
  }
}

// ─── GENESIS (50 chapters) ───
add('genesis', 'adam',        range(1, 5));
add('genesis', 'eve',         range(1, 5));
add('genesis', 'cain',        [4]);
add('genesis', 'abel',        [4]);
add('genesis', 'enoch',       [5]);
add('genesis', 'methuselah',  [5]);
add('genesis', 'noah',        range(6, 9));
add('genesis', 'abraham',     range(12, 25));
add('genesis', 'sarah',       range(12, 23));
add('genesis', 'lot',         [13, 14, 19]);
add('genesis', 'hagar',       [16, 21]);
add('genesis', 'ishmael',     [16, 17, 21, 25]);
add('genesis', 'isaac',       range(21, 27));
add('genesis', 'rebekah',     range(24, 27));
add('genesis', 'esau',        range(25, 33));
add('genesis', 'jacob',       range(25, 50));
add('genesis', 'leah',        range(29, 35));
add('genesis', 'rachel',      range(29, 35));
add('genesis', 'laban',       [24, ...range(29, 31)]);
add('genesis', 'judah',       [37, 38, 43, 44]);
add('genesis', 'tamar',       [38]);
add('genesis', 'joseph',      range(37, 50));
add('genesis', 'potiphar',    [39]);
add('genesis', 'benjamin',    range(42, 45));
add('genesis', 'melchizedek', [14]);

// ─── EXODUS (40 chapters) ───
add('exodus', 'moses',          range(2, 40));
add('exodus', 'aaron',          range(4, 40));
add('exodus', 'miriam',         [2, 15]);
add('exodus', 'pharaoh_exodus', range(5, 14));
add('exodus', 'zipporah',       [2, 4, 18]);
add('exodus', 'jethro',         [2, 3, 18]);

// ─── LEVITICUS (27 chapters) ───
add('leviticus', 'moses', range(1, 27));
add('leviticus', 'aaron', [8, 9, 10, 16]);

// ─── NUMBERS (36 chapters) ───
add('numbers', 'moses',   range(1, 36));
add('numbers', 'aaron',   [3, 4, 12, ...range(16, 17), 20]);
add('numbers', 'miriam',  [12, 20]);
add('numbers', 'caleb',   [13, 14]);
add('numbers', 'joshua',  [13, 14, 27]);
add('numbers', 'balaam',  range(22, 24));
add('numbers', 'korah',   [16]);

// ─── DEUTERONOMY (34 chapters) ───
add('deuteronomy', 'moses',  range(1, 34));
add('deuteronomy', 'joshua', [31, 34]);

async function main() {
  console.log(`Total mappings to insert: ${mappings.length}`);

  const BATCH = 50;
  let inserted = 0;

  for (let i = 0; i < mappings.length; i += BATCH) {
    const batch = mappings.slice(i, i + BATCH);
    const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
    const values = batch.flat();

    const sql = `INSERT IGNORE INTO chapter_characters (book_id, chapter, character_id) VALUES ${placeholders}`;
    const result = await db.execute(sql, values);
    inserted += batch.length;
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: inserted up to ${inserted} rows`);
  }

  // Verify counts per book
  const verify = await db.execute(
    `SELECT book_id, COUNT(*) as cnt FROM chapter_characters WHERE book_id IN ('genesis','exodus','leviticus','numbers','deuteronomy') GROUP BY book_id ORDER BY FIELD(book_id,'genesis','exodus','leviticus','numbers','deuteronomy')`
  );
  console.log('\nVerification (rows per book):');
  for (const row of verify) {
    console.log(`  ${row.book_id}: ${row.cnt}`);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
