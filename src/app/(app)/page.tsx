"use client";
import Link from "next/link";
import { Flame } from "lucide-react";

const STATS = [
  { label: "Шинэ профайл", value: "14", color: "#e8415a" },
  { label: "Match", value: "7", color: "#e8415a" },
  { label: "Мессеж", value: "3", color: "#a06de0" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[860px] mx-auto">

      <div className="pointer-events-none fixed top-16 right-0 w-[500px] h-[500px] rounded-full opacity-40 animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(200,37,74,0.16) 0%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-20 left-[160px] w-[400px] h-[400px] rounded-full opacity-30 animate-orb-drift-rev"
        style={{ background: "radial-gradient(circle, rgba(139,79,212,0.13) 0%, transparent 70%)" }} />

      <div className="mb-8">
        <h1 className="text-[28px] font-black font-serif mb-1 leading-tight">
          Сайн байна уу, <span style={{ color: "#e8415a" }}>munkh_22</span> 👋
        </h1>
        <p className="text-text-secondary text-[15px]">Өнөөдөр таныг <strong className="text-text-primary">12 хүн</strong> үзсэн байна.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-2xl px-4 py-4 text-center border"
            style={{
              background: `linear-gradient(135deg, ${s.color}10 0%, rgba(7,5,15,0.85) 100%)`,
              border: `1px solid ${s.color}28`,
            }}>
            <div className="text-[28px] font-black font-serif leading-none mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <Link href="/swipe" className="block mb-6">
        <div className="rounded-2xl px-6 py-5 flex items-center justify-between relative overflow-hidden border transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, rgba(200,37,74,0.18) 0%, rgba(158,24,56,0.1) 100%)",
            border: "1px solid rgba(200,37,74,0.38)",
            boxShadow: "0 8px 32px rgba(200,37,74,0.12)",
          }}>
          <div className="absolute right-0 top-0 w-52 h-52 pointer-events-none"
            style={{ background: "radial-gradient(circle at 75% 25%, rgba(200,37,74,0.14) 0%, transparent 65%)" }} />
          <div className="relative z-10">
            <div className="font-serif font-bold text-[17px] text-white mb-0.5">Шинэ хүнтэй танилцах</div>
            <div className="text-[13px] text-text-secondary">14 профайл хүлээж байна</div>
          </div>
          <div className="rounded-xl px-5 py-2.5 font-semibold text-white text-[13px] relative z-10 shrink-0"
            style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 16px rgba(200,37,74,0.4)" }}>
            Эхлэх →
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border"
        style={{
          background: "rgba(232,65,90,0.07)",
          border: "1px solid rgba(232,65,90,0.18)",
        }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(232,65,90,0.15)", border: "1px solid rgba(232,65,90,0.3)" }}>
          <Flame size={17} strokeWidth={1.8} style={{ color: "#e8415a" }} />
        </div>
        <div className="flex-1">
          <span className="text-[14px] font-semibold text-white">12 өдрийн streak</span>
          <span className="text-[12px] text-text-muted ml-2">— 2 өдрийн дараа онцгой урамшуулал</span>
        </div>
        <Link href="/swipe">
          <button className="text-[12px] font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-[180ms] hover:opacity-80 text-white"
            style={{ background: "rgba(232,65,90,0.2)", border: "1px solid rgba(232,65,90,0.35)" }}>
            Хадгалах
          </button>
        </Link>
      </div>

    </div>
  );
}
