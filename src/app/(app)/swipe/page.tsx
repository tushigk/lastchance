"use client";
import { useState } from "react";
import { Cpu, X, Heart, Star, MapPin } from "lucide-react";

const PROFILES = [
  { name: "Oyunaa", age: 25, city: "Улаанбаатар", bio: "Хөгжим, аялал дуртай. Жинхэнэ яриа хайж байна.", interests: ["Хөгжим", "Аялал", "Кино"], match: 94,
    gradientA: "#6b1528", gradientB: "#2a0814", skinGlow: "rgba(220,150,130,0.1)" },
  { name: "Tsetseg", age: 23, city: "Дархан", bio: "Уран зохиол болон roleplay-д дуртай. Дуртай дүрүүдийн тухай ярих хамтрагч хайж байна.", interests: ["Уран зохиол", "Roleplay", "Кафе"], match: 88,
    gradientA: "#3a1060", gradientB: "#120820", skinGlow: "rgba(180,150,220,0.1)" },
  { name: "Narantsetseg", age: 28, city: "Улаанбаатар", bio: "Нийслэлд амьдардаг, кино, хооллохыг дуртай. Инээмсэглэл чухал!", interests: ["Кино", "Хоол", "Спорт"], match: 81,
    gradientA: "#5a3010", gradientB: "#1a0c08", skinGlow: "rgba(220,180,120,0.1)" },
  { name: "Enkhjargal", age: 24, city: "Эрдэнэт", bio: "IT мэргэжилтэй, тоглоом болон аниме дуртай. Хамт тоглох хүн хайж байна.", interests: ["Тоглоом", "Аниме", "Технологи"], match: 76,
    gradientA: "#0e4028", gradientB: "#040e0a", skinGlow: "rgba(140,210,170,0.09)" },
];

export default function SwipePage() {
  const [cardIdx, setCardIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<null | "left" | "right">(null);
  const [matched, setMatched] = useState(false);

  const profile = PROFILES[cardIdx % PROFILES.length];
  const nextProfile = PROFILES[(cardIdx + 1) % PROFILES.length];

  const swipe = (dir: "left" | "right") => {
    if (swipeDir) return;
    setSwipeDir(dir);
    if (dir === "right" && Math.random() > 0.4) {
      setTimeout(() => { setMatched(true); setSwipeDir(null); }, 420);
    } else {
      setTimeout(() => { setCardIdx(i => i + 1); setSwipeDir(null); }, 420);
    }
  };

  return (
    <div className="max-w-[680px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[24px] font-bold tracking-[-0.02em]">Танилц</h1>
          <p className="text-text-secondary text-[13px] mt-0.5">AI-ийн санал болгосон хүмүүс</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.04em] uppercase bg-[rgba(158,24,56,0.12)] text-accent-light border border-[rgba(158,24,56,0.2)]">
            {PROFILES.length * 3} хүлээж байна
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.04em] uppercase bg-[rgba(90,31,138,0.12)] text-accent-purple border border-[rgba(90,31,138,0.2)]">
            <Cpu size={11} strokeWidth={1.8} /> AI Match
          </span>
        </div>
      </div>

      {/* Match modal */}
      {matched && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-[10px]">
          <div className="backdrop-blur-[28px] border rounded-[28px] px-10 py-12 text-center max-w-[340px] w-[90%] animate-fade-up bg-[rgba(12,8,25,0.95)] border-[rgba(158,24,56,0.4)] shadow-[0_0_0_1px_rgba(158,24,56,0.07),0_0_50px_rgba(158,24,56,0.18)]">
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center animate-heartbeat bg-[linear-gradient(135deg,#b82040,#6e0f22)] shadow-[0_8px_32px_rgba(158,24,56,0.4)]">
              <Heart size={28} fill="white" strokeWidth={0} />
            </div>
            <h2 className="font-serif text-[28px] font-black mb-2">
              <span className="bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent">Match болсон!</span>
            </h2>
            <p className="text-text-secondary mb-8 text-[14px]">
              Та болон <strong className="text-text-primary">{profile.name}</strong> хоёр таалагдсан байна.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => { setMatched(false); setCardIdx(i => i + 1); }}
                className="flex-1 bg-transparent text-text-secondary border border-white/[0.08] rounded-[12px] font-medium text-sm cursor-pointer transition-all duration-200 hover:text-text-primary hover:border-white/[0.15] py-3">
                Үргэлжлүүлэх
              </button>
              <button
                onClick={() => setMatched(false)}
                className="flex-1 text-white border-none rounded-[12px] font-semibold text-sm cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(158,24,56,0.35)] hover:-translate-y-0.5 py-3 bg-[linear-gradient(135deg,#b82040,#6e0f22)]">
                Мессеж илгээх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card stack */}
      <div className="relative h-[560px] mb-8">
        {/* Background card */}
        <div className="absolute w-full h-full z-[1] rounded-[20px] overflow-hidden border border-white/[0.04]"
          style={{
            transform: "scale(0.94) translateY(18px)",
            transformOrigin: "bottom center",
            background: `linear-gradient(165deg, ${nextProfile.gradientA} 0%, ${nextProfile.gradientB} 100%)`,
          }} />

        {/* Front card */}
        <div className="absolute w-full h-full z-[2] rounded-[20px] overflow-hidden border border-white/[0.07] cursor-grab"
          style={{
            transform: swipeDir === "left" ? "translateX(-160%) rotate(-18deg)" : swipeDir === "right" ? "translateX(160%) rotate(18deg)" : "none",
            transition: swipeDir ? "transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
            background: `linear-gradient(165deg, ${profile.gradientA} 0%, ${profile.gradientB} 100%)`,
          }}>

          {/* Photo area — atmospheric gradient placeholder */}
          <div className="relative overflow-hidden h-[60%]">
            {/* Base atmosphere */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(165deg, ${profile.gradientA} 0%, ${profile.gradientB} 100%)`
            }} />
            {/* Warm skin-tone glow suggesting a figure */}
            <div className="absolute inset-0" style={{
              background: `radial-gradient(ellipse at 50% 35%, ${profile.skinGlow} 0%, rgba(255,180,150,0.04) 40%, transparent 70%)`
            }} />
            {/* Color accent glow top-right */}
            <div className="absolute inset-0" style={{
              background: `radial-gradient(ellipse at 70% 15%, ${profile.gradientA}80 0%, transparent 55%)`
            }} />
            {/* Bottom fade into card body */}
            <div className="absolute bottom-0 left-0 right-0 h-[55%]" style={{
              background: `linear-gradient(to top, ${profile.gradientB} 0%, transparent 100%)`
            }} />

            {/* Match badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-[10px] rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/[0.08]">
              <Cpu size={12} strokeWidth={1.8} className="text-green" />
              <span className="text-[12px] font-bold text-green">{profile.match}%</span>
            </div>

            {/* Swipe indicators */}
            {swipeDir === "left" && (
              <div className="absolute top-5 left-5 rounded-[10px] px-4 py-2 border border-[rgba(200,50,70,0.6)] bg-[rgba(158,24,56,0.75)] backdrop-blur-[8px]">
                <span className="font-bold text-base text-white tracking-wide">ҮГҮЙ</span>
              </div>
            )}
            {swipeDir === "right" && (
              <div className="absolute top-5 left-5 rounded-[10px] px-4 py-2 border border-[rgba(30,160,90,0.6)] bg-[rgba(20,120,60,0.75)] backdrop-blur-[8px]">
                <span className="font-bold text-base text-white tracking-wide">ТИЙМ</span>
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="px-6 py-5">
            <div className="flex items-baseline gap-2.5 mb-2">
              <h2 className="font-serif text-[24px] font-bold tracking-[-0.01em]">{profile.name}</h2>
              <span className="text-lg text-text-secondary">{profile.age}</span>
              <span className="text-[12px] text-text-muted flex items-center gap-1">
                <MapPin size={11} strokeWidth={1.8} /> {profile.city}
              </span>
            </div>
            <p className="text-[13px] text-text-secondary mb-4 leading-[1.65]">{profile.bio}</p>
            <div className="flex gap-1.5 flex-wrap">
              {profile.interests.map(t => (
                <span key={t} className="px-2.5 py-[5px] rounded-full text-[11px] font-medium text-text-secondary bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-5 items-center">
        <button onClick={() => swipe("left")}
          className="w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-[180ms] hover:scale-110 bg-[rgba(158,24,56,0.1)] border border-[rgba(158,24,56,0.3)]">
          <X size={20} strokeWidth={2} className="text-accent-light" />
        </button>
        <button onClick={() => swipe("right")}
          className="w-[68px] h-[68px] rounded-full border-none flex items-center justify-center cursor-pointer transition-all duration-[180ms] hover:scale-110 bg-[linear-gradient(135deg,#b82040,#6e0f22)] shadow-[0_8px_32px_rgba(158,24,56,0.45)]">
          <Heart size={26} fill="white" strokeWidth={0} />
        </button>
        <button
          className="w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-[180ms] hover:scale-110 bg-[rgba(154,96,16,0.1)] border border-[rgba(154,96,16,0.3)]">
          <Star size={20} strokeWidth={1.8} className="text-accent-gold-light" />
        </button>
      </div>
    </div>
  );
}
