"use client";
import { useEffect, useRef, useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { membershipApi, QPayInvoice, MembershipPlan } from "@/lib/api";

interface Props {
  invoice: QPayInvoice;
  membershipId: string;
  plan: MembershipPlan;
  onPaid: () => void;
  onClose: () => void;
}

const POLL_INTERVAL_MS = 3000;

export default function QPayModal({ invoice, membershipId, plan, onPaid, onClose }: Props) {
  const [paid, setPaid] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const status = await membershipApi.getStatus(membershipId);
        if (status.active) {
          setPaid(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(onPaid, 1800);
        }
      } catch {
        // keep polling silently
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [membershipId, onPaid]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(4,2,8,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-[420px] rounded-[28px] overflow-hidden border border-white/[0.08]"
        style={{ background: "linear-gradient(160deg, rgba(14,11,28,0.98) 0%, rgba(8,5,18,0.98) 100%)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-serif font-black text-[18px] text-text-primary">QPay төлбөр</h2>
            <p className="text-[12px] text-text-muted mt-0.5">{plan.title} · ₮{plan.price.toLocaleString()}</p>
          </div>
          {!paid && (
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-all cursor-pointer border-none bg-transparent">
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {paid ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle size={52} className="text-[#3cc878]" strokeWidth={1.5} />
              <p className="font-bold text-[16px] text-text-primary">Төлбөр амжилттай!</p>
              <p className="text-[13px] text-text-muted text-center">Таны {plan.title} гишүүнчлэл идэвхжлээ</p>
            </div>
          ) : (
            <>
              {/* QR code */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${invoice.qr_image}`}
                    alt="QPay QR"
                    className="w-[200px] h-[200px] block"
                  />
                </div>
              </div>

              <p className="text-center text-[12px] text-text-muted mb-4">
                QPay апп-аар QR код уншуулна уу эсвэл доорх банкны апп-аа нээнэ үү
              </p>

              {/* Bank deep links */}
              {invoice.urls && invoice.urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {invoice.urls.slice(0, 8).map((u, i) => (
                    <a key={i} href={u.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] no-underline transition-all duration-200 hover:bg-white/[0.07]"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {u.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.logo} alt={u.name} className="w-6 h-6 rounded-md object-contain shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-white/10 shrink-0" />
                      )}
                      <span className="text-[12px] font-medium text-text-secondary truncate">{u.name}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Polling indicator */}
              <div className="flex items-center justify-center gap-2 text-[12px] text-text-muted">
                <Loader2 size={12} className="animate-spin" />
                <span>Төлбөрийг хүлээж байна...</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
