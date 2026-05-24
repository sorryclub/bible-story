const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const https = require("https");
const { characters } = require("../src/data/characters.js");

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://ee95e72aa4bc50712a77c0c8a0caf9fb.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "a9455d98a9fed3fb0db769e3b942de97",
    secretAccessKey: "298c0ad28a126b406428ceee035918e786bacdc31b95563994b53f9961935f21",
  },
});

const STYLE = ", 3D animated biblical scene, Pixar Disney style, cinematic wide shot, warm golden lighting, ancient middle eastern setting, detailed environment, high quality, no text";

// 각 인물+단락별 영어 프롬프트 (장면 핵심 요소 명시)
// 자동 생성: 한국어 단락에서 핵심 키워드를 영어로 변환
const SCENE_KEYWORDS = {
  // 창조/에덴
  "흙으로": "God forming man from dust of the ground, divine light, Garden of Eden",
  "생령": "God breathing life into man made of clay, divine light, Garden of Eden",
  "에덴동산에 두시어": "man naming animals in lush Garden of Eden, many animals gathered",
  "동물에게 이름": "man naming animals in Garden of Eden, many different animals",
  "선악": "serpent tempting woman near forbidden tree with fruit, Garden of Eden",
  "뱀의 유혹": "serpent coiled around tree speaking to woman, forbidden fruit",
  "선악과를 먹": "man and woman eating forbidden fruit under tree, serpent watching",
  "에덴에서 쫓겨": "angel with flaming sword guarding gate of Eden, man and woman leaving sadly",
  "930세": "very old ancient man, elderly, end of life",

  // 하와
  "갈비뼈를 취하": "God creating woman from sleeping man's rib, divine light",
  "뼈 중의 뼈": "man seeing woman for first time in Garden of Eden, amazed",
  "결코 죽지": "cunning serpent speaking to woman near beautiful tree with fruit",
  "해산의 고통": "divine judgment scene, man and woman bowing before God",
  "산 자의 어머니": "woman holding baby, mother of all living, ancient setting",
  "가인과 아벨": "mother with two young boys, one shepherd one farmer",

  // 노아
  "당대에 완전한": "righteous old man standing alone among wicked people, contrast",
  "방주를 지으라": "old man building enormous wooden ark, massive construction",
  "명하신 대로": "old man working hard building giant wooden ark with tools",
  "가족 8명과 각종 동물": "family of 8 people and pairs of animals entering huge wooden ark, rain starting",
  "40일 동안 비": "massive flood waters covering earth, wooden ark floating on stormy sea",
  "무지개 언약": "beautiful rainbow in sky over landed ark, old man at altar offering sacrifice",
  "포도나무를 심고": "old man in vineyard with grape vines, ancient setting",
  "950세": "extremely old patriarch, ancient times",

  // 아브라함
  "갈대아 우르에서 불러": "old man leaving ancient city with caravan, desert journey, camels and tents",
  "의로 여기셨": "old man looking up at countless stars in night sky, God's promise",
  "할례 언약": "solemn covenant ceremony, old man bowing before divine presence",
  "이삭을 번제로": "old man with knife raised over son on stone altar on mountaintop, angel stopping him, ram caught in thicket",
  "소돔 멸망 전": "old man pleading and praying, burning city in background",
  "175세": "very old patriarch dying peacefully, family gathered",

  // 사라
  "자녀가 없었": "elderly couple in tent, sad about having no children, desert camp",
  "하갈이 사래를 멸시": "conflict between two women in tent, jealousy",
  "사래에서 사라": "elderly woman receiving new name from God, divine light",
  "속으로 웃으며": "elderly woman laughing behind tent curtain, secretly amused",
  "이삭을 낳고": "90 year old woman joyfully holding newborn baby, miracle birth",
  "하갈과 이스마엘을 내보내": "woman and teenage boy sent away into desert with water skin",
  "127세에 헤브론": "funeral scene, cave burial, ancient mourning",

  // 모세
  "갈대 상자": "baby in basket floating on Nile River, sister watching from reeds, Egyptian princess finding baby",
  "불타는 떨기나무": "man kneeling before burning bush that is not consumed, removing sandals, desert mountain",
  "내가 너를 바로에게": "divine calling from burning bush, man with staff, holy ground",
  "10가지 재앙": "plagues of Egypt, frogs blood locusts darkness, Egyptian palace",
  "홍해를 둘로 가르": "man raising staff over sea, massive walls of water parting, people walking through on dry ground",
  "십계명": "man receiving two stone tablets on mountain top, lightning and clouds, Mount Sinai",
  "금송아지": "people worshipping golden calf idol, angry prophet coming down mountain with tablets",
  "반석을 쳐서 물": "man striking rock with staff, water gushing out, desert",
  "느보산에서": "old man standing on mountaintop looking over promised land, sunset",

  // 다윗
  "양치기 소년": "young shepherd boy playing harp among sheep, peaceful hillside",
  "사무엘에 의해 기름": "young boy being anointed with oil by old prophet, family watching",
  "골리앗": "small young man with sling facing giant warrior in heavy armor, valley between two armies",
  "물매돌 하나": "young man swinging sling at giant warrior, stone flying",
  "사울의 추격": "young man hiding in cave, soldiers searching outside",
  "이스라엘의 왕": "man crowned king, cheering crowd, Jerusalem",
  "시편": "king playing harp, singing psalms, moonlight",

  // 예수
  "동정녀 마리아에게서 베들레헴": "baby in manger, mother and father, stable, star above, shepherds",
  "요단강에서 세례": "man being baptized in river, dove descending, heaven opening",
  "하나님 나라를 선포": "man teaching crowd on hillside, sermon on the mount",
  "병자를 고치": "man healing sick people, touching blind man's eyes, crowds watching",
  "십자가에서 죽으시고": "three crosses on hill, dramatic sky, sacrifice",
  "3일 만에 부활": "empty tomb with stone rolled away, bright light, morning",
  "승천": "man ascending into clouds, disciples watching from below",

  // 베드로
  "갈릴리의 어부": "fisherman casting nets on lake, boat, morning light",
  "물 위를 걸": "man walking on stormy water toward another figure, waves crashing",
  "그리스도라 고백": "man declaring faith to teacher, other disciples watching",
  "세 번 부인": "man weeping bitterly outside courtyard, rooster crowing, firelight",
  "오순절": "man preaching boldly to large crowd, tongues of fire above heads",

  // 바울
  "기독교를 핍박": "angry man overseeing arrest of believers, temple guards",
  "다메섹 도상에서": "man fallen from horse blinded by brilliant light from heaven, road to Damascus",
  "선교 여행": "man traveling by ship across sea, ancient Mediterranean",
  "감옥에서 서신": "man writing scrolls by lamplight in prison cell, chains",
};

function splitParagraphs(text) {
  const normalized = text.replace(/(\([^)]*\d+[:\d\-,\s장]*[^)]*\))\.\s*/g, "$1\n");
  return normalized.split("\n").filter(p => p.trim());
}

function makeEnglishPrompt(charName, paragraph) {
  // 한국어 단락에서 키워드 매칭
  for (const [keyword, engScene] of Object.entries(SCENE_KEYWORDS)) {
    if (paragraph.includes(keyword)) {
      return engScene + STYLE;
    }
  }
  // 매칭 안 되면 일반적인 성경 장면
  const cleaned = paragraph.replace(/\([^)]*\)/g, "").trim();
  return `ancient biblical scene with middle eastern people, ${charName}${STYLE}`;
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 120000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 1000) { reject(new Error("too small")); return; }
        resolve(buf);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function main() {
  let total = 0, done = 0, failed = 0;

  const tasks = [];
  for (const char of characters) {
    const paras = splitParagraphs(char.description);
    paras.forEach((para, idx) => tasks.push({ char, idx, para }));
  }
  total = tasks.length;
  console.log(`Total: ${total} images for ${characters.length} characters\n`);

  for (const { char, idx, para } of tasks) {
    const key = `stories/${char.id}_${idx}.jpg`;
    const prompt = makeEnglishPrompt(char.nameEn || char.name, para);
    const encoded = encodeURIComponent(prompt);
    const seed = hashCode(char.id + "_" + idx + "_v2");
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=432&seed=${seed}`;

    try {
      const buf = await downloadImage(url);
      await s3.send(new PutObjectCommand({
        Bucket: "bible-story-images",
        Key: key,
        Body: buf,
        ContentType: "image/jpeg",
      }));
      done++;
      console.log(`[${done}/${total}] OK ${key} (${(buf.length/1024).toFixed(0)}KB)`);
    } catch (err) {
      failed++;
      done++;
      console.log(`[${done}/${total}] FAIL ${key}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\nDone! ${done - failed} success, ${failed} failed out of ${total}`);
}

main().catch(console.error);
