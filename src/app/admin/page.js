import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = getDB();

  const [totalRows, todayRows, weekRows, topPages, topReferrers, dailyRows, countryRows] = await Promise.all([
    db.execute("SELECT COUNT(*) as cnt FROM page_views"),
    db.execute("SELECT COUNT(*) as cnt FROM page_views WHERE created_at >= CURDATE()"),
    db.execute("SELECT COUNT(*) as cnt FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
    db.execute("SELECT path, COUNT(*) as cnt FROM page_views GROUP BY path ORDER BY cnt DESC LIMIT 20"),
    db.execute("SELECT referrer, COUNT(*) as cnt FROM page_views WHERE referrer != '' GROUP BY referrer ORDER BY cnt DESC LIMIT 10"),
    db.execute("SELECT DATE(created_at) as date, COUNT(*) as cnt FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date DESC"),
    db.execute("SELECT country, COUNT(*) as cnt FROM page_views WHERE country != '' GROUP BY country ORDER BY cnt DESC LIMIT 10"),
  ]);

  return {
    total: totalRows[0]?.cnt || 0,
    today: todayRows[0]?.cnt || 0,
    week: weekRows[0]?.cnt || 0,
    topPages: topPages.map(r => ({ path: r.path, count: r.cnt })),
    topReferrers: topReferrers.map(r => ({ referrer: r.referrer, count: r.cnt })),
    daily: dailyRows.map(r => ({ date: r.date, count: r.cnt })),
    countries: countryRows.map(r => ({ country: r.country, count: r.cnt })),
  };
}

export default async function AdminPage() {
  // localhost에서만 접근 가능
  const h = await headers();
  const host = h.get("host") || "";
  if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    notFound();
  }

  const stats = await getStats();
  return <AdminClient stats={stats} />;
}
