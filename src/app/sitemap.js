import { getAllCharacters, getAllBooks } from "@/lib/db";

const BASE = "https://xn--oy2b970a.com"; // 진리.com

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/timeline", priority: 0.8, changeFrequency: "monthly" },
    { path: "/characters", priority: 0.9, changeFrequency: "weekly" },
    { path: "/books", priority: 0.9, changeFrequency: "weekly" },
    { path: "/map", priority: 0.7, changeFrequency: "monthly" },
    { path: "/parables", priority: 0.7, changeFrequency: "monthly" },
    { path: "/miracles", priority: 0.7, changeFrequency: "monthly" },
    { path: "/prophecies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/gospels", priority: 0.7, changeFrequency: "monthly" },
  ].map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let dynamicRoutes = [];
  try {
    const [characters, books] = await Promise.all([
      getAllCharacters(),
      getAllBooks(),
    ]);
    dynamicRoutes = [
      ...characters.map((c) => ({
        url: `${BASE}/characters/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      })),
      ...books.map((b) => ({
        url: `${BASE}/books/${b.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      })),
    ];
  } catch (e) {
    // DB 접속 실패 시에도 정적 경로 사이트맵은 생성되도록 한다.
    console.error("sitemap: 동적 경로 생성 실패", e);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
