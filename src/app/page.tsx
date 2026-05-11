"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Wand2, Users, Gamepad2, Lock, ArrowRight, Flame, ChevronDown } from "lucide-react";

const PLANS = [
  {
    id: "standard", name: "Стандарт", price: 29900, period: "сар", badge: "Үндсэн", badgeColor: "#3cc878", color: "#3cc878",
    desc: "Roleplay + Forum + Swipe (өдөрт 30) + Тоглоом",
    features: ["Swipe (өдөрт 30 удаа)", "Forum унших & бичих", "Basic roleplay сценари", "Mini-game хандалт", "Chat (өдөрт 10 хүн)"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like", "Exclusive content"]
  },
  {
    id: "premium", name: "Premium", price: 59900, period: "сар", badge: "Хамгийн алдартай", badgeColor: "#9b59ff", color: "#9b59ff",
    desc: "Бүгд + Unlimited swipe + AI companion + Boost x3 + Exclusive content",
    features: ["Хязгааргүй swipe", "AI Roleplay companion", "Boost x3 / сар", "Super-like x5 / өдөр", "Exclusive forum & content", "Хязгааргүй chat", "Нууц forum хэсэг", "VIP badge & тэргүүлэх эрх"],
    missing: []
  },
  {
    id: "quarterly", name: "Улирлын", price: 39900, period: "3 сар", badge: "Хэмнэлттэй", badgeColor: "#f0c040", color: "#f0c040",
    desc: "Стандарт багц — 3 сарын урьдчилан төлөлт (↓10K хэмнэлт)",
    features: ["Стандартын бүх зүйл", "3 сарын урьдчилан төлөлт", "10,000₮ хэмнэлт", "Priority дэмжлэг", "Онцгой streak badge"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like"]
  }
];

const FEATURES = [
  {
    icon: Heart,
    title: "Swipe & Танилц",
    desc: "AI тааруулалтаар хамгийн нийцтэй хүнтэйгээ уулз. Anonymous горим, verified профайлууд.",
    badge: "Шинэ",
    badgeStyle: { background: "rgba(158,24,56,0.15)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.3)" },
    glow: "rgba(158,24,56,0.08)",
    accent: "#c22d50",
  },
  {
    icon: Wand2,
    title: "Roleplay Орон",
    desc: "Дуртай дүрээрээ орж уран зохиолын ертөнцөд нэвтэр. AI туслагчтай тасралтгүй түүх.",
    badge: "AI",
    badgeStyle: { background: "rgba(90,31,138,0.15)", color: "#8b4fd4", border: "1px solid rgba(90,31,138,0.3)" },
    glow: "rgba(90,31,138,0.08)",
    accent: "#8b4fd4",
  },
  {
    icon: Flame,
    title: "Нийгэмлэгийн Forum",
    desc: "Нэргүй бичих, хамгийн халуухан сэдвүүдэд оролцох. Зөвхөн verified гишүүд.",
    badge: "Идэвхтэй",
    badgeStyle: { background: "rgba(158,24,56,0.12)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.25)" },
    glow: "rgba(158,24,56,0.07)",
    accent: "#c22d50",
  },
  {
    icon: Gamepad2,
    title: "Тоглоом",
    desc: "Truth or dare, spin the bottle — онлайнаар хамтдаа тоглох.",
    badge: "Удахгүй",
    badgeStyle: { background: "rgba(154,96,16,0.12)", color: "#c48830", border: "1px solid rgba(154,96,16,0.25)" },
    glow: "rgba(154,96,16,0.06)",
    accent: "#c48830",
  },
];

export default function LandingPage() {
  const [selected, setSelected] = useState("premium");

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">

      {/* Atmospheric orbs */}
      <div className="fixed pointer-events-none animate-orb-drift"
        style={{
          width: "900px", height: "900px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(158,24,56,0.13) 0%, rgba(158,24,56,0.04) 40%, transparent 68%)",
          top: "-380px", right: "-280px"
        }} />
      <div className="fixed pointer-events-none animate-orb-drift-rev"
        style={{
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(90,31,138,0.11) 0%, rgba(90,31,138,0.03) 42%, transparent 68%)",
          bottom: "-240px", left: "-200px"
        }} />
      <div className="fixed pointer-events-none animate-orb-drift"
        style={{
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,45,80,0.06) 0%, transparent 70%)",
          top: "42%", left: "32%"
        }} />
      {/* Extra sensual orb — center bottom */}
      <div className="fixed pointer-events-none animate-orb-drift-rev"
        style={{
          width: "500px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(158,24,56,0.07) 0%, transparent 65%)",
          bottom: "10%", left: "20%"
        }} />

      {/* Hero */}
      <section className="pt-4 flex flex-col items-center justify-center relative">
        <div className="text-center max-w-[900px] mx-auto px-6 py-24">

          <div className="mb-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
              style={{ background: "rgba(158,24,56,0.1)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.22)" }}>
              Монголын #1 Premium 18+ Нийгэмлэг
            </span>
          </div>

          <h1 className="font-serif font-black leading-[1.02] mb-8 tracking-[-0.045em] animate-fade-up"
            style={{ fontSize: "clamp(50px,9vw,104px)" }}>
            Нуугдсан<br />
            хүслийг{" "}
            <span style={{
              background: "linear-gradient(135deg, #e03060 0%, #9e1838 50%, #6b0f24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>дэлгэ</span>
          </h1>

          <p className="text-text-secondary leading-[1.85] max-w-[500px] mx-auto mb-14 animate-fade-up"
            style={{ fontSize: "clamp(15px,1.9vw,19px)" }}>
            Verified, нууцлалтай орчинд жинхэнэ холболт ол.<br />
            Зөвхөн насанд хүрэгчдэд зориулсан.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-8 animate-fade-up">
            <Link href="/auth/register">
              <button className="text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2.5 px-10 py-[17px] text-[15px] hover:-translate-y-[3px]"
                style={{
                  background: "linear-gradient(135deg, #c8254a 0%, #780f20 100%)",
                  boxShadow: "0 6px 30px rgba(158,24,56,0.42), 0 2px 8px rgba(0,0,0,0.3)"
                }}>
                Үнэгүй бүртгэл
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="rounded-full font-medium cursor-pointer transition-all duration-200 hover:text-text-primary px-10 py-[17px] text-[15px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--text-secondary)"
                }}>
                Үнийн мэдээлэл
              </button>
            </Link>
          </div>

          <p className="text-xs flex items-center justify-center gap-1.5 animate-fade-up" style={{ color: "var(--text-muted)" }}>
            <Lock size={11} />
            18+ · Монгол иргэдэд зориулсан · Нууцлал хамгаалагдсан
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[800px] mx-auto px-6 mb-24">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(158,24,56,0.3), rgba(90,31,138,0.2), transparent)" }} />
      </div>

      {/* Features */}
      <section className="max-w-[1120px] mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-4" style={{ color: "#c22d50" }}>Юу санал болгох вэ</p>
          <h2 className="font-serif font-black tracking-[-0.025em]" style={{ fontSize: "clamp(30px,4.5vw,48px)" }}>
            Юу ч боломжтой,{" "}
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #6b21a8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>нууцаар</span>
          </h2>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i}
                className="group transition-all duration-[350ms] hover:-translate-y-2 border rounded-[22px] px-7 py-9 flex flex-col gap-5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${f.glow} 0%, rgba(7,5,15,0.92) 60%)`,
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
                }}>
                {/* Card inner glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[22px]"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.glow} 0%, transparent 65%)` }} />

                <div className="flex items-center justify-between relative z-10">
                  <div className="w-11 h-11 rounded-[12px] flex items-center justify-center"
                    style={{ background: f.badgeStyle.background, border: f.badgeStyle.border }}>
                    <Icon size={19} style={{ color: f.badgeStyle.color }} strokeWidth={1.7} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full"
                    style={f.badgeStyle}>{f.badge}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>{f.title}</h3>
                  <p className="text-sm leading-[1.75]" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                </div>

                <div className="mt-auto relative z-10">
                  <div className="h-px" style={{ background: `linear-gradient(90deg, ${f.accent}40, transparent)` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[920px] mx-auto px-6 mb-32">
        <div className="rounded-[28px] py-16 px-10 grid text-center gap-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(158,24,56,0.08) 0%, rgba(90,31,138,0.06) 100%)",
            border: "1px solid rgba(158,24,56,0.18)",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(158,24,56,0.06) 0%, transparent 60%)" }} />
          {[
            { n: "12,400+", label: "Гишүүн" },
            { n: "98%", label: "Сэтгэл ханамж" },
            { n: "3 сар", label: "Хамгийн урт streak" },
            { n: "24/7", label: "Дэмжлэг" },
          ].map((s, i) => (
            <div key={i} className="relative z-10">
              <div className="font-black font-serif mb-2"
                style={{
                  fontSize: "clamp(30px,4vw,46px)",
                  background: "linear-gradient(135deg, #e03060, #9e1838)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>{s.n}</div>
              <div className="text-[12px] tracking-wide" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-[1060px] mx-auto px-6 mb-32">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-4" style={{ color: "#8b4fd4" }}>Нэвтрэх эрх</p>
          <h2 className="font-serif font-black tracking-[-0.025em]" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            Subscription{" "}
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #e040fb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Багц</span>
          </h2>
          <p className="text-base mt-3 mb-5" style={{ color: "var(--text-secondary)" }}>QPay / SocialPay-аар төлнө. Хэдийд ч цуцлах боломжтой.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase"
              style={{ background: "rgba(50,190,110,0.12)", color: "#30be78", border: "1px solid rgba(50,190,110,0.25)" }}>✓ QPay дэмжинэ</span>
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase"
              style={{ background: "rgba(50,120,220,0.12)", color: "#3080e0", border: "1px solid rgba(50,120,220,0.25)" }}>✓ SocialPay</span>
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase"
              style={{ background: "rgba(212,160,64,0.12)", color: "#e8b850", border: "1px solid rgba(212,160,64,0.25)" }}>✓ 7 хоног үнэгүй</span>
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {PLANS.map(plan => {
            const isSel = selected === plan.id;
            return (
              <div key={plan.id} onClick={() => setSelected(plan.id)}
                className="bg-bg-card rounded-[32px] p-7 cursor-pointer relative transition-all duration-[220ms]"
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
                  <div className="absolute top-4 left-4 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[13px] text-white"
                    style={{ background: plan.color }}>✓</div>
                )}
                <div className="mt-3">
                  <div className="text-xs font-bold tracking-[0.05em] mb-1.5" style={{ color: "var(--text-muted)" }}>{plan.name.toUpperCase()}</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[38px] font-black font-serif" style={{ color: plan.color }}>₮{plan.price.toLocaleString()}</span>
                    <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>/{plan.period}</span>
                  </div>
                  <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "var(--text-secondary)" }}>{plan.desc}</p>
                  <div className="flex flex-col gap-2 mb-[22px]">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs shrink-0" style={{ color: plan.color }}>✓</span>
                        <span style={{ color: "var(--text-primary)" }}>{f}</span>
                      </div>
                    ))}
                    {plan.missing.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>—</span>
                        <span style={{ color: "var(--text-muted)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/register">
                    <button className="w-full py-[13px] rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200"
                      style={{
                        background: isSel ? plan.color : "transparent",
                        border: isSel ? "none" : `1px solid ${plan.color}50`,
                        color: isSel ? (plan.id === "quarterly" ? "#1a1000" : "white") : plan.color,
                      }}>
                      {isSel ? "✓ Энэ багц сонгосон" : "Сонгох"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-32 relative">
        <div className="max-w-[600px] mx-auto">
          <div className="h-px mb-24" style={{ background: "linear-gradient(90deg, transparent, rgba(158,24,56,0.28), rgba(90,31,138,0.18), transparent)" }} />

          <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-6" style={{ color: "#c22d50" }}>Эхлэх цаг болсон</p>
          <h2 className="font-serif font-black mb-6 tracking-[-0.035em]" style={{ fontSize: "clamp(32px,5.5vw,60px)" }}>
            Таны аяллыг{" "}
            <span style={{
              background: "linear-gradient(135deg, #e03060, #9e1838)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>эхлүүлэхэд бэлэн</span>
          </h2>
          <p className="max-w-[420px] mx-auto mb-12" style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "var(--text-secondary)" }}>
            Өнөөдөр бүртгүүлж, Монголын хамгийн онцгой нийгэмлэгт нэгдэ.
          </p>
          <Link href="/auth/register">
            <button className="text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-3 mx-auto px-16 py-5 text-[16px] hover:-translate-y-[3px]"
              style={{
                background: "linear-gradient(135deg, #c8254a 0%, #780f20 100%)",
                boxShadow: "0 8px 40px rgba(158,24,56,0.45), 0 2px 10px rgba(0,0,0,0.35)"
              }}>
              Одоо Нэгдэх
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t flex items-center justify-between flex-wrap gap-4"
        style={{
          borderColor: "rgba(255,255,255,0.04)",
          padding: "24px clamp(16px,4vw,48px)"
        }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", fontFamily: "Playfair Display, serif" }}>С</div>
          <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>© 2026 Solongo. All rights reserved.</span>
        </div>
        <div className="flex gap-6 flex-wrap">
          {["Нууцлалын бодлого", "Үйлчилгээний нөхцөл", "Холбоо барих"].map(l => (
            <span key={l} className="text-[13px] cursor-pointer transition-colors duration-[180ms] hover:text-text-secondary"
              style={{ color: "var(--text-muted)" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
