"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Heart, Zap, Lock, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/store/AuthProvider";
import { swipeApi, SwipeUser, SwipeQuota } from "@/lib/api";

interface HomeData {
  feedTotal: number;
  matchTotal: number;
  quota: SwipeQuota | null;
  recentMatches: { _id: string; target: SwipeUser }[];
  likes: { _id: string; user: SwipeUser }[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

function resolveAvatar(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function Avatar({ user, size = 40 }: { user: SwipeUser; size?: number }) {
  const letter = (user.name ?? user.username ?? "?").charAt(0).toUpperCase();
  const src = resolveAvatar(user.avatar);
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center text-white font-bold shrink-0"
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #e8415a, #9b59ff)",
        fontSize: size * 0.35,
      }}
    >
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={user.name} className="w-full h-full object-cover" />
        : letter}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name ?? user?.phone ?? "Хэрэглэгч";

  useEffect(() => {
    Promise.allSettled([
      swipeApi.getFeedSingle(),
      swipeApi.getMatches(),
      swipeApi.getLikes(),
    ]).then(([feedRes, matchRes, likesRes]) => {
      setData({
        feedTotal: feedRes.status === "fulfilled" ? feedRes.value.total : 0,
        matchTotal: matchRes.status === "fulfilled" ? matchRes.value.total : 0,
        quota: feedRes.status === "fulfilled" ? feedRes.value.quota : null,
        recentMatches: matchRes.status === "fulfilled" ? matchRes.value.data : [],
        likes: likesRes.status === "fulfilled" ? likesRes.value.data : [],
      });
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Шинэ профайл", value: data?.feedTotal ?? "—", color: "#e8415a" },
    { label: "Match", value: data?.matchTotal ?? "—", color: "#e8415a" },
    { label: "Swipe үлдсэн", value: data?.quota ? data.quota.remaining : "—", color: "#a06de0" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-[#c8254a]" />
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto">

      <div className="pointer-events-none fixed top-16 right-0 w-[500px] h-[500px] rounded-full opacity-40 animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(200,37,74,0.16) 0%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-20 left-[160px] w-[400px] h-[400px] rounded-full opacity-30 animate-orb-drift-rev"
        style={{ background: "radial-gradient(circle, rgba(139,79,212,0.13) 0%, transparent 70%)" }} />

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-[28px] font-black font-serif mb-1 leading-tight">
          Сайн байна уу, <span style={{ color: "#e8415a" }}>{displayName}</span> 👋
        </h1>
        {data?.feedTotal != null && (
          <p className="text-text-secondary text-[15px]">
            Таныг хүлээж буй <strong className="text-text-primary">{data.feedTotal} профайл</strong> байна.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s, i) => (
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

      {/* Swipe CTA */}
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
            <div className="text-[13px] text-text-secondary">
              {data?.feedTotal != null ? `${data.feedTotal} профайл хүлээж байна` : "Ачаалж байна..."}
            </div>
          </div>
          <div className="rounded-xl px-5 py-2.5 font-semibold text-white text-[13px] relative z-10 shrink-0"
            style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 16px rgba(200,37,74,0.4)" }}>
            Эхлэх →
          </div>
        </div>
      </Link>

      {/* Daily quota bar */}
      {data?.quota && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border mb-6"
          style={{ background: "rgba(232,65,90,0.07)", border: "1px solid rgba(232,65,90,0.18)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(232,65,90,0.15)", border: "1px solid rgba(232,65,90,0.3)" }}>
            <Flame size={17} strokeWidth={1.8} style={{ color: "#e8415a" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[13px] font-semibold text-white">
                Өнөөдрийн swipe: {data.quota.used} / {data.quota.limit}
              </span>
              <span className="text-[12px] text-text-muted">{data.quota.remaining} үлдсэн</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (data.quota.used / data.quota.limit) * 100)}%`,
                  background: "linear-gradient(90deg, #e8415a, #9e1838)",
                }} />
            </div>
          </div>
        </div>
      )}

      {/* Recent matches */}
      {(data?.recentMatches ?? []).length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
              <Heart size={18} className="text-[#e8415a]" /> Сүүлийн match
            </h2>
            <Link href="/chat" className="text-[13px] text-[#e8415a] hover:underline">Бүгдийг харах</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
            {data!.recentMatches.map(m => (
              <Link key={m._id} href="/chat" className="no-underline shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <Avatar user={m.target} size={56} />
                    {m.target.isOnline && (
                      <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-bg-primary" />
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted max-w-[56px] truncate text-center">
                    {m.target.name ?? m.target.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Who liked me */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
            <Heart size={18} className="text-[#e8415a]" /> Танд таалагдсан
          </h2>
          <Link href="/likes" className="text-[13px] text-[#e8415a] hover:underline">Бүгдийг харах</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
          {data?.likes.length === 0 && (
            <p className="text-[13px] text-text-muted py-2">Одоохондоо хэнч таалагдаагүй байна</p>
          )}
          {(data?.likes ?? []).map(l => (
            <div key={l._id} className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/[0.05]">
              {resolveAvatar(l.user.avatar) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveAvatar(l.user.avatar)!} alt={l.user.name} className="w-full h-full object-cover blur-md opacity-60" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[22px] font-black text-white/30"
                  style={{ background: "linear-gradient(135deg,rgba(232,65,90,0.2),rgba(155,89,255,0.2))" }}>
                  {(l.user.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock size={16} className="text-white/70" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-4">
        <h2 className="text-[17px] font-bold text-white flex items-center gap-2 mb-4">
          <Zap size={18} className="text-[#a06de0]" /> Шуурхай үйлдэл
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/roleplay" className="p-4 rounded-2xl border border-white/[0.05] bg-bg-secondary hover:bg-bg-elevated transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[rgba(139,79,212,0.15)] flex items-center justify-center border border-[#8b4fd4]/30">
              <span className="text-xl">🎭</span>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Roleplay</div>
              <div className="text-[11px] text-text-muted">Дүрд хувирах</div>
            </div>
          </Link>
          <Link href="/forum" className="p-4 rounded-2xl border border-white/[0.05] bg-bg-secondary hover:bg-bg-elevated transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[rgba(232,65,90,0.15)] flex items-center justify-center border border-[#e8415a]/30">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Forum</div>
              <div className="text-[11px] text-text-muted">Нууц хэлэлцүүлэг</div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
