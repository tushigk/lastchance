"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Shuffle, Mail, Flame, Trophy, Wand2, Users, Gamepad2, Zap, Sparkles, Lock } from "lucide-react";

const ACTIVITIES = [
  { user: "Oyunaa_96", action: "Таны профайлыг үзсэн", time: "2 мин өмнө", avatar: "О", color: "#c22d50" },
  { user: "Badamkhand", action: "Таны зурганд super-like дарсан", time: "15 мин өмнө", avatar: "Б", color: "#c48830" },
  { user: "Tulgaa_88", action: "Match болсон", time: "1 цаг өмнө", avatar: "Т", color: "#1f9e60" },
  { user: "Narantsetseg", action: "Forum-д хариулт өгсөн", time: "3 цаг өмнө", avatar: "Н", color: "#1d60bb" },
];

const HOT_TOPICS = [
  { title: "Улаанбаатар дахь шөнийн амьдрал", replies: 142, hot: true },
  { title: "Roleplay-д хамтрагч хайж байна — уран зохиол", replies: 89 },
  { title: "Энэ долоо хоногийн mini-game рейтинг", replies: 67 },
  { title: "Аялалын нөхөр хайж байна — Хөвсгөл", replies: 54 },
];

const ONLINE_USERS = [
  { name: "Suvd_01", tag: "Swipe ready", color: "#c22d50" },
  { name: "Enkhjin", tag: "Roleplay", color: "#8b4fd4" },
  { name: "Batbold_93", tag: "Чатад", color: "#1f9e60" },
  { name: "Munkhzul", tag: "Forum", color: "#c48830" },
  { name: "Gantulga", tag: "Тоглоом", color: "#1d60bb" },
];

const LEADERBOARD = [
  { rank: 1, name: "Tsetseg_lit", score: 2840, badge: "Roleplay writer" },
  { rank: 2, name: "munkh_22", score: 2410, badge: "Streak master" },
  { rank: 3, name: "Oyunaa_96", score: 1987, badge: "Top swiper" },
];

const DAILY_CHALLENGES = [
  { label: "1 Swipe хийх", reward: "Streak хадгалах", done: true },
  { label: "Forum-д бичлэг нийтлэх", reward: "Badge олгох", done: false },
  { label: "Roleplay эхлэх", reward: "Нэмэлт unlock", done: false },
];

const STATS = [
  { icon: Shuffle, label: "Шинэ swipe", value: "14", color: "#c22d50" },
  { icon: Heart, label: "Match", value: "7", color: "#c22d50" },
  { icon: Mail, label: "Уншаагүй", value: "3", color: "#8b4fd4" },
  { icon: Flame, label: "Streak", value: "×12", color: "#c48830" },
  { icon: Trophy, label: "Рейтинг", value: "#2", color: "#1f9e60" },
];

const QUICK_ACTIONS = [
  { href: "/swipe", label: "Swipe", icon: Heart, desc: "14 хүлээж байна", color: "#c22d50" },
  { href: "/roleplay", label: "Roleplay", icon: Wand2, desc: "AI туслагчтай", color: "#8b4fd4" },
  { href: "/forum", label: "Forum", icon: Users, desc: "5 шинэ хариулт", color: "#1d60bb" },
  { href: "/games", label: "Тоглоом", icon: Gamepad2, desc: "24 онлайн одоо", color: "#1f9e60" },
];

const EXCLUSIVE_UNLOCKS = [
  { label: "Нуурын эрэг сценари", tag: "Roleplay", icon: Wand2, color: "#8b4fd4", locked: false },
  { label: "VIP Forum хэсэг", tag: "Нийгэмлэг", icon: Lock, color: "#c22d50", locked: false },
  { label: "AI companion горим", tag: "Premium", icon: Sparkles, color: "#c48830", locked: true },
];

export default function DashboardPage() {
  const [streakDay] = useState(12);

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-[clamp(22px,3vw,28px)] font-bold mb-1 tracking-[-0.02em]">
              Сайн байна уу, <span className="bg-gradient-to-br from-[#c22d50] to-[#9e1838] bg-clip-text text-transparent">munkh_22</span>
            </h1>
            <p className="text-text-secondary text-sm">Өнөөдөр 12 хүн таны профайлыг үзсэн байна.</p>
          </div>
          <div className="rounded-[14px] px-[18px] py-3 flex items-center gap-3 shrink-0 bg-[rgba(158,24,56,0.08)] border border-[rgba(158,24,56,0.2)]">
            <div className="w-2.5 h-2.5 rounded-full animate-glow-pulse bg-accent-light" />
            <div>
              <div className="text-sm font-bold text-text-primary">PRO гишүүн</div>
              <div className="text-[11px] text-text-muted">Бүгд нээлттэй</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[10px] mb-5">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-bg-card border border-white/[0.05] rounded-[14px] px-3.5 py-3.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[9px] shrink-0 flex items-center justify-center"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <Icon size={15} strokeWidth={1.8} style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-extrabold truncate font-serif" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-text-muted leading-tight truncate">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak banner */}
      <div className="rounded-[18px] px-5 py-[18px] mb-6 flex items-center gap-4 flex-wrap bg-[linear-gradient(135deg,rgba(158,24,56,0.1),rgba(154,96,16,0.07))] border border-[rgba(158,24,56,0.25)] shadow-[0_0_30px_rgba(158,24,56,0.1)]">
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-[rgba(158,24,56,0.2)] border border-[rgba(158,24,56,0.3)]">
            <Flame size={20} strokeWidth={1.8} className="text-accent-light" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold">
              <span className="bg-gradient-to-br from-[#c22d50] to-[#9e1838] bg-clip-text text-transparent">{streakDay} өдрийн streak</span>
            </div>
            <div className="text-xs text-text-secondary">
              2 өдрийн дараа <strong className="text-accent-gold-light">онцгой урамшуулал</strong>
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-1 justify-center overflow-x-auto py-1">
          {Array.from({length: 14}, (_, i) => (
            <div key={i} className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center ${i < streakDay ? "bg-[linear-gradient(135deg,#b82040,#c48830)]" : "bg-[rgba(255,255,255,0.06)]"}`}>
              {i < streakDay && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
            </div>
          ))}
        </div>
        <Link href="/swipe">
          <button className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 px-[18px] py-[10px] shrink-0 bg-[linear-gradient(135deg,#b82040,#6e0f22)] shadow-[0_4px_18px_rgba(158,24,56,0.3)]">
            Streak хадгалах →
          </button>
        </Link>
      </div>

      {/* Daily challenges */}
      <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase flex items-center gap-1.5">
            <Zap size={12} strokeWidth={2} className="text-accent-gold-light" />
            Өнөөдрийн даалгавар
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[rgba(158,24,56,0.1)] text-accent-light border border-[rgba(158,24,56,0.2)]">
            1/3 дууссан
          </span>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {DAILY_CHALLENGES.map((c, i) => (
            <div key={i} className={`flex-[1_1_150px] px-3.5 py-3 rounded-[12px] flex items-center justify-between gap-2 ${c.done ? "bg-[rgba(31,158,96,0.08)] border border-[rgba(31,158,96,0.2)]" : "bg-bg-elevated border border-[rgba(255,255,255,0.05)]"}`}>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center ${c.done ? "bg-[rgba(31,158,96,0.3)] border border-[rgba(31,158,96,0.4)]" : "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]"}`}>
                  {c.done && <div className="w-[5px] h-[5px] rounded-full bg-green" />}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${c.done ? "text-green" : "text-text-primary"}`}>{c.label}</div>
                  <div className="text-[11px] text-text-muted">{c.reward}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        {/* Left col */}
        <div className="flex flex-col gap-[18px]">
          {/* Quick actions */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5">
            <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase mb-4">Хурдан зочлох</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <Link key={a.href} href={a.href} className="no-underline">
                    <div className="bg-bg-elevated border border-white/[0.04] rounded-[12px] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.08]">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3"
                        style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                        <Icon size={16} strokeWidth={1.8} style={{ color: a.color }} />
                      </div>
                      <div className="text-[13px] font-semibold mb-0.5">{a.label}</div>
                      <div className="text-[11px]" style={{ color: a.color }}>{a.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase flex items-center gap-1.5">
                <Trophy size={12} strokeWidth={1.8} className="text-accent-gold-light" />
                Сарын рейтинг
              </h3>
              <span className="text-[11px] text-text-muted">Энэ сар шинэчлэгдэнэ</span>
            </div>
            <div className="flex flex-col gap-2">
              {LEADERBOARD.map((l, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] border ${l.name === "munkh_22" ? "bg-[rgba(158,24,56,0.08)] border-[rgba(158,24,56,0.18)]" : "bg-transparent border-transparent"}`}>
                  <span className={`text-base font-black min-w-[20px] font-serif ${i === 0 ? "text-accent-gold-light" : i === 1 ? "text-[rgba(255,255,255,0.45)]" : "text-[#8a5a30]"}`}>
                    {l.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{l.name}</div>
                    <div className="text-[11px] text-text-muted">{l.badge}</div>
                  </div>
                  <span className="text-[13px] font-bold text-accent-gold-light">{l.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Online now */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase">Онлайн одоо</h3>
              <div className="w-2 h-2 bg-green rounded-full animate-glow-pulse" />
            </div>
            <div className="flex flex-col gap-2.5">
              {ONLINE_USERS.map((u, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${u.color}18`, border: `1px solid ${u.color}30`, color: u.color }}>
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{u.name}</div>
                    <div className="text-[11px] text-text-muted">{u.tag}</div>
                  </div>
                  <Link href="/chat" className="ml-auto shrink-0">
                    <button className="bg-transparent rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-[180ms] hover:opacity-80"
                      style={{ border: `1px solid ${u.color}35`, color: u.color }}>
                      Чат
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-[18px]">
          {/* Activity feed */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5">
            <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase mb-4">Идэвхийн мэдэгдэл</h3>
            <div className="flex flex-col gap-3.5">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, color: a.color }}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px]">
                      <strong style={{ color: a.color }}>{a.user}</strong>{" "}
                      <span className="text-text-secondary">{a.action}</span>
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusive unlocks */}
          <div className="rounded-[18px] px-[22px] py-5 bg-[linear-gradient(135deg,rgba(90,31,138,0.1),rgba(158,24,56,0.07))] border border-[rgba(90,31,138,0.2)]">
            <h3 className="text-[12px] font-bold tracking-[0.06em] uppercase mb-4 flex items-center gap-1.5 text-accent-purple">
              <Sparkles size={12} strokeWidth={1.8} />
              Онцгой хандалт
            </h3>
            <div className="flex flex-col gap-2">
              {EXCLUSIVE_UNLOCKS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} strokeWidth={1.8} style={{ color: item.locked ? "var(--text-muted)" : item.color }} />
                      <div>
                        <div className={`text-[13px] ${item.locked ? "text-text-muted" : "text-text-secondary"}`}>{item.label}</div>
                        <div className="text-[10px] text-text-muted">{item.tag}</div>
                      </div>
                    </div>
                    {item.locked ? (
                      <span className="text-[10px] text-text-muted border border-white/[0.06] rounded-full px-2 py-0.5">Premium</span>
                    ) : (
                      <div className="w-[6px] h-[6px] rounded-full" style={{ background: item.color }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-text-muted mt-3.5 text-center">
              Premium-д шилжих:{" "}
              <Link href="/pricing" className="no-underline text-accent-purple">Дэлгэрэнгүй →</Link>
            </div>
          </div>

          {/* Seasonal event */}
          <div className="rounded-[18px] px-[22px] py-5 bg-[linear-gradient(135deg,rgba(90,31,138,0.12),rgba(158,24,56,0.08))] border border-[rgba(90,31,138,0.2)]">
            <div className="flex gap-3 items-center mb-3.5">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-[rgba(90,31,138,0.2)] border border-[rgba(90,31,138,0.3)]">
                <Sparkles size={18} strokeWidth={1.6} className="text-accent-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">Seasonal Event: 5 сар</div>
                <div className="text-[11px] text-text-muted">Зун эхлэх special roleplay сценари</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase shrink-0 bg-[rgba(158,24,56,0.15)] text-accent-light border border-[rgba(158,24,56,0.25)]">
                3 хоног
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-[1.7] mb-4">
              Зуны тусгай "Нуурын эрэг" roleplay сценари нэмэгдлээ. Хамгийн идэвхтэй тоглогч онцгой badge авна!
            </p>
            <Link href="/roleplay">
              <button className="w-full text-white border-none rounded-[12px] font-semibold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 py-2.5 bg-[linear-gradient(135deg,#b82040,#6e0f22)] shadow-[0_4px_18px_rgba(158,24,56,0.3)]">
                Оролцох →
              </button>
            </Link>
          </div>

          {/* Hot topics */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[18px] px-[22px] py-5">
            <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase mb-4 flex items-center gap-1.5">
              <Flame size={12} strokeWidth={1.8} className="text-accent-light" />
              Forum халуун сэдэв
            </h3>
            <div className="flex flex-col gap-2">
              {HOT_TOPICS.map((t, i) => (
                <Link key={i} href="/forum" className="no-underline">
                  <div className="px-3 py-2.5 rounded-[10px] flex justify-between items-center gap-2 transition-all duration-[180ms] hover:border-[rgba(158,24,56,0.2)] bg-bg-elevated border border-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {t.hot && <Flame size={12} strokeWidth={1.8} className="shrink-0 text-accent-light" />}
                      <span className="text-[13px] text-text-secondary truncate">{t.title}</span>
                    </div>
                    <span className="text-[11px] text-text-muted shrink-0">{t.replies}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
