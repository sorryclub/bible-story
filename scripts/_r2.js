// 스크립트 공용 Cloudflare R2(S3 호환) 클라이언트 헬퍼.
// 자격증명은 .env.local(또는 환경변수)에서만 읽는다 — 소스에 하드코딩 금지.
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");

// 로컬 실행 시 .env.local 자동 로드 (CI 등 이미 환경변수가 있으면 파일이 없어도 됨)
try {
  process.loadEnvFile(path.join(__dirname, "../.env.local"));
} catch {
  // .env.local 이 없으면 기존 process.env 사용
}

const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error(
    "R2 접속 정보가 없습니다. .env.local 에 R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY 를 설정하세요."
  );
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const bucket = R2_BUCKET || "bible-story-images";

module.exports = { s3, bucket };
