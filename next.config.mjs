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
    // R2 인물/스토리 이미지 원본 호스트 (next/image 최적화 허용)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-14ef5aceb12144c087607ff39589751a.r2.dev",
        pathname: "/**",
      },
    ],
    // 최적화 결과 캐시(Next 16 기본 4시간). 캐시 무효화는 ?v=ASSET_VERSION 이 담당한다:
    // R2에서 이미지를 덮어쓴 뒤 (빈 커밋으로라도) 재배포하면 커밋 SHA가 바뀌어 URL이 갱신되고
    // Vercel 엣지 캐시(이미지 ~1시간)를 우회해 즉시 새 이미지가 반영된다.
    minimumCacheTTL: 14400,
  },
};

export default nextConfig;
