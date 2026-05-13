"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Heart, MessageCircle, ChevronRight } from "lucide-react";
import { swipeApi, SwipeUser } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

function resolveAvatar(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  return `${Math.floor(diff / (86400 * 7))} долоо хоногийн өмнө`;
}

interface LikeEntry {
  _id: string;
  likedAt: string;
  user: SwipeUser;
}

const PAGE_SIZE = 20;

export default function LikesPage() {
  const [likes, setLikes] = useState<LikeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    swipeApi.getLikesFull(1, PAGE_SIZE)
      .then(res => {
        setLikes(res.data);
        setTotal(res.total);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await swipeApi.getLikesFull(page + 1, PAGE_SIZE);
      setLikes(prev => [...prev, ...res.data]);
      setPage(p => p + 1);
    } catch { /* ignore */ }
    finally { setLoadingMore(false); }
  };

  const hasMore = likes.length < total;

  return (
    <div className="max-w-[860px] mx-auto pb-10">
      <div className="mb-7">
        <h1 className="text-[26px] font-black font-serif mb-1 flex items-center gap-2.5">
          <Heart size={22} className="text-[#e8415a]" strokeWidth={2} />
          Танд таалагдсан
        </h1>
        <p className="text-text-secondary text-[14px]">
          {loading ? "Ачаалж байна..." : total > 0 ? `${total} хүн таны профайлыг like хийсэн байна` : "Одоохондоо хэнч like хийгээгүй байна"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : likes.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-4 text-text-muted">
          <div className="w-16 h-16 rounded-full bg-[rgba(232,65,90,0.08)] flex items-center justify-center border border-[rgba(232,65,90,0.15)]">
            <Heart size={28} strokeWidth={1.5} className="text-[#e8415a] opacity-50" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-text-primary mb-1">Like байхгүй байна</p>
            <p className="text-[13px] text-text-muted">Swipe хэсэгт идэвхтэй байгаарай</p>
          </div>
          <Link href="/swipe">
            <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_16px_rgba(158,24,56,0.35)] hover:-translate-y-px transition-all duration-200 border-none cursor-pointer">
              Swipe хийх →
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {likes.map(entry => (
              <LikeCard key={entry._id} entry={entry} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-7">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-text-secondary border border-white/[0.1] hover:border-white/[0.2] hover:text-text-primary transition-all duration-200 disabled:opacity-50 cursor-pointer bg-transparent"
              >
                {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                {loadingMore ? "Ачаалж байна..." : "Цааш үзэх"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LikeCard({ entry }: { entry: LikeEntry }) {
  const { user } = entry;
  const avatarSrc = resolveAvatar(user.avatar);
  const displayName = user.name ?? user.username ?? "Хэрэглэгч";

  return (
    <div className="group relative aspect-[3/4] rounded-[20px] overflow-hidden bg-bg-elevated border border-white/[0.06] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {/* Avatar */}
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={displayName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/30"
          style={{ background: "linear-gradient(135deg,rgba(232,65,90,0.2),rgba(155,89,255,0.2))" }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Online dot */}
      {user.isOnline && (
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#3cc878] border-2 border-bg-primary shadow-[0_0_6px_rgba(60,200,120,0.6)]" />
      )}

      {/* Heart badge */}
      <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-[rgba(232,65,90,0.9)] flex items-center justify-center shadow-[0_2px_8px_rgba(232,65,90,0.4)]">
        <Heart size={13} fill="white" className="text-white" />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[13px] font-bold text-white leading-tight truncate">
          {displayName}{user.age ? `, ${user.age}` : ""}
        </p>
        <p className="text-[10px] text-white/50 mt-0.5">{timeAgo(entry.likedAt)}</p>

        {/* Actions — visible on hover */}
        <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link href={`/profile/${user._id}`} className="no-underline flex-1">
            <div className="py-1.5 rounded-lg text-[11px] font-semibold text-white text-center bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
              Профайл
            </div>
          </Link>
          <Link href={`/chat?user=${user._id}`} className="no-underline">
            <div className="w-8 py-1.5 rounded-lg flex items-center justify-center bg-[rgba(232,65,90,0.8)] hover:bg-[rgba(232,65,90,1)] transition-colors backdrop-blur-sm">
              <MessageCircle size={13} className="text-white" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
