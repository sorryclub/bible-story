/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
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
