"use client";
import { useState } from "react";
import { MapPin, Edit3, Heart, Shuffle, Flame, Star, Camera, Settings, ChevronRight, Shield, Bell, LogOut } from "lucide-react";

const INTERESTS = [
  "Хөгжим", "Аялал", "Кино", "Кафе", "Уран зохиол", "Спорт", "Roleplay", "Фото",
];

const PHOTOS = [
  { id: 1, placeholder: "1-р зураг" },
  { id: 2, placeholder: "2-р зураг" },
  { id: 3, placeholder: "3-р зураг" },
  { id: 4, placeholder: "4-р зураг" },
  { id: 5, placeholder: "+" },
];

const STATS = [
  { label: "Match", value: "24", color: "#e8415a", icon: Heart },
  { label: "Лайк авсан", value: "138", color: "#a06de0", icon: Star },
  { label: "Streak", value: "12", color: "#e8b850", icon: Flame },
  { label: "Swipe", value: "340", color: "#3c9be8", icon: Shuffle },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "settings">("info");

  return (
    <div className="max-w-[860px] mx-auto">

      {/* Profile card */}
      <div className="rounded-3xl overflow-hidden mb-5 relative border"
        style={{
          background: "linear-gradient(160deg, rgba(200,37,74,0.12) 0%, rgba(14,11,28,0.95) 50%)",
          border: "1px solid rgba(200,37,74,0.2)",
          boxShadow: "0 8px 40px rgba(200,37,74,0.08)",
        }}>
        {/* Background orb */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, rgba(155,89,255,0.12) 0%, transparent 65%)" }} />

        <div className="px-6 pt-8 pb-6 relative z-10">
          <div className="flex items-start gap-5 mb-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center text-[32px] font-black text-white font-serif"
                style={{ background: "linear-gradient(135deg, #e8415a, #9b59ff)", boxShadow: "0 4px 24px rgba(200,37,74,0.4)" }}>
                М
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-bg-primary"
                style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)" }}>
                <Camera size={12} strokeWidth={2} className="text-white" />
              </button>
            </div>

            {/* Name & info */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[22px] font-black font-serif text-white leading-none">munkh_22</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                  style={{ background: "rgba(212,160,64,0.15)", color: "#e8b850", border: "1px solid rgba(212,160,64,0.3)" }}>
                  PRO
                </span>
              </div>
              <p className="text-text-secondary text-[13px] mb-2">Мункхбаяр · 26 нас</p>
              <div className="flex items-center gap-1 text-text-muted text-[12px]">
                <MapPin size={11} strokeWidth={2} />
                <span>Улаанбаатар, Монгол</span>
              </div>
            </div>

            {/* Edit */}
            <button className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)" }}>
              <Edit3 size={12} strokeWidth={2} />
              Засах
            </button>
          </div>

          {/* Bio */}
          <p className="text-[14px] text-text-secondary leading-relaxed mb-5 border-l-2 pl-3"
            style={{ borderColor: "rgba(200,37,74,0.4)" }}>
            Кино, хөгжим дуртай. Сонирхолтой хүмүүстэй танилцахыг хүсч байна. Roleplay-д шинэ 🎭
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-[12px] font-medium text-text-secondary"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl px-3 py-3.5 text-center border"
              style={{
                background: `linear-gradient(135deg, ${s.color}0e 0%, rgba(7,5,15,0.85) 100%)`,
                border: `1px solid ${s.color}22`,
              }}>
              <Icon size={14} strokeWidth={2} className="mx-auto mb-1.5" style={{ color: s.color }} />
              <div className="text-[20px] font-black font-serif leading-none mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-text-muted">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Photos */}
      <div className="rounded-2xl px-5 py-5 mb-5 border"
        style={{ background: "rgba(14,11,28,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[13px] font-bold text-text-primary">Зургууд</h3>
          <button className="text-[12px] text-text-muted hover:text-text-primary transition-colors">Бүгдийг засах</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PHOTOS.map((p) => (
            <div key={p.id} className="aspect-square rounded-xl flex items-center justify-center text-[11px] text-text-muted cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{ background: p.id === 5 ? "rgba(200,37,74,0.08)" : "rgba(255,255,255,0.04)", border: p.id === 5 ? "1px dashed rgba(200,37,74,0.3)" : "1px solid rgba(255,255,255,0.07)" }}>
              {p.id === 5 ? <span style={{ color: "#e8415a", fontSize: "18px", fontWeight: 300 }}>+</span> : <Camera size={14} strokeWidth={1.5} className="text-text-muted opacity-40" />}
            </div>
          ))}
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
        <button className="w-full flex items-center gap-3.5 px-5 py-4 text-left border-t border-[rgba(255,255,255,0.05)] transition-colors duration-[180ms] hover:bg-[rgba(255,255,255,0.03)]">
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
