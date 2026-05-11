"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthBanner from "../_components/AuthBanner";

const GENDERS = ["Эрэгтэй", "Эмэгтэй", "Бусад"];

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "", gender: "" });

  const canSubmit = form.name.length >= 2 && form.phone.length >= 8 && form.password.length >= 6 && !!form.gender;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { router.push("/pricing"); }, 1200);
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
              <h1 className="font-serif text-[28px] font-bold tracking-[-0.02em] mb-1">Бүртгүүлэх</h1>
              <p className="text-text-secondary text-sm">Хэдхэн секундэд эхлэх боломжтой</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>Нэр</label>
                <input
                  className={inputCls}
                  placeholder="Таны нэр"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

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
                <label className={labelCls}>Хүйс</label>
                <div className="flex gap-2">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, gender: g }))}
                      className="flex-1 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                      style={{
                        border: form.gender === g ? "1.5px solid rgba(200,48,90,0.7)" : "1px solid rgba(255,255,255,0.08)",
                        background: form.gender === g ? "rgba(200,48,90,0.1)" : "rgba(255,255,255,0.02)",
                        color: form.gender === g ? "#e04878" : "var(--text-secondary)",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Нууц үг</label>
                <div className="relative">
                  <input
                    className={`${inputCls} pr-11`}
                    type={showPass ? "text" : "password"}
                    placeholder="Хамгийн багадаа 6 тэмдэгт"
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
                disabled={!canSubmit || loading}
                className="w-full text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 py-3.5 mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", boxShadow: "0 4px 24px rgba(200,48,90,0.35)" }}
              >
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-text-muted tracking-wide">эсвэл</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <p className="text-center text-[13px] text-text-muted">
              Бүртгэлтэй юу?{" "}
              <Link href="/auth/login">
                <span className="text-[#e04878] font-semibold cursor-pointer hover:text-[#c22d50] transition-colors">Нэвтрэх</span>
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
