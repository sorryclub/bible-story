const db = require("./_db");


// Helper: generate array of integers from start to end (inclusive)
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

// --- Joshua (24 chapters) ---
add('joshua', 'joshua', range(1, 24));
add('joshua', 'caleb', range(14, 15));
add('joshua', 'rahab', [2, 6]);
add('joshua', 'achan', [7]);

// --- Judges (21 chapters) ---
add('judges', 'othniel', [3]);
add('judges', 'ehud', [3]);
add('judges', 'deborah', range(4, 5));
add('judges', 'gideon', range(6, 8));
add('judges', 'abimelech_gideon', [9]);
add('judges', 'jephthah', range(11, 12));
add('judges', 'samson', range(13, 16));
add('judges', 'delilah', [16]);

// --- Ruth (4 chapters) ---
add('ruth', 'ruth', range(1, 4));
add('ruth', 'naomi', range(1, 4));
add('ruth', 'boaz', range(2, 4));

// --- 1 Samuel (31 chapters) ---
add('1samuel', 'eli', range(1, 4));
add('1samuel', 'hannah', range(1, 2));
add('1samuel', 'samuel', [...range(1, 16), 25, 28]);
add('1samuel', 'saul_king', range(9, 31));
add('1samuel', 'jonathan', [13, 14, ...range(18, 20), 23, 31]);
add('1samuel', 'david', range(16, 31));
add('1samuel', 'goliath', [17]);
add('1samuel', 'abigail', [25]);

// --- 2 Samuel (24 chapters) ---
add('2samuel', 'david', range(1, 24));
add('2samuel', 'bathsheba', range(11, 12));
add('2samuel', 'nathan', [7, 12]);
add('2samuel', 'absalom', range(13, 19));
add('2samuel', 'mephibosheth', [4, 9, 16, 19]);
add('2samuel', 'uriah', [11]);

// --- 1 Kings (22 chapters) ---
add('1kings', 'solomon', range(1, 11));
add('1kings', 'rehoboam', [12, 14]);
add('1kings', 'jeroboam', range(11, 14));
add('1kings', 'ahab', range(16, 22));
add('1kings', 'jezebel', [16, ...range(18, 19), 21]);
add('1kings', 'naboth', [21]);
add('1kings', 'elijah', range(17, 19).concat([21]));

// --- 2 Kings (25 chapters) ---
add('2kings', 'elisha', [...range(2, 9), 13]);
add('2kings', 'naaman', [5]);
add('2kings', 'gehazi', [5, 8]);
add('2kings', 'hezekiah', range(18, 20));
add('2kings', 'josiah', range(22, 23));
add('2kings', 'athaliah', [11]);
add('2kings', 'joash_king', range(11, 12));

// --- Esther (10 chapters) ---
add('esther', 'esther', range(2, 9));
add('esther', 'mordecai', range(2, 10));
add('esther', 'haman', range(3, 7));

// --- Ezra (10 chapters) ---
add('ezra', 'ezra_priest', range(7, 10));
add('ezra', 'zerubbabel', range(2, 3));

// --- Nehemiah (13 chapters) ---
add('nehemiah', 'nehemiah', range(1, 13));

async function main() {
  console.log(`Total mappings to insert: ${mappings.length}`);

  let inserted = 0;
  let skipped = 0;
  const batchSize = 50;

  for (let i = 0; i < mappings.length; i += batchSize) {
    const batch = mappings.slice(i, i + batchSize);

    // Build a multi-row INSERT IGNORE
    const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
    const values = batch.flat();

    const sql = `INSERT IGNORE INTO chapter_characters (book_id, chapter, character_id) VALUES ${placeholders}`;
    const result = await db.execute(sql, values);

    const affectedRows = result.rowsAffected || 0;
    inserted += affectedRows;
    skipped += batch.length - affectedRows;

    console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} rows sent, ${affectedRows} inserted, ${batch.length - affectedRows} skipped (duplicates)`);
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped (already existed): ${skipped}, Total processed: ${mappings.length}`);

  // Verify counts per book
  const counts = await db.execute(`
    SELECT book_id, COUNT(*) as cnt
    FROM chapter_characters
    WHERE book_id IN ('joshua','judges','ruth','1samuel','2samuel','1kings','2kings','esther','ezra','nehemiah')
    GROUP BY book_id
    ORDER BY FIELD(book_id, 'joshua','judges','ruth','1samuel','2samuel','1kings','2kings','esther','ezra','nehemiah')
  `);
  console.log('\nVerification - rows per book:');
  for (const row of counts.rows || counts) {
    console.log(`  ${row.book_id}: ${row.cnt}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
