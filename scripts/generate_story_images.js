const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const { characters } = require("../src/data/characters.js");

const STYLE = ", biblical scene illustration, 3D animated Pixar Disney style, cinematic composition, warm golden lighting, ancient middle eastern setting, high quality, detailed";
const OUT_DIR = path.join(__dirname, "../public/stories");

// 구절 참조를 기준으로 단락 분리 (StyledDescription과 동일한 로직)
function splitParagraphs(text) {
  const normalized = text.replace(
    /(\([^)]*\d+[:\d\-,\s장]*[^)]*\))\.\s*/g,
    "$1\n"
  );
  return normalized.split("\n").filter((p) => p.trim());
}

// 단락 텍스트에서 이미지 프롬프트 생성
function makePrompt(charName, paragraph) {
  // 구절 참조 제거
  const cleaned = paragraph.replace(/\([^)]*\d+[:\d\-,\s장]*[^)]*\)/g, "").trim();
  // 60자로 자르기 (프롬프트 길이 제한)
  const short = cleaned.length > 80 ? cleaned.substring(0, 80) : cleaned;
  return `${short}${STYLE}`;
}

// 이미지 다운로드
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { timeout: 120000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 1000) {
          reject(new Error(`Too small: ${buffer.length}b`));
          return;
        }
        fs.writeFileSync(filepath, buffer);
        resolve(buffer.length);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let total = 0;
  let done = 0;
  let failed = 0;

  // 전체 작업량 계산
  const tasks = [];
  for (const char of characters) {
    const paragraphs = splitParagraphs(char.description);
    paragraphs.forEach((para, idx) => {
      tasks.push({ char, idx, para });
    });
  }
  total = tasks.length;
  console.log(`Total: ${total} images to generate for ${characters.length} characters`);

  for (const { char, idx, para } of tasks) {
    const filename = `${char.id}_${idx}.jpg`;
    const filepath = path.join(OUT_DIR, filename);

    // 이미 있으면 스킵
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      done++;
      continue;
    }

    const prompt = makePrompt(char.name, para);
    const encoded = encodeURIComponent(prompt);
    const seed = Math.abs(hashCode(char.id + "_" + idx));
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=432&seed=${seed}`;

    try {
      const size = await downloadImage(url, filepath);
      done++;
      console.log(`[${done}/${total}] OK ${filename} (${(size/1024).toFixed(0)}KB)`);
    } catch (err) {
      failed++;
      done++;
      console.log(`[${done}/${total}] FAIL ${filename}: ${err.message}`);
    }

    // rate limit 대기
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\nDone! ${done - failed} success, ${failed} failed out of ${total}`);
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

main().catch(console.error);
