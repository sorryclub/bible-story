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
    // 인물 이미지는 변하지 않으므로 최적화 결과를 장기 캐시(1년)
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
