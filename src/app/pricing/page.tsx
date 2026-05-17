"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Zap, Film, Heart, Bot } from "lucide-react";
import { membershipApi, MembershipPlan, QPayInvoice } from "@/apis";
import QPayModal from "@/components/QPayModal";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "";

function resolveUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function formatLimit(val: number, unit: string) {
  if (val < 0) return `Хязгааргүй ${unit}`;
  return `${unit} өдөрт ${val}`;
}

const TIER_STYLE: Record<string, { label: string; badge: string; glow: string; border: string; selBg: string }> = {
  basic: {
    label: "Basic",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.12)]",
    border: "border-emerald-500/40",
    selBg: "bg-[rgba(16,185,129,0.06)]",
  },
  standard: {
    label: "Standard",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.12)]",
    border: "border-blue-500/40",
    selBg: "bg-[rgba(59,130,246,0.06)]",
  },
  premium: {
    label: "Premium",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    border: "border-purple-500/40",
    selBg: "bg-[rgba(168,85,247,0.07)]",
  },
};

interface ActiveInvoice {
  invoice: QPayInvoice;
  membershipId: string;
  plan: MembershipPlan;
}

export default function PricingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<ActiveInvoice | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    membershipApi.getPlans()
      .then(res => {
        setPlans(res.plans);
        if (res.plans.length > 0) setSelected(res.plans[0]._id);
      })
      .catch(() => setError("Багцуудыг ачаалахад алдаа гарлаа"))
      .finally(() => setPlansLoading(false));
  }, []);

  const handleBuy = async (plan: MembershipPlan) => {
    setBuyingId(plan._id);
    setError("");
    try {
      const res = await membershipApi.purchase(plan._id);
      setActiveInvoice({ invoice: res.invoice, membershipId: res.membershipId, plan });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэхэмжлэл үүсгэхэд алдаа гарлаа");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen px-6 pt-28 pb-16 bg-[radial-gradient(ellipse_at_50%_0%,rgba(158,24,56,0.08)_0%,transparent_60%),var(--bg-primary)]">

      {activeInvoice && (
        <QPayModal
          invoice={activeInvoice.invoice}
          membershipId={activeInvoice.membershipId}
          plan={activeInvoice.plan}
          onPaid={async () => { await refreshUser(); router.push("/onboarding"); }}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      <div className="w-full max-w-[1100px] mx-auto">

        <div className="text-center mb-12">
          <h1 className="font-serif font-black mb-2 text-[clamp(26px,4vw,48px)]">
            Багцаа <span className="bg-[linear-gradient(135deg,#e03060,#9e1838)] bg-clip-text text-transparent">сонгоно уу</span>
          </h1>
          <p className="text-text-secondary text-sm mb-3">QPay-аар шууд төлөх боломжтой</p>
          {error && <p className="text-[13px] text-[#e04878] mt-2">{error}</p>}
        </div>

        {plansLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#c8254a]" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-text-muted">Идэвхтэй багц олдсонгүй</p>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {plans.map(plan => {
              const isSel = selected === plan._id;
              const isBuying = buyingId === plan._id;
              const tier = TIER_STYLE[plan.tier] ?? TIER_STYLE.basic;
              const imgUrl = resolveUrl(plan.image?.url);

              const features: { icon: React.ReactNode; text: string }[] = [];
              if (plan.swipeDailyLimit !== 0) features.push({ icon: <Heart size={13} />, text: formatLimit(plan.swipeDailyLimit, "Swipe") });
              if (plan.aiHumanDailyMessageLimit !== 0) features.push({ icon: <Bot size={13} />, text: formatLimit(plan.aiHumanDailyMessageLimit, "AI мессеж") });
              if (plan.movieComplimentaryQuota > 0) features.push({ icon: <Film size={13} />, text: `${plan.movieComplimentaryQuota} Бичлэг үнэгүй` });

              return (
                <div
                  key={plan._id}
                  onClick={() => setSelected(plan._id)}
                  className={`rounded-[28px] cursor-pointer relative transition-all duration-200 overflow-hidden flex flex-col border ${isSel
                    ? `${tier.selBg} border-[1.5px] ${tier.border} ${tier.glow}`
                    : "bg-bg-card border-[rgba(255,255,255,0.07)]"
                    }`}
                >
                  {/* Cover image */}
                  {imgUrl && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={plan.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.7)]" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1 gap-4">

                    {/* Tier + month badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${tier.badge}`}>
                        {tier.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isSel
                        ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white"
                        : "bg-[rgba(255,255,255,0.08)] text-text-muted"
                        }`}>
                        {plan.months === 1 ? "1 сар" : `${plan.months} сар`}
                      </span>
                    </div>

                    {/* Title + price */}
                    <div>
                      <div className="text-xs font-bold text-text-muted tracking-[0.06em] mb-1">{plan.title.toUpperCase()}</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-[34px] font-black font-serif ${isSel ? "text-[#e03060]" : "text-text-primary"}`}>
                          ₮{plan.price.toLocaleString()}
                        </span>
                        <span className="text-[13px] text-text-muted">/{plan.months === 1 ? "сар" : `${plan.months} сар`}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-line">
                        {plan.description}
                      </p>
                    )}

                    {/* Feature list */}
                    {features.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[13px]">
                            <span className={`shrink-0 ${isSel ? "text-accent-light" : "text-[rgba(255,255,255,0.3)]"}`}>
                              {f.icon}
                            </span>
                            <span className="text-text-primary">{f.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Buy button */}
                    <button
                      disabled={isBuying}
                      onClick={e => { e.stopPropagation(); handleBuy(plan); }}
                      className={`mt-auto w-full py-3 rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${isSel
                        ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white shadow-[0_4px_20px_rgba(158,24,56,0.35)]"
                        : "bg-[rgba(255,255,255,0.05)] text-text-secondary"
                        }`}
                    >
                      {isBuying ? <Loader2 size={14} className="animate-spin" /> : isSel ? <Zap size={14} /> : <Check size={14} />}
                      {isBuying ? "Нэхэмжлэл үүсгэж байна..." : isSel ? "QPay-аар төлөх" : "Сонгох"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
