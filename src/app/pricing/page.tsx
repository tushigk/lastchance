"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLANS = [
  {
    id: "standard", name: "Стандарт", price: 29900, period: "сар", badge: "Үндсэн",
    desc: "Roleplay + Forum + Swipe (өдөрт 30) + Тоглоом",
    features: ["Swipe (өдөрт 30 удаа)", "Forum унших & бичих", "Basic roleplay сценари", "Mini-game хандалт", "Chat (өдөрт 10 хүн)"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like", "Exclusive content"],
  },
  {
    id: "premium", name: "Premium", price: 59900, period: "сар", badge: "Хамгийн алдартай",
    desc: "Бүгд + Unlimited swipe + AI companion + Boost x3 + Exclusive content",
    features: ["Хязгааргүй swipe", "AI Roleplay companion", "Boost x3 / сар", "Super-like x5 / өдөр", "Exclusive forum & content", "Хязгааргүй chat", "Нууц forum хэсэг", "VIP badge & тэргүүлэх эрх"],
    missing: [],
  },
  {
    id: "quarterly", name: "Улирлын", price: 39900, period: "3 сар", badge: "Хэмнэлттэй",
    desc: "Стандарт багц — 3 сарын урьдчилан төлөлт (↓10K хэмнэлт)",
    features: ["Стандартын бүх зүйл", "3 сарын урьдчилан төлөлт", "10,000₮ хэмнэлт", "Priority дэмжлэг", "Онцгой streak badge"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like"],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("premium");

  return (
    <div className="min-h-screen px-6 pt-28 pb-16 bg-[radial-gradient(ellipse_at_50%_0%,rgba(158,24,56,0.08)_0%,transparent_60%),var(--bg-primary)]">

      <div className="w-full max-w-[1060px] mx-auto">

        <div className="text-center mb-12">
          <h1 className="font-serif font-black mb-2 text-[clamp(26px,4vw,48px)]">
            Багцаа <span className="bg-[linear-gradient(135deg,#e03060,#9e1838)] bg-clip-text text-transparent">сонгоно уу</span>
          </h1>
          <p className="text-text-secondary text-sm mb-5">QPay / SocialPay · Хэдийд ч цуцлах боломжтой</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(158,24,56,0.1)] text-[#c22d50] border border-[rgba(158,24,56,0.2)]">✓ QPay</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(158,24,56,0.1)] text-[#c22d50] border border-[rgba(158,24,56,0.2)]">✓ SocialPay</span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(290px,1fr))]">
          {PLANS.map(plan => {
            const isSel = selected === plan.id;
            return (
              <div key={plan.id} onClick={() => setSelected(plan.id)}
                className={`rounded-[28px] p-7 cursor-pointer relative transition-all duration-200 ${
                  isSel
                    ? "bg-[rgba(158,24,56,0.08)] border-[1.5px] border-[rgba(200,37,74,0.5)] shadow-[0_0_40px_rgba(158,24,56,0.15)]"
                    : "bg-bg-card border border-[rgba(255,255,255,0.07)]"
                }`}>

                <div className="absolute top-[-12px] right-5">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold text-white ${
                    isSel
                      ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white"
                      : "bg-[rgba(255,255,255,0.08)] text-text-muted"
                  }`}>
                    {plan.badge}
                  </span>
                </div>

                {isSel && (
                  <div className="absolute top-4 left-4 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-[linear-gradient(135deg,#c8254a,#780f20)]">✓</div>
                )}

                <div className="mt-3">
                  <div className="text-xs font-bold text-text-muted tracking-[0.06em] mb-1.5">{plan.name.toUpperCase()}</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className={`text-[36px] font-black font-serif ${isSel ? "text-[#e03060]" : "text-text-primary"}`}>
                      ₮{plan.price.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{plan.desc}</p>

                  <div className="flex flex-col gap-2 mb-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className={`text-xs shrink-0 ${isSel ? "text-accent-light" : "text-[rgba(255,255,255,0.3)]"}`}>✓</span>
                        <span className="text-text-primary">{f}</span>
                      </div>
                    ))}
                    {plan.missing.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs text-text-muted shrink-0">—</span>
                        <span className="text-text-muted">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); setSelected(plan.id); router.push("/dashboard"); }}
                    className={`w-full py-3 rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border-none ${
                      isSel
                        ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white shadow-[0_4px_20px_rgba(158,24,56,0.35)]"
                        : "bg-[rgba(255,255,255,0.05)] text-text-secondary"
                    }`}>
                    {isSel ? "✓ Энэ багц сонгосон" : "Сонгох"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
