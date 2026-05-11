"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthBanner from "../_components/AuthBanner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { router.push("/dashboard"); }, 1200);
  };

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] text-text-primary px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-text-muted focus:border-[rgba(200,48,90,0.5)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(200,48,90,0.1)]";
  const labelCls = "block text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase mb-2.5";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-primary">

      <div className="w-full h-72 md:h-screen md:w-[440px] md:shrink-0 md:sticky md:top-0 md:self-start border-b md:border-b-0 md:border-r border-white/[0.05]">
        <AuthBanner />
      </div>

      <div className="flex-1 flex items-start md:items-center justify-center px-6 py-10 md:py-12">
        <div className="w-full max-w-[420px]">

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 backdrop-blur-sm">
            <div className="mb-7">
              <h1 className="font-serif text-[28px] font-bold tracking-[-0.02em] mb-1">Нэвтрэх</h1>
              <p className="text-text-secondary text-sm">Нийгэмлэгт тавтай морил</p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Утасны дугаар</label>
                <input
                  className={inputCls}
                  type="tel"
                  placeholder="+976 8014 2409"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase">Нууц үг</label>
                  <span className="text-[12px] text-[rgba(200,48,90,0.8)] cursor-pointer hover:text-[#e04878] transition-colors">Мартсан уу?</span>
                </div>
                <div className="relative">
                  <input
                    className={`${inputCls} pr-11`}
                    type={showPass ? "text" : "password"}
                    placeholder="Нууц үг оруулна уу"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    {showPass ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 py-3.5 mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", boxShadow: "0 4px 24px rgba(200,48,90,0.35)" }}
              >
                {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-text-muted tracking-wide">эсвэл</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <p className="text-center text-[13px] text-text-muted">
              Бүртгэл байхгүй юу?{" "}
              <Link href="/auth/register">
                <span className="text-[#e04878] font-semibold cursor-pointer hover:text-[#c22d50] transition-colors">Бүртгүүлэх</span>
              </Link>
            </p>
          </div>

          <p className="text-center mt-6 text-[11px] text-text-muted/50 tracking-wide">
            18+ · Зөвхөн насанд хүрэгчдэд
          </p>
        </div>
      </div>
    </div>
  );
}
