// 배포마다 바뀌는 에셋 버전. 인물/스토리 이미지를 R2에서 같은 키로 덮어쓴 뒤
// 이 값이 바뀌면(=새 배포) 이미지 URL의 ?v= 가 갱신되어 캐시가 자연히 무효화된다.
// Vercel 배포 시 커밋 SHA, 로컬/그 외 빌드는 빌드 시각으로 대체.
const ASSET_VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now())).slice(0, 12);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  // 클라이언트 번들에도 인라인되어 서버/클라이언트가 동일한 버전 URL을 렌더 → 교체 깜빡임 제거
  env: {
    NEXT_PUBLIC_ASSET_VERSION: ASSET_VERSION,
  },
  images: {
    // 이미지 최적화를 끈다. 인물 사진은 R2 원본(40~50KB JPG)을 브라우저가 직접 받는다.
    // 최적화 캐시가 4시간마다 비어 월 2.8K 변환(Hobby 한도 5K)과 전송량 대부분을 쓰고 있었다.
    // 원본이 이미 작고 바뀔 일도 없어 최적화로 얻는 게 거의 없다.
    unoptimized: true,
    // R2 인물/스토리 이미지 원본 호스트
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-14ef5aceb12144c087607ff39589751a.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
