"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { membershipApi, MembershipPlan, QPayInvoice } from "@/lib/api";
import QPayModal from "@/components/QPayModal";
import { useAuth } from "@/store/AuthProvider";

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

      <div className="w-full max-w-[1060px] mx-auto">

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
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(290px,1fr))]">
            {plans.map(plan => {
              const isSel = selected === plan._id;
              const isBuying = buyingId === plan._id;
              return (
                <div key={plan._id} onClick={() => setSelected(plan._id)}
                  className={`rounded-[28px] p-7 cursor-pointer relative transition-all duration-200 ${isSel
                    ? "bg-[rgba(158,24,56,0.08)] border-[1.5px] border-[rgba(200,37,74,0.5)] shadow-[0_0_40px_rgba(158,24,56,0.15)]"
                    : "bg-bg-card border border-[rgba(255,255,255,0.07)]"
                    }`}>

                  {isSel && (
                    <div className="absolute top-4 left-4 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-[linear-gradient(135deg,#c8254a,#780f20)]">✓</div>
                  )}

                  <div className="absolute top-[-12px] right-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isSel
                      ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white"
                      : "bg-[rgba(255,255,255,0.08)] text-text-muted"
                      }`}>
                      {plan.months === 1 ? "1 сар" : `${plan.months} сар`}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-bold text-text-muted tracking-[0.06em] mb-1.5">{plan.title.toUpperCase()}</div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className={`text-[36px] font-black font-serif ${isSel ? "text-[#e03060]" : "text-text-primary"}`}>
                        ₮{plan.price.toLocaleString()}
                      </span>
                      <span className="text-[13px] text-text-muted">/{plan.months === 1 ? "сар" : `${plan.months} сар`}</span>
                    </div>

                    {plan.description && (
                      <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{plan.description}</p>
                    )}

                    <div className="flex flex-col gap-2 mb-6">
                      {plan.swipeDailyLimit > 0 && (
                        <div className="flex gap-2 items-center text-[13px]">
                          <span className={`text-xs shrink-0 ${isSel ? "text-accent-light" : "text-[rgba(255,255,255,0.3)]"}`}>✓</span>
                          <span className="text-text-primary">
                            {plan.swipeDailyLimit >= 9999 ? "Хязгааргүй swipe" : `Swipe өдөрт ${plan.swipeDailyLimit}`}
                          </span>
                        </div>
                      )}
                      {plan.aiHumanDailyMessageLimit > 0 && (
                        <div className="flex gap-2 items-center text-[13px]">
                          <span className={`text-xs shrink-0 ${isSel ? "text-accent-light" : "text-[rgba(255,255,255,0.3)]"}`}>✓</span>
                          <span className="text-text-primary">
                            {plan.aiHumanDailyMessageLimit >= 9999 ? "Хязгааргүй AI мессеж" : `AI мессеж өдөрт ${plan.aiHumanDailyMessageLimit}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isBuying}
                      onClick={e => { e.stopPropagation(); handleBuy(plan); }}
                      className={`w-full py-3 rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border-none flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${isSel
                        ? "bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white shadow-[0_4px_20px_rgba(158,24,56,0.35)]"
                        : "bg-[rgba(255,255,255,0.05)] text-text-secondary"
                        }`}>
                      {isBuying && <Loader2 size={14} className="animate-spin" />}
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
