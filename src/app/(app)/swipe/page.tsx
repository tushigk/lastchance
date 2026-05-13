"use client";
import { useState, useEffect, useRef } from "react";
import { X, Heart, Star, MapPin, Zap, Loader2 } from "lucide-react";
import { swipeApi, SwipeUser, SwipeQuota, MatchResult } from "@/lib/api";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";
const GENDERS: Record<string, string> = { male: "Эрэгтэй", female: "Эмэгтэй", other: "Бусад" };

function resolveAvatar(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function avatarLetter(u: SwipeUser) {
  return (u.name ?? u.username ?? "?")[0].toUpperCase();
}

export default function SwipePage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<SwipeUser[]>([]);
  const [quota, setQuota] = useState<SwipeQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);
  const fetchingMore = useRef(false);

  async function loadFeed(reset = false) {
    if (fetchingMore.current) return;
    fetchingMore.current = true;
    try {
      const p = reset ? 1 : pageRef.current;
      const res = await swipeApi.getFeed(p, 10);
      pageRef.current = res.page + 1;
      totalPagesRef.current = res.totalPages;
      setQuota(res.quota);
      setCards(prev => reset ? res.data : [...prev, ...res.data]);
    } catch {
      setError("Хэрэглэгчдийг ачаалахад алдаа гарлаа");
    } finally {
      fetchingMore.current = false;
      setLoading(false);
    }
  }

  useEffect(() => { loadFeed(true); }, []);

  async function swipe(dir: "left" | "right") {
    if (swiping || cards.length === 0) return;
    const top = cards[0];
    setSwiping(true);
    setSwipeDir(dir);

    await new Promise(r => setTimeout(r, 420));

    try {
      const res = await swipeApi.performSwipe(top._id, dir === "right" ? "like" : "pass");
      setQuota(res.quota);
      if (res.isNewMatch && res.match) {
        setMatchResult(res.match);
      }
    } catch {
      // quota may be exhausted, keep going
    }

    setCards(prev => prev.slice(1));
    setSwipeDir(null);
    setSwiping(false);

    // prefetch next page when running low
    if (cards.length <= 3 && pageRef.current <= totalPagesRef.current) {
      loadFeed(false);
    }
  }

  const top = cards[0];
  const next = cards[1];

  return (
    <div className="max-w-[480px] mx-auto flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-[22px] font-bold">Танилц</h1>
          <p className="text-text-muted text-[12px]">AI-ийн санал болгосон хүмүүс</p>
        </div>
        {quota && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(232,65,90,0.1)", border: "1px solid rgba(232,65,90,0.25)", color: "#e8415a" }}>
            <Zap size={11} strokeWidth={2.5} />
            {quota.remaining} үлдсэн
          </div>
        )}
      </div>

      {/* Match modal */}
      {matchResult && (
        <>
          <style>{`
            @keyframes matchModalIn { from { opacity:0; transform:scale(0.75) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }
            @keyframes matchAvatarPop { 0% { opacity:0; transform:scale(0) rotate(-12deg); } 65% { transform:scale(1.12) rotate(3deg); opacity:1; } 100% { transform:scale(1) rotate(0deg); opacity:1; } }
            @keyframes matchRingPulse { 0% { transform:scale(1); opacity:0.7; } 100% { transform:scale(2.8); opacity:0; } }
            @keyframes matchHeartBeat { 0%,100% { transform:scale(1); } 30% { transform:scale(1.25); } 60% { transform:scale(0.92); } 80% { transform:scale(1.1); } }
            @keyframes matchHeartFloat { 0% { opacity:0; transform:translateY(0) scale(0.6) rotate(var(--r)); } 15% { opacity:1; } 85% { opacity:0.5; } 100% { opacity:0; transform:translateY(-220px) scale(1.2) rotate(var(--r)); } }
            @keyframes matchTextUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          `}</style>

          <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-[14px] p-5 overflow-hidden"
            style={{ background: "rgba(4,2,10,0.88)" }}>

            {[
              { l: "8%", d: 0, r: "-15deg", dur: 2.8 }, { l: "20%", d: 0.4, r: "10deg", dur: 3.1 },
              { l: "35%", d: 0.15, r: "-5deg", dur: 2.5 }, { l: "50%", d: 0.6, r: "20deg", dur: 3.3 },
              { l: "63%", d: 0.25, r: "-12deg", dur: 2.7 }, { l: "77%", d: 0.5, r: "8deg", dur: 3.0 },
              { l: "88%", d: 0.1, r: "-20deg", dur: 2.9 },
            ].map((h, i) => (
              <div key={i} className="absolute bottom-[12%] text-[20px] pointer-events-none select-none"
                style={{ left: h.l, ["--r" as string]: h.r, animation: `matchHeartFloat ${h.dur}s ease-out ${h.d}s infinite` }}>❤️</div>
            ))}

            <div className="rounded-[32px] px-8 py-10 text-center w-full max-w-[340px] relative z-10"
              style={{ background: "rgba(10,6,22,0.98)", border: "1px solid rgba(232,65,90,0.28)", boxShadow: "0 0 80px rgba(200,37,74,0.22), 0 24px 60px rgba(0,0,0,0.6)", animation: "matchModalIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>

              <div className="flex items-center justify-center gap-3 mb-7">
                {/* My avatar */}
                <div className="w-[66px] h-[66px] rounded-full overflow-hidden flex items-center justify-center text-[26px] font-black text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 24px rgba(200,37,74,0.55)", animation: "matchAvatarPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}>
                  {user?.avatar
                    ? <img src={resolveAvatar(user.avatar)!} className="w-full h-full object-cover" alt="" />
                    : (user?.name ?? "М")[0].toUpperCase()}
                </div>

                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full" style={{ background: "rgba(232,65,90,0.35)", animation: "matchRingPulse 1.3s ease-out 0.6s infinite" }} />
                  <div className="absolute inset-0 rounded-full" style={{ background: "rgba(232,65,90,0.2)", animation: "matchRingPulse 1.3s ease-out 0.9s infinite" }} />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                    style={{ background: "linear-gradient(135deg, #e8415a, #e8b850)", boxShadow: "0 0 24px rgba(232,65,90,0.8)", animation: "matchHeartBeat 1.1s ease-in-out 0.7s infinite" }}>
                    <Heart size={17} fill="white" strokeWidth={0} />
                  </div>
                </div>

                {/* Match avatar */}
                <div className="w-[66px] h-[66px] rounded-full overflow-hidden flex items-center justify-center text-[26px] font-black text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", boxShadow: "0 4px 24px rgba(200,37,74,0.4)", animation: "matchAvatarPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both" }}>
                  {matchResult.target.avatar
                    ? <img src={resolveAvatar(matchResult.target.avatar)!} className="w-full h-full object-cover" alt="" />
                    : avatarLetter(matchResult.target)}
                </div>
              </div>

              <h2 className="font-serif text-[28px] font-black mb-2" style={{ color: "#e8415a", animation: "matchTextUp 0.45s ease-out 0.45s both" }}>
                Match болсон!
              </h2>
              <p className="text-text-secondary text-[14px] mb-7 leading-relaxed" style={{ animation: "matchTextUp 0.45s ease-out 0.6s both" }}>
                Та болон <strong className="text-white">{matchResult.target.name ?? matchResult.target.username}</strong> хоёр бие биедээ таалагдсан байна.
              </p>
              <div className="flex gap-2.5" style={{ animation: "matchTextUp 0.45s ease-out 0.8s both" }}>
                <button onClick={() => setMatchResult(null)}
                  className="flex-1 py-3 rounded-[14px] text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Үргэлжлүүлэх
                </button>
                <button onClick={() => setMatchResult(null)}
                  className="flex-1 py-3 rounded-[14px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 20px rgba(200,37,74,0.4)" }}>
                  Мессеж
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center" style={{ height: "clamp(420px, 62vh, 560px)" }}>
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center" style={{ height: "clamp(420px, 62vh, 560px)" }}>
          <p className="text-[#e8415a] text-sm">{error}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 text-center" style={{ height: "clamp(420px, 62vh, 560px)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-[28px]"
            style={{ background: "rgba(232,65,90,0.08)", border: "1px solid rgba(232,65,90,0.2)" }}>🎉</div>
          <p className="font-serif text-[18px] font-bold">Дууссан!</p>
          <p className="text-text-muted text-sm">Өнөөдрийн хэрэглэгчдийг харлаа. Маргааш дахин ир!</p>
        </div>
      ) : (
        /* Card stack */
        <div className="relative mb-5" style={{ height: "clamp(420px, 62vh, 560px)" }}>

          {/* Back card (next) */}
          {next && (
            <div className="absolute inset-0 rounded-[28px] overflow-hidden"
              style={{
                transform: "scale(0.93) translateY(20px)",
                transformOrigin: "bottom center",
                background: "linear-gradient(160deg, #1a0a18 0%, #0a0408 100%)",
                zIndex: 1,
              }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-[36px] font-black text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #6b1528, #2a0814)" }}>
                  {next.avatar
                    ? <img src={resolveAvatar(next.avatar)!} className="w-full h-full object-cover" alt="" />
                    : avatarLetter(next)}
                </div>
              </div>
            </div>
          )}

          {/* Front card */}
          {top && (
            <div className="absolute inset-0 rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                zIndex: 2,
                background: "linear-gradient(160deg, #6b1528 0%, #2a0814 60%, #0d0408 100%)",
                transform: swipeDir === "left"
                  ? "translateX(-150%) rotate(-20deg)"
                  : swipeDir === "right"
                    ? "translateX(150%) rotate(20deg)"
                    : "none",
                transition: swipeDir ? "transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}>

              <div className="absolute top-0 left-0 right-0 h-[65%] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(220,80,100,0.2) 0%, transparent 65%)" }} />

              {/* Avatar */}
              <div className="absolute top-0 left-0 right-0 h-[62%] flex items-center justify-center">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-[52px] font-black text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #c22d50, #7a0f20)", boxShadow: "0 0 0 4px rgba(255,255,255,0.08), 0 8px 40px rgba(220,80,100,0.25)" }}>
                  {top.avatar
                    ? <img src={resolveAvatar(top.avatar)!} className="w-full h-full object-cover" alt="" />
                    : avatarLetter(top)}
                </div>
              </div>

              {/* Online badge */}
              {top.isOnline && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-[10px]"
                  style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(60,200,120,0.3)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3cc878]" />
                  <span className="text-[11px] font-medium text-[#3cc878]">Онлайн</span>
                </div>
              )}

              {/* Swipe stamps */}
              {swipeDir === "left" && (
                <div className="absolute top-6 left-5 px-4 py-1.5 rounded-xl rotate-[-12deg]"
                  style={{ background: "rgba(200,37,74,0.85)", border: "2px solid rgba(232,65,90,0.8)" }}>
                  <span className="font-black text-[18px] text-white tracking-widest">ҮГҮЙ</span>
                </div>
              )}
              {swipeDir === "right" && (
                <div className="absolute top-6 right-5 px-4 py-1.5 rounded-xl rotate-[12deg]"
                  style={{ background: "rgba(30,140,70,0.85)", border: "2px solid rgba(60,200,120,0.8)" }}>
                  <span className="font-black text-[18px] text-white tracking-widest">ТИЙМ</span>
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-6"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)" }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="font-serif text-[26px] font-black text-white leading-none">
                    {top.name ?? top.username}
                  </h2>
                  {top.age && <span className="text-[18px] text-white/60 font-light">{top.age}</span>}
                  {top.gender && <span className="text-[12px] text-white/40">{GENDERS[top.gender] ?? top.gender}</span>}
                </div>
                {top.isOnline !== undefined && (
                  <div className="flex items-center gap-1 text-white/50 text-[12px] mb-3">
                    <MapPin size={11} strokeWidth={2} />
                    <span>Улаанбаатар</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!loading && cards.length > 0 && (
        <div className="flex items-center justify-center gap-6 pb-4">
          <button onClick={() => swipe("left")} disabled={swiping || quota?.remaining === 0}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(232,65,90,0.1)", border: "1.5px solid rgba(232,65,90,0.35)", boxShadow: "0 4px 16px rgba(232,65,90,0.15)" }}>
            <X size={22} strokeWidth={2.5} style={{ color: "#e8415a" }} />
          </button>

          <button onClick={() => swipe("right")} disabled={swiping || quota?.remaining === 0}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 6px 30px rgba(200,37,74,0.55)" }}>
            {swiping
              ? <Loader2 size={26} className="animate-spin text-white" />
              : <Heart size={30} fill="white" strokeWidth={0} />}
          </button>

          <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: "rgba(232,184,80,0.1)", border: "1.5px solid rgba(232,184,80,0.35)", boxShadow: "0 4px 16px rgba(232,184,80,0.15)" }}>
            <Star size={22} strokeWidth={2} style={{ color: "#e8b850" }} />
          </button>
        </div>
      )}

      {/* Quota exhausted */}
      {quota?.remaining === 0 && !loading && (
        <p className="text-center text-[13px] text-[#e8415a] pb-4">Өнөөдрийн swipe дууссан. Маргааш дахин ир!</p>
      )}
    </div>
  );
}
