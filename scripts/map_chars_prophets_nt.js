const { connect } = require('@tidbcloud/serverless');

const db = connect({
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  username: 'uTokWGempxttKzg.root',
  password: 'vs8gJYo2o1frzToi',
  database: 'bible_story'
});

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

// ═══════════════════════════════════════════
//  PROPHETS
// ═══════════════════════════════════════════

// ─── ISAIAH (66 chapters) ───
add('isaiah', 'isaiah', [1, 6]);

// ─── JEREMIAH (52 chapters) ───
add('jeremiah_book', 'jeremiah', range(1, 52));

// ─── DANIEL (12 chapters) ───
add('daniel', 'daniel',                   range(1, 12));
add('daniel', 'nebuchadnezzar',            range(1, 4));
add('daniel', 'belshazzar',               [5]);
add('daniel', 'shadrach_meshach_abednego', [1, 3]);

// ─── HOSEA (14 chapters) ───
add('hosea', 'hosea_prophet', range(1, 14));
add('hosea', 'gomer',        [1, 3]);

// ─── JONAH (4 chapters) ───
add('jonah', 'jonah', range(1, 4));

// ═══════════════════════════════════════════
//  NEW TESTAMENT
// ═══════════════════════════════════════════

// ─── MATTHEW (28 chapters) ───
add('matthew', 'jesus',            range(1, 28));
add('matthew', 'mary',             [1, 2]);
add('matthew', 'joseph_carpenter', [1, 2]);
add('matthew', 'herod_great',      [2]);
add('matthew', 'john_baptist',     [3, 11, 14]);
add('matthew', 'peter',            [4, ...range(14, 17), 26]);
add('matthew', 'andrew',           [4]);
add('matthew', 'james_apostle',    [4, 17]);
add('matthew', 'john_apostle',     [4, 17]);
add('matthew', 'judas_iscariot',   range(26, 27));
add('matthew', 'caiaphas',         [26]);
add('matthew', 'pontius_pilate',   [27]);
add('matthew', 'barabbas',         [27]);
add('matthew', 'simon_cyrene',     [27]);
add('matthew', 'mary_magdalene',   [27, 28]);

// ─── MARK (16 chapters) ───
add('mark', 'jesus',           range(1, 16));
add('mark', 'peter',           [1, 8, 14]);
add('mark', 'john_baptist',    [1, 6]);
add('mark', 'herod_antipas',   [6]);
add('mark', 'herodias',        [6]);
add('mark', 'salome_herodias', [6]);
// Note: jairus is not in the available character IDs list, skipping

// ─── LUKE (24 chapters) ───
add('luke', 'jesus',            range(1, 24));
add('luke', 'mary',             [1, 2]);
add('luke', 'joseph_carpenter', [1, 2]);
add('luke', 'elizabeth',        [1]);
add('luke', 'zechariah_priest', [1]);
add('luke', 'simeon_temple',    [2]);
add('luke', 'anna_prophetess',  [2]);
add('luke', 'john_baptist',     [1, 3]);
add('luke', 'zacchaeus',        [19]);
add('luke', 'martha',           [10]);
add('luke', 'mary_bethany',     [10]);
add('luke', 'pontius_pilate',   [23]);
add('luke', 'barabbas',         [23]);
add('luke', 'simon_cyrene',     [23]);

// ─── JOHN (21 chapters) ───
add('john', 'jesus',           range(1, 21));
add('john', 'john_baptist',    [1, 3]);
add('john', 'nicodemus',       [3, 7, 19]);
add('john', 'mary_magdalene',  [20]);
add('john', 'martha',          [11, 12]);
add('john', 'mary_bethany',    [11, 12]);
add('john', 'lazarus',         [11, 12]);
add('john', 'thomas',          [11, 14, 20]);
add('john', 'peter',           [1, 6, 13, 18, 21]);
add('john', 'philip_apostle',  [1, 6, 14]);
add('john', 'bartholomew',     [1]);
add('john', 'judas_iscariot',  [6, 12, 13, 18]);
add('john', 'pontius_pilate',  [18, 19]);
add('john', 'barabbas',        [18]);

// ─── ACTS (28 chapters) ───
add('acts', 'peter',             [...range(1, 12), 15]);
add('acts', 'paul',              range(7, 28));
add('acts', 'stephen',           [6, 7]);
add('acts', 'philip_deacon',     [6, 8]);
add('acts', 'barnabas',          [4, 9, ...range(11, 15)]);
add('acts', 'cornelius',         [10]);
add('acts', 'gamaliel',          [5]);
add('acts', 'herod_agrippa1',    [12]);
add('acts', 'john_mark',         [12, 13, 15]);
add('acts', 'silas',             range(15, 18));
add('acts', 'timothy',           range(16, 20));
add('acts', 'luke',              [16, ...range(20, 21), 27, 28]);
add('acts', 'lydia',             [16]);
add('acts', 'philippian_jailer', [16]);
add('acts', 'priscilla_aquila',  [18]);
add('acts', 'apollos',           [18, 19]);
add('acts', 'agabus',            [11, 21]);
add('acts', 'ananias_damascus',  [9]);
add('acts', 'james_apostle',     [12]);

async function main() {
  console.log(`Total mappings to insert: ${mappings.length}`);

  const BATCH = 50;
  let inserted = 0;

  for (let i = 0; i < mappings.length; i += BATCH) {
    const batch = mappings.slice(i, i + BATCH);
    const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
    const values = batch.flat();

    const sql = `INSERT IGNORE INTO chapter_characters (book_id, chapter, character_id) VALUES ${placeholders}`;
    await db.execute(sql, values);
    inserted += batch.length;
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: inserted up to ${inserted} rows`);
  }

  // Verify counts per book
  const books = [
    'isaiah', 'jeremiah_book', 'daniel', 'hosea', 'jonah',
    'matthew', 'mark', 'luke', 'john', 'acts'
  ];
  const placeholderList = books.map(() => '?').join(', ');
  const verify = await db.execute(
    `SELECT book_id, COUNT(*) as cnt FROM chapter_characters WHERE book_id IN (${placeholderList}) GROUP BY book_id ORDER BY book_id`,
    books
  );
  console.log('\nVerification (rows per book):');
  for (const row of verify) {
    console.log(`  ${row.book_id}: ${row.cnt}`);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
