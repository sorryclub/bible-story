import { getDB } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    const h = await headers();
    const body = await request.json();
    const path = body.path || "/";
    const referrer = body.referrer || "";
    const country = h.get("x-vercel-ip-country") || "";
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";

    const db = getDB();

    // 같은 IP → 하루에 1번만 기록
    const existing = await db.execute(
      "SELECT id FROM page_views WHERE ip = ? AND created_at >= CURDATE() LIMIT 1",
      [ip]
    );

    if (existing.length > 0) {
      return Response.json({ ok: true, dup: true });
    }

    await db.execute(
      "INSERT INTO page_views (path, referrer, country, ip) VALUES (?, ?, ?, ?)",
      [path.slice(0, 500), referrer.slice(0, 1000), country.slice(0, 10), ip.slice(0, 45)]
    );

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
