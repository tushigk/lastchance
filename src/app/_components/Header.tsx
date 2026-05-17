"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuth } from "@/store/AuthProvider";
import { useNotifications } from "@/store/NotificationProvider";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  const isLoggedIn = !!user;
  const avatarLetter = (user?.name ?? user?.phone ?? "М").charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 pl-3.5 pr-5 md:pr-7 bg-[rgba(4,2,8,0.7)] backdrop-blur-[32px] backdrop-saturate-[1.4] border-b border-[rgba(255,255,255,0.04)]">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div><Image src="/logo.png" alt="" width={50} height={50} /></div>
        <span className="text-[17px] font-bold tracking-[-0.02em] text-text-primary font-serif">Khuslen</span>
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-2.5">
          <Link href="/notifications" className="no-underline">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-[rgba(255,255,255,0.06)] cursor-pointer border border-[rgba(255,255,255,0.07)]">
              <Bell size={17} strokeWidth={1.8} className="text-text-secondary" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-[linear-gradient(135deg,#e8415a,#9e1838)]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </div>
          </Link>
          <Link href="/profile" className="no-underline">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-[14px] font-bold text-white cursor-pointer transition-opacity duration-200 hover:opacity-80 bg-[linear-gradient(135deg,#e8415a,#9b59ff)] shadow-[0_2px_12px_rgba(200,37,74,0.35)]">
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                : avatarLetter}
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="text-text-secondary border border-white/[0.07] rounded-[12px] font-medium text-[13px] cursor-pointer transition-all duration-200 hover:text-text-primary hover:border-white/[0.14] px-5 py-[9px] bg-transparent">
              Нэвтрэх
            </button>
          </Link>
          <Link href="/register">
            <button className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:-translate-y-px px-5 py-[9px] bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_22px_rgba(158,24,56,0.38)]">
              Бүртгүүлэх
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
