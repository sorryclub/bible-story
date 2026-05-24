// 스크립트 공용 TiDB 연결 헬퍼.
// 자격증명은 .env.local(또는 환경변수)에서만 읽는다 — 소스에 하드코딩 금지.
const path = require("path");
const { connect } = require("@tidbcloud/serverless");

// 로컬 실행 시 .env.local 자동 로드 (CI 등 이미 환경변수가 있으면 파일이 없어도 됨)
try {
  process.loadEnvFile(path.join(__dirname, "../.env.local"));
} catch {
  // .env.local 이 없으면 기존 process.env 사용
}

const { TIDB_HOST, TIDB_USERNAME, TIDB_PASSWORD, TIDB_DATABASE } = process.env;

if (!TIDB_HOST || !TIDB_USERNAME || !TIDB_PASSWORD) {
  throw new Error(
    "TiDB 접속 정보가 없습니다. .env.local 에 TIDB_HOST / TIDB_USERNAME / TIDB_PASSWORD 를 설정하세요."
  );
}

const db = connect({
  host: TIDB_HOST,
  username: TIDB_USERNAME,
  password: TIDB_PASSWORD,
  database: TIDB_DATABASE || "bible_story",
});

module.exports = db;
