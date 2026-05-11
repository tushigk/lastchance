"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-5 bg-[rgba(4,2,8,0.605)] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center text-[15px] font-black text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", fontFamily: "Playfair Display, serif", boxShadow: "0 4px 20px rgba(158,24,56,0.45)" }}
        >С</div>
        <span className="text-[17px] font-bold tracking-[-0.02em] text-text-primary" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/login">
          <button
            className="text-text-secondary border border-white/[0.07] rounded-[12px] font-medium text-[13px] cursor-pointer transition-all duration-200 hover:text-text-primary hover:border-white/[0.14] px-5 py-[9px]"
            style={{ background: "transparent" }}
          >
            Нэвтрэх
          </button>
        </Link>
        <Link href="/register">
          <button
            className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:-translate-y-px px-5 py-[9px]"
            style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", boxShadow: "0 4px 22px rgba(158,24,56,0.38)" }}
          >
            Бүртгүүлэх
          </button>
        </Link>
      </div>
    </header>
  );
}
