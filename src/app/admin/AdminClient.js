"use client";

import { BarChart3, Eye, Calendar, Globe, Link2, TrendingUp } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base text-stone-500">{label}</span>
        <Icon size={18} className="text-stone-400" />
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{Number(value).toLocaleString()}</p>
    </div>
  );
}

export default function AdminClient({ stats }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">관리자 대시보드</h1>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="오늘 방문" value={stats.today} icon={Eye} color="#1A7A5A" />
          <StatCard label="이번 주" value={stats.week} icon={Calendar} color="#2B5EA7" />
          <StatCard label="전체 방문" value={stats.total} icon={TrendingUp} color="#1E3A8A" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 일별 방문 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-stone-500" />
              일별 방문 (최근 30일)
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {stats.daily.map((d) => {
                const max = Math.max(...stats.daily.map(x => Number(x.count)), 1);
                const pct = (Number(d.count) / max) * 100;
                return (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-sm text-stone-500 w-24 shrink-0">{String(d.date).slice(5)}</span>
                    <div className="flex-1 h-6 bg-stone-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{ width: `${pct}%`, backgroundColor: "#1E3A8A" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-stone-700 w-12 text-right">{Number(d.count).toLocaleString()}</span>
                  </div>
                );
              })}
              {stats.daily.length === 0 && <p className="text-stone-400 text-base">아직 데이터가 없습니다</p>}
            </div>
          </div>

          {/* 인기 페이지 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Link2 size={18} className="text-stone-500" />
              인기 페이지
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {stats.topPages.map((p, i) => (
                <div key={p.path} className="flex items-center justify-between py-1.5 border-b border-stone-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-stone-400 w-5">{i + 1}</span>
                    <span className="text-base text-stone-700 truncate">{p.path}</span>
                  </div>
                  <span className="text-sm font-medium text-stone-900 shrink-0 ml-2">{Number(p.count).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 유입 경로 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Globe size={18} className="text-stone-500" />
              유입 경로
            </h2>
            <div className="space-y-2">
              {stats.topReferrers.map((r, i) => (
                <div key={r.referrer} className="flex items-center justify-between py-1.5 border-b border-stone-50">
                  <span className="text-base text-stone-700 truncate max-w-[80%]">{r.referrer}</span>
                  <span className="text-sm font-medium text-stone-900 shrink-0 ml-2">{Number(r.count).toLocaleString()}</span>
                </div>
              ))}
              {stats.topReferrers.length === 0 && <p className="text-stone-400 text-base">아직 데이터가 없습니다</p>}
            </div>
          </div>

          {/* 국가별 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Globe size={18} className="text-stone-500" />
              국가별 방문
            </h2>
            <div className="space-y-2">
              {stats.countries.map((c) => (
                <div key={c.country} className="flex items-center justify-between py-1.5 border-b border-stone-50">
                  <span className="text-base text-stone-700">{c.country}</span>
                  <span className="text-sm font-medium text-stone-900">{Number(c.count).toLocaleString()}</span>
                </div>
              ))}
              {stats.countries.length === 0 && <p className="text-stone-400 text-base">아직 데이터가 없습니다</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
