"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Drama, Users, MessageCircle, Gamepad2 } from "lucide-react";

const NAV = [
  { href: "/", icon: Home, label: "Нүүр" },
  { href: "/swipe", icon: Heart, label: "Танилцах" },
  { href: "/roleplay", icon: Drama, label: "Roleplay" },
  { href: "/forum", icon: Users, label: "Forum" },
  { href: "/chat", icon: MessageCircle, label: "Чат" },
  { href: "/games", icon: Gamepad2, label: "Тоглоом" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-bg-primary w-full overflow-x-hidden">

      <aside className="hidden md:flex w-[230px] shrink-0 fixed top-16 left-0 bottom-0 z-40 bg-bg-secondary border-r border-white/[0.05] flex-col py-5 px-3">
        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV.map(n => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} className="no-underline">
                <div className={`flex items-center gap-3 px-3.5 py-[11px] rounded-lg text-sm font-medium transition-all duration-[180ms] cursor-pointer w-full
                  ${active
                    ? "bg-[rgba(158,24,56,0.14)] text-accent-light shadow-[inset_3px_0_0_#9e1838]"
                    : "text-text-secondary hover:bg-[rgba(158,24,56,0.07)] hover:text-text-primary"
                  }`}>
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                  <span>{n.label}</span>
                  {n.href === "/games" && (
                    <span className="ml-auto inline-flex items-center gap-1 px-[6px] py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">
                      Шинэ
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="h-px bg-white/[0.05] my-4" />

        <div className="px-3 py-2.5 flex items-center gap-2.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-bg-elevated">
          <div className="relative">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold text-white bg-[linear-gradient(135deg,#e8415a,#9b59ff)]"
            >М</div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green rounded-full border-2 border-bg-primary animate-glow-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate">munkh_22</div>
            <div className="text-[11px] text-text-muted">
              <span className="inline-flex items-center gap-1 px-[6px] py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">PRO</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-[230px] min-h-screen flex flex-col pt-14 pb-[72px] md:pb-0 min-w-0 overflow-x-hidden">
        <div className="p-5 md:p-7 flex-1">{children}</div>
      </main>

      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(12,9,25,0.97)] backdrop-blur-[24px] border-t border-[rgba(158,24,56,0.15)] py-1.5 justify-around items-center">
        {NAV.map(n => {
          const Icon = n.icon;
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href} className="no-underline">
              <div
                className={`flex flex-col items-center gap-[3px] px-2.5 py-1 rounded-[10px] transition-colors duration-[180ms] ${active ? "text-[#e8415a]" : "text-text-muted"}`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
                <span className={`text-[10px] tracking-[0.01em] ${active ? "font-bold" : "font-normal"}`}>{n.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
