"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Edit3, Camera, Settings, ChevronRight, Shield, Bell, LogOut, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/store/AuthProvider";
import { profileApi } from "@/lib/api";

const GENDER_LABEL: Record<string, string> = {
  male: "Эрэгтэй",
  female: "Эмэгтэй",
  other: "Бусад",
};

export default function ProfilePage() {
  const { user, logout, membershipActive, refreshUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const displayName = user?.name ?? user?.phone ?? "Хэрэглэгч";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const currentYear = new Date().getFullYear();
  const age = user?.birthYear ? currentYear - user.birthYear : null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await profileApi.updateAvatar(file);
      await refreshUser();
    } catch {
      // silently fail — could add toast later
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-[860px] mx-auto">

      {/* Profile card */}
      <div className="rounded-3xl overflow-hidden mb-5 relative border"
        style={{
          background: "linear-gradient(160deg, rgba(200,37,74,0.12) 0%, rgba(14,11,28,0.95) 50%)",
          border: "1px solid rgba(200,37,74,0.2)",
          boxShadow: "0 8px 40px rgba(200,37,74,0.08)",
        }}>
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, rgba(155,89,255,0.12) 0%, transparent 65%)" }} />

        <div className="px-6 pt-8 pb-6 relative z-10">
          <div className="flex items-start gap-5 mb-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden flex items-center justify-center text-[32px] font-black text-white font-serif"
                style={{ background: "linear-gradient(135deg, #e8415a, #9b59ff)", boxShadow: "0 4px 24px rgba(200,37,74,0.4)" }}>
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  avatarLetter
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-bg-primary disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)" }}>
                {avatarLoading
                  ? <Loader2 size={11} strokeWidth={2} className="text-white animate-spin" />
                  : <Camera size={12} strokeWidth={2} className="text-white" />
                }
              </button>
            </div>

            {/* Name & info */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[22px] font-black font-serif text-white leading-none">{displayName}</h1>
                {membershipActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                    style={{ background: "rgba(212,160,64,0.15)", color: "#e8b850", border: "1px solid rgba(212,160,64,0.3)" }}>
                    PRO
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {(user?.gender || age) && (
                  <p className="text-text-secondary text-[13px]">
                    {[user?.gender ? GENDER_LABEL[user.gender] ?? user.gender : null, age ? `${age} нас` : null]
                      .filter(Boolean).join(" · ")}
                  </p>
                )}
                {user?.city && (
                  <div className="flex items-center gap-1 text-text-muted text-[12px]">
                    <MapPin size={11} strokeWidth={2} />
                    <span>{user.city}</span>
                  </div>
                )}
                {user?.birthYear && (
                  <div className="flex items-center gap-1 text-text-muted text-[12px]">
                    <Calendar size={11} strokeWidth={2} />
                    <span>{user.birthYear} он</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit */}
            <button onClick={() => router.push("/onboarding")}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}>
              <Edit3 size={12} strokeWidth={2} />
              Засах
            </button>
          </div>

          {/* Bio */}
          {user?.bio ? (
            <p className="text-[14px] text-text-secondary leading-relaxed mb-5 border-l-2 pl-3"
              style={{ borderColor: "rgba(200,37,74,0.4)" }}>
              {user.bio}
            </p>
          ) : (
            <p className="text-[13px] text-text-muted italic mb-5 border-l-2 pl-3"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              Био нэмээгүй байна
            </p>
          )}

          {/* Interests */}
          {user?.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-[12px] font-medium text-text-secondary"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-muted italic">Сонирхол нэмээгүй байна</p>
          )}
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-2xl overflow-hidden border"
        style={{ background: "rgba(14,11,28,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { icon: Shield, label: "Нууцлал & аюулгүй байдал", color: "#3cc878" },
          { icon: Bell, label: "Мэдэгдлийн тохиргоо", color: "#3c9be8" },
          { icon: Settings, label: "Бүртгэлийн тохиргоо", color: "#a06de0" },
        ].map((item, i, arr) => {
          const Icon = item.icon;
          return (
            <button key={i} className={`w-full flex items-center gap-3.5 px-5 py-4 text-left transition-colors duration-[180ms] hover:bg-[rgba(255,255,255,0.03)] ${i < arr.length - 1 ? "border-b border-[rgba(255,255,255,0.05)]" : ""}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}28` }}>
                <Icon size={15} strokeWidth={1.8} style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-[14px] text-text-primary">{item.label}</span>
              <ChevronRight size={15} strokeWidth={1.8} className="text-text-muted" />
            </button>
          );
        })}
        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-5 py-4 text-left border-t border-[rgba(255,255,255,0.05)] transition-colors duration-[180ms] hover:bg-[rgba(255,255,255,0.03)]">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(232,65,90,0.1)", border: "1px solid rgba(232,65,90,0.22)" }}>
            <LogOut size={15} strokeWidth={1.8} style={{ color: "#e8415a" }} />
          </div>
          <span className="flex-1 text-[14px]" style={{ color: "#e8415a" }}>Гарах</span>
        </button>
      </div>

    </div>
  );
}
