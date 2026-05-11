"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    img: "/banner1.jpg",
    name: "Oyunaa", age: 25, match: 94,
    quote: "Жинхэнэ холболтыг хайж байна...",
    interests: ["Хөгжим", "Аялал", "Кино"],
    dotColor: "#e04878",
  },
  {
    img: "/banner2.jpg",
    name: "Enkhjin", age: 23, match: 88,
    quote: "Roleplay-д хамтрагч хайж байна",
    interests: ["Уран зохиол", "Roleplay", "Кафе"],
    dotColor: "#9b59ff",
  },
  {
    img: "/banner3.jpg",
    name: "Suvd", age: 27, match: 91,
    quote: "Нууцлалтай танилцахыг хүсч байна",
    interests: ["Кафе", "Кино", "Спорт"],
    dotColor: "#e8b850",
  },
];

export default function AuthBanner() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length);
        setAnimating(false);
      }, 350);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[idx];

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* Background images */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.img}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <Image
            src={slide.img}
            alt=""
            fill
            className="object-cover"
            style={{ filter: "blur(5px)", transform: "scale(1.08)" }}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3"
        style={{ background: "linear-gradient(to top, rgba(4,2,8,0.95) 0%, transparent 100%)" }} />

      {/* ── MOBILE layout ── */}
      <div className="md:hidden absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif" }}
            >С</div>
            <span className="text-sm font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
          </div>
        </div>

        <div className={`transition-all duration-350 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif font-black text-white text-2xl leading-none">{s.name}</span>
            <span className="text-white/50 text-base">{s.age}</span>
          </div>
          <p className="text-white/65 text-[12px] italic leading-snug line-clamp-1" style={{ fontFamily: "Playfair Display, serif" }}>
            &ldquo;{s.quote}&rdquo;
          </p>
        </div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden md:flex absolute inset-0 flex-col px-10 py-12">
        <div className="flex items-center gap-2.5 mb-auto">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif", boxShadow: "0 4px 20px rgba(200,48,90,0.4)" }}
          >С</div>
          <span className="text-lg font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
        </div>

        <div className={`mb-8 transition-all duration-350 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 text-[11px] font-bold"
            style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${s.dotColor}40`, color: s.dotColor, backdropFilter: "blur(8px)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.dotColor }} />
            {s.match}% нийцтэй
          </div>

          <div className="flex items-baseline gap-2.5 mb-3">
            <h3 className="font-serif font-black text-white leading-none text-4xl">{s.name}</h3>
            <span className="text-white/50 text-xl font-light">{s.age}</span>
          </div>

          <p className="text-white/70 leading-relaxed mb-5 text-[15px] italic" style={{ fontFamily: "Playfair Display, serif" }}>
            &ldquo;{s.quote}&rdquo;
          </p>

          <div className="flex gap-2 flex-wrap">
            {s.interests.map(t => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-white/65"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.08]" />
      </div>
    </div>
  );
}
