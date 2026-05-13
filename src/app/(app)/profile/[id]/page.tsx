"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Heart, ArrowLeft, Star, Calendar, Clock, Loader2, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { userApi, PublicProfile, PublicNetworkPost } from "@/lib/api";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

const GENDERS: Record<string, string> = { male: "Эрэгтэй", female: "Эмэгтэй", other: "Бусад" };

function resolveAvatar(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} сарын өмнө`;
  return `${Math.floor(diff / (86400 * 365))} жилийн өмнө`;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: me } = useAuth();
  const id = params.id as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<PublicNetworkPost[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = me?._id === id;

  useEffect(() => {
    setLoading(true);
    userApi.getPublicProfile(id)
      .then(res => {
        setProfile(res.profile);
        setPosts(res.posts);
        setPostsTotal(res.postsTotal);
      })
      .catch(e => setError(e instanceof Error ? e.message : "Профайл ачаалахад алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-[#c8254a]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-[#e8415a]">{error || "Профайл олдсонгүй"}</p>
        <button onClick={() => router.back()} className="text-text-muted hover:text-white text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Буцах
        </button>
      </div>
    );
  }

  const displayName = profile.name ?? profile.username ?? "Хэрэглэгч";
  const avatarSrc = resolveAvatar(profile.avatar);
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <div className="max-w-[860px] mx-auto pb-12 w-full">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-white mb-5 transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium">
        <ArrowLeft size={16} /> Буцах
      </button>

      {/* Profile Header Card */}
      <div className="bg-bg-card border border-white/[0.08] rounded-[28px] overflow-hidden relative shadow-2xl">

        {/* Cover gradient */}
        <div className="h-36 md:h-48 relative w-full"
          style={{ background: "linear-gradient(135deg, rgba(200,37,74,0.25) 0%, rgba(120,15,32,0.15) 50%, rgba(7,5,15,0.8) 100%)" }}>
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(200,37,74,0.18) 0%, transparent 60%)" }} />
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-10 pb-8 relative -mt-14 md:-mt-16 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-end text-center md:text-left">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] flex items-center justify-center text-[48px] md:text-[60px] font-black font-serif text-white border-4 border-bg-card overflow-hidden relative z-10"
              style={{ background: "linear-gradient(135deg, #c8254a, #780f20)", boxShadow: "0 16px 40px rgba(200,37,74,0.4)" }}>
              {avatarSrc
                ? <img src={avatarSrc} className="w-full h-full object-cover" alt="" />
                : avatarLetter}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-1 min-w-0">
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">{displayName}</h1>
              {profile.level && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background: "rgba(232,184,80,0.12)", border: "1px solid rgba(232,184,80,0.3)", color: "#e8b850" }}>
                  Lv.{profile.level.level} {profile.level.title}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[13px] text-text-muted mb-3">
              {profile.gender && <span>{GENDERS[profile.gender] ?? profile.gender}</span>}
              {profile.age && <span>· {profile.age} нас</span>}
              {profile.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {timeAgo(profile.createdAt)} нэгдсэн
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex gap-3 pb-1 shrink-0">
              <Link href={`/chat?user=${id}`}>
                <button className="flex items-center justify-center gap-2 px-6 h-11 rounded-2xl font-bold text-white text-[13px] border-none cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 6px 20px rgba(232,65,90,0.35)" }}>
                  <MessageCircle size={16} /> Чатлах
                </button>
              </Link>
            </div>
          )}
          {isOwnProfile && (
            <Link href="/profile" className="shrink-0">
              <button className="px-5 h-10 rounded-2xl text-[13px] font-medium text-text-secondary border border-white/[0.1] hover:border-white/[0.2] transition-all">
                Засах
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

        {/* Left: Stats */}
        <div className="flex flex-col gap-5 md:col-span-1">
          <div className="bg-bg-card border border-white/[0.05] rounded-[24px] p-5">
            <h3 className="font-bold text-[15px] mb-4 text-white flex items-center gap-2">
              <Star size={16} className="text-[#e8b850]" /> Үзүүлэлт
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[26px] font-black font-serif text-[#e8415a] mb-0.5">{postsTotal}</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wide font-bold">Нийтлэл</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[26px] font-black font-serif text-[#e8b850] mb-0.5">{profile.exp ?? 0}</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wide font-bold">XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Posts */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h3 className="font-bold text-[15px] text-white flex items-center gap-2 px-1">
            <Clock size={16} className="text-[#388add]" /> Нийтлэлүүд {postsTotal > 0 && <span className="text-text-muted font-normal text-[13px]">({postsTotal})</span>}
          </h3>

          {posts.length === 0 ? (
            <p className="text-text-muted text-[13px] px-1 py-4">Нийтлэл байхгүй байна</p>
          ) : (
            posts.map(post => (
              <div key={post._id} className="bg-bg-card border border-white/[0.05] rounded-[18px] p-5 hover:border-[rgba(200,48,90,0.18)] transition-colors">
                <h4 className="text-[15px] font-bold mb-1.5 font-serif leading-snug">{post.title}</h4>
                <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 mb-3">{post.description}</p>
                <div className="flex items-center gap-4 text-[12px] text-text-muted">
                  <span className="flex items-center gap-1"><Heart size={12} /> {post.likeCount}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.commentCount}</span>
                  <span className="ml-auto">{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
