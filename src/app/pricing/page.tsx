"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLANS = [
  {
    id: "standard", name: "Стандарт", price: 29900, period: "сар", badge: "Үндсэн", color: "#3cc878",
    desc: "Roleplay + Forum + Swipe (өдөрт 30) + Тоглоом",
    features: ["Swipe (өдөрт 30 удаа)", "Forum унших & бичих", "Basic roleplay сценари", "Mini-game хандалт", "Chat (өдөрт 10 хүн)"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like", "Exclusive content"],
  },
  {
    id: "premium", name: "Premium", price: 59900, period: "сар", badge: "Хамгийн алдартай", color: "#9b59ff", popular: true,
    desc: "Бүгд + Unlimited swipe + AI companion + Boost x3 + Exclusive content",
    features: ["Хязгааргүй swipe", "AI Roleplay companion", "Boost x3 / сар", "Super-like x5 / өдөр", "Exclusive forum & content", "Хязгааргүй chat", "Нууц forum хэсэг", "VIP badge & тэргүүлэх эрх"],
    missing: [],
  },
  {
    id: "quarterly", name: "Улирлын", price: 39900, period: "3 сар", badge: "Хэмнэлттэй", color: "#f0c040",
    desc: "Стандарт багц — 3 сарын урьдчилан төлөлт (↓10K хэмнэлт)",
    features: ["Стандартын бүх зүйл", "3 сарын урьдчилан төлөлт", "10,000₮ хэмнэлт", "Priority дэмжлэг", "Онцгой streak badge"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like"],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("premium");

  return (
    <div className="min-h-screen px-6 pt-24 pb-16"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(155,89,255,0.07) 0%, transparent 55%), var(--bg-primary)" }}>

      <div className="w-full max-w-[1060px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif font-black mb-2" style={{ fontSize: "clamp(26px,4vw,48px)" }}>
            Багцаа <span style={{ background: "linear-gradient(135deg, #a855f7, #e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>сонгоно уу</span>
          </h1>
          <p className="text-text-secondary text-sm mb-4">QPay / SocialPay · Хэдийд ч цуцлах боломжтой</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(50,190,110,0.1)] text-[#30be78] border border-[rgba(50,190,110,0.2)]">✓ QPay</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(50,120,220,0.1)] text-[#3080e0] border border-[rgba(50,120,220,0.2)]">✓ SocialPay</span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {PLANS.map(plan => {
            const isSel = selected === plan.id;
            return (
              <div key={plan.id} onClick={() => setSelected(plan.id)}
                className="bg-bg-card rounded-[28px] p-7 cursor-pointer relative transition-all duration-200"
                style={{
                  border: isSel ? `2px solid ${plan.color}` : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isSel ? `0 0 40px ${plan.color}20` : "none",
                }}>
                <div className="absolute top-[-12px] right-5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: plan.color, color: plan.id === "quarterly" ? "#1a1000" : "white" }}>
                    {plan.badge}
                  </span>
                </div>
                {isSel && (
                  <div className="absolute top-4 left-4 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                    style={{ background: plan.color }}>✓</div>
                )}
                <div className="mt-3">
                  <div className="text-xs font-bold text-text-muted tracking-[0.06em] mb-1.5">{plan.name.toUpperCase()}</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[36px] font-black font-serif" style={{ color: plan.color }}>₮{plan.price.toLocaleString()}</span>
                    <span className="text-[13px] text-text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{plan.desc}</p>
                  <div className="flex flex-col gap-2 mb-6">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs shrink-0" style={{ color: plan.color }}>✓</span>
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
                    className="w-full py-3 rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: isSel ? plan.color : "transparent",
                      border: isSel ? "none" : `1px solid ${plan.color}50`,
                      color: isSel ? (plan.id === "quarterly" ? "#1a1000" : "white") : plan.color,
                    }}>
                    {isSel ? "✓ Энэ багц сонгосон" : "Сонгох"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-[11px] text-text-muted/50 tracking-wide">
          18+ · Зөвхөн насанд хүрэгчдэд · Хэдийд ч цуцлах боломжтой
        </p>
      </div>
    </div>
  );
}
