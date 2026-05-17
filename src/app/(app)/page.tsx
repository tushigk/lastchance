"use client";
import useSWR from "swr";
import { Film, Flame, Heart, Zap, Lock, Loader2, CheckCircle, ChevronRight, MessageSquare, Play, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/store/AuthProvider";
import { swipeApi, SwipeUser, SwipeQuota, movieApi, Movie } from "@/apis";

interface HomeData {
  feedTotal: number;
  matchTotal: number;
  quota: SwipeQuota | null;
  recentMatches: { _id: string; target: SwipeUser }[];
  likes: { _id: string; user: SwipeUser }[];
  movies: Movie[];
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
      className="rounded-full overflow-hidden flex items-center justify-center text-white font-bold shrink-0 border border-white/10"
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #e8415a, #9b59ff)",
        fontSize: size * 0.35,
        boxShadow: "0 4px 12px rgba(232,65,90,0.2)",
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

  const { data, isLoading } = useSWR<HomeData>("home-dashboard", async () => {
    const [feedRes, matchRes, likesRes, moviesRes] = await Promise.all([
      swipeApi.getFeedSingle(),
      swipeApi.getMatches(),
      swipeApi.getLikes(),
      movieApi.list(1, 10),
    ]);
    return {
      feedTotal: feedRes.total,
      matchTotal: matchRes.total,
      quota: feedRes.quota,
      recentMatches: matchRes.data,
      likes: likesRes.data,
      movies: moviesRes.data,
    };
  });

  const displayName = user?.name ?? user?.phone ?? "Хэрэглэгч";

  const stats = [
    { label: "Шинэ профайл", value: data?.feedTotal ?? "—", color: "#e8415a", icon: Users },
    { label: "Match", value: data?.matchTotal ?? "—", color: "#e8415a", icon: Heart },
    { label: "Swipe үлдсэн", value: data?.quota ? data.quota.remaining : "—", color: "#a06de0", icon: Zap },
  ];

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-[#e8415a] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={16} className="text-[#e8415a]" fill="currentColor" />
          </div>
        </div>
        <p className="text-text-muted text-sm font-medium animate-pulse">Ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto pb-10">
      {/* Dynamic Background */}
      <div className="pointer-events-none fixed top-16 right-0 w-[500px] h-[500px] rounded-full opacity-30 animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(232,65,90,0.12) 0%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-20 left-[160px] w-[400px] h-[400px] rounded-full opacity-20 animate-orb-drift-rev"
        style={{ background: "radial-gradient(circle, rgba(139,79,212,0.1) 0%, transparent 70%)" }} />

      {/* Hero Greeting */}
      <div className="mb-10 pt-4">
        <h1 className="text-[32px] font-black font-serif mb-2 leading-tight tracking-tight">
          Сайн байна уу, <span className="text-[#e8415a]">{displayName}</span> 👋
        </h1>
        {data?.feedTotal != null && (
          <p className="text-text-secondary text-[16px] font-medium opacity-80">
            Өнөөдөр таныг <strong className="text-white">{data.feedTotal} шинэ хүн</strong> хүлээж байна.
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="group rounded-[24px] p-5 text-center border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${s.color}08 0%, rgba(7,5,15,0.4) 100%)`,
                border: `1px solid ${s.color}15`,
              }}>
              <div className="flex justify-center mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.05] group-hover:scale-110 transition-transform">
                  <Icon size={14} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-[28px] font-black font-serif leading-none mb-1.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-text-muted font-bold uppercase tracking-widest opacity-60">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Primary Action - Swipe CTA */}
      <Link href="/swipe" className="block mb-8 group no-underline">
        <div className="rounded-[28px] px-8 py-7 flex items-center justify-between relative overflow-hidden border transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(232,65,90,0.25)] group-hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg, rgba(232,65,90,0.15) 0%, rgba(158,24,56,0.05) 100%)",
            border: "1px solid rgba(232,65,90,0.25)",
          }}>
          <div className="absolute right-0 top-0 w-64 h-64 pointer-events-none opacity-40 group-hover:scale-110 transition-transform duration-1000"
            style={{ background: "radial-gradient(circle at 75% 25%, rgba(232,65,90,0.2) 0%, transparent 65%)" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="px-2 py-0.5 rounded bg-[#e8415a] text-white text-[10px] font-black uppercase tracking-widest">DISCOVER</div>
              <h3 className="font-serif font-black text-[22px] text-white">Шинэ хүнтэй танилцах</h3>
            </div>
            <div className="text-[14px] text-text-secondary font-medium opacity-80">
              {data?.feedTotal != null ? `Танд таалагдах ${data.feedTotal} хүн байна` : "Танд зориулсан шинэ хүмүүс"}
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#e8415a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(232,65,90,0.4)] relative z-10 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <ChevronRight size={28} strokeWidth={3} />
          </div>
        </div>
      </Link>

      {/* Quota Bar */}
      {data?.quota && (
        <div className="px-6 py-5 rounded-[24px] border border-white/[0.05] bg-white/[0.02] mb-10">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-[#e8415a]" fill="#e8415a" />
                <span className="text-[14px] font-bold text-white">Өнөөдрийн эрх</span>
              </div>
              <p className="text-[12px] text-text-muted">Таны өдөрт ашиглах swipe-ийн хязгаар</p>
            </div>
            <div className="text-right">
              <span className="text-[18px] font-black text-[#e8415a]">{data.quota.remaining}</span>
              <span className="text-[12px] text-text-muted font-bold ml-1">ҮЛДСЭН</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(232,65,90,0.4)]"
              style={{
                width: `${Math.min(100, (data.quota.used / data.quota.limit) * 100)}%`,
                background: "linear-gradient(90deg, #e8415a, #9e1838)",
              }} />
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Matches */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-black text-white font-serif flex items-center gap-2">
              <Heart size={18} className="text-[#e8415a]" fill="#e8415a" /> Шинэ Match
            </h2>
            <Link href="/chat" className="text-[13px] font-bold text-[#e8415a] hover:underline">Бүгд</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {(data?.recentMatches ?? []).length > 0 ? (
              data!.recentMatches.map(m => (
                <Link key={m._id} href="/chat" className="group no-underline shrink-0 flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar user={m.target} size={64} />
                    {m.target.isOnline && (
                      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-bg-primary animate-pulse shadow-lg" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-text-secondary group-hover:text-white transition-colors truncate max-w-[64px]">
                    {m.target.name ?? m.target.username}
                  </span>
                </Link>
              ))
            ) : (
              <div className="w-full py-6 px-4 rounded-3xl border border-white/[0.05] bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-text-muted">
                <Heart size={24} strokeWidth={1} />
                <p className="text-[12px]">Одоогоор match байхгүй</p>
              </div>
            )}
          </div>
        </section>

        {/* Likes */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-black text-white font-serif flex items-center gap-2">
              <Zap size={18} className="text-[#a06de0]" fill="#a06de0" /> Танд таалагдсан
            </h2>
            <Link href="/likes" className="text-[13px] font-bold text-[#e8415a] hover:underline">Бүгд</Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(data?.likes ?? []).length > 0 ? (
              data!.likes.map(l => (
                <div key={l._id} className="relative w-[70px] h-[85px] rounded-2xl overflow-hidden shrink-0 border border-white/[0.08] shadow-lg group">
                  {resolveAvatar(l.user.avatar) ? (
                    <img src={resolveAvatar(l.user.avatar)!} alt={l.user.name} className="w-full h-full object-cover blur-sm opacity-50 transition-all group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[22px] font-black text-white/20"
                      style={{ background: "linear-gradient(135deg,rgba(232,65,90,0.1),rgba(155,89,255,0.1))" }}>
                      {(l.user.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Lock size={16} className="text-white/60" />
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-6 px-4 rounded-3xl border border-white/[0.05] bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-text-muted">
                <Zap size={24} strokeWidth={1} />
                <p className="text-[12px]">Хэн нэгэнд лайк дарж эхлээрэй</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Quick Access Menu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Roleplay", href: "/roleplay", icon: Play, emoji: "🎭", color: "#a06de0", bg: "rgba(160,109,224,0.1)" },
          { label: "Forum", href: "/forum", icon: MessageSquare, emoji: "💬", color: "#e8415a", bg: "rgba(232,65,90,0.1)" },
          { label: "Games", href: "/games", icon: Zap, emoji: "🎮", color: "#3cc878", bg: "rgba(60,200,120,0.1)" },
          { label: "Chat", href: "/chat", icon: MessageSquare, emoji: "📨", color: "#3c9be8", bg: "rgba(60,155,232,0.1)" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} href={item.href} className="no-underline group">
              <div className="p-5 rounded-[24px] border border-white/[0.05] bg-white/[0.02] flex flex-col items-center text-center gap-3 transition-all duration-300 group-hover:bg-white/[0.04] group-hover:border-white/[0.1] group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110"
                  style={{ background: item.bg, border: `1px solid ${item.color}30` }}>
                  <span>{item.emoji}</span>
                </div>
                <span className="text-[14px] font-bold text-text-secondary group-hover:text-white transition-colors">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Featured Movies Section */}
      {(data?.movies ?? []).length > 0 && (
        <div className="mb-12 pt-6 border-t border-white/[0.05]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8415a]/10 border border-[#e8415a]/20 flex items-center justify-center">
                <Film size={20} className="text-[#e8415a]" />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-white font-serif tracking-tight">Онцлох бичлэг</h2>
                <p className="text-[12px] text-text-muted">Танд зориулсан шинэ контент</p>
              </div>
            </div>
            <Link href="/movies" className="px-4 py-2 rounded-xl bg-white/[0.05] text-[13px] font-bold text-white hover:bg-white/[0.1] transition-all flex items-center gap-2">
              Бүгдийг үзэх <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-6 -mx-1 px-1 scrollbar-hide">
            {data!.movies.map(m => <HomeMovieCard key={m._id} movie={m} />)}
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes orb-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes orb-drift-rev {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        .animate-orb-drift { animation: orb-drift 10s infinite ease-in-out; }
        .animate-orb-drift-rev { animation: orb-drift-rev 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

const BASE_URL_MOVIE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";
function resolveMovieImg(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL_MOVIE}${url}`;
}

function HomeMovieCard({ movie }: { movie: Movie }) {
  const img = resolveMovieImg(movie.image?.url);
  const isOwned = movie.owned;

  return (
    <Link href="/movies" className="no-underline shrink-0 block group">
      <div className="relative w-[150px] rounded-[24px] overflow-hidden border border-white/[0.06] bg-bg-elevated cursor-pointer transition-all duration-[400ms] group-hover:border-[rgba(232,65,90,0.3)] group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:-translate-y-1">
        <div className="aspect-[3/4.2] relative overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={movie.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isOwned ? "blur-[10px] scale-110 opacity-70" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-card">
              <Film size={36} className="text-white/10" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90" />

          {/* Lock/Price Overlay */}
          {!isOwned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center mb-2 shadow-2xl group-hover:scale-110 transition-transform">
                <Lock size={15} className="text-white" />
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#e8415a] text-white text-[10px] font-black shadow-[0_4px_12px_rgba(232,65,90,0.4)]">
                ₮{movie.effectivePrice.toLocaleString()}
              </div>
            </div>
          )}

          {/* Owned Status */}
          {isOwned && (
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#3cc878]/90 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
              <CheckCircle size={14} strokeWidth={3} className="text-white" />
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex gap-1">
              {movie.genres.slice(0, 1).map(g => (
                <span key={g} className="px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[8px] font-black text-white/80 border border-white/10 uppercase tracking-wider">{g}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="text-[13px] font-black text-text-primary truncate leading-tight group-hover:text-[#e8415a] transition-colors">{movie.title}</p>
          <div className="flex items-center justify-between mt-1 opacity-60">
            <p className="text-[10px] text-text-muted font-bold truncate">НЭЭЛТТЭЙ ҮЗЭХ</p>
            <ChevronRight size={12} className="text-text-muted group-hover:text-[#e8415a] transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}


