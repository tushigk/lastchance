"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Loader2, Bell, MessageCircle, CreditCard, Megaphone, Users, BookOpen } from "lucide-react";
import { notificationApi, AppNotification } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

type NotifMeta = { icon: React.ElementType; color: string; bg: string };

function getMeta(type: string): NotifMeta {
  switch (type) {
    case "chat_invite":
      return { icon: Users, color: "#9b59ff", bg: "rgba(155,89,255,0.12)" };
    case "chat_message":
      return { icon: MessageCircle, color: "#3cc878", bg: "rgba(60,200,120,0.12)" };
    case "membership_activated":
      return { icon: CreditCard, color: "#e8b850", bg: "rgba(232,184,80,0.12)" };
    case "article_published":
    case "advisor_published":
      return { icon: BookOpen, color: "#388add", bg: "rgba(56,138,221,0.12)" };
    case "system_announcement":
      return { icon: Megaphone, color: "#e8415a", bg: "rgba(232,65,90,0.12)" };
    default:
      return { icon: Bell, color: "#a0a0b0", bg: "rgba(160,160,176,0.1)" };
  }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  return `${Math.floor(diff / (86400 * 30))} сарын өмнө`;
}

function NotifRow({
  n,
  onRead,
}: {
  n: AppNotification;
  onRead: (id: string) => void;
}) {
  const router = useRouter();
  const { icon: Icon, color, bg } = getMeta(n.type);

  const handleClick = () => {
    if (!n.isRead) onRead(n._id);
    if (n.type === "chat_invite" || n.type === "chat_message") {
      const roomId = n.data?.roomId as string | undefined;
      if (roomId) router.push(`/chat`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:brightness-110"
      style={{
        background: n.isRead ? "rgba(14,11,28,0.5)" : "rgba(14,11,28,0.85)",
        border: n.isRead ? "1px solid rgba(255,255,255,0.05)" : `1px solid ${color}28`,
        boxShadow: n.isRead ? "none" : `0 2px 16px ${color}10`,
      }}
    >
      {/* Icon badge */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: bg, border: `1px solid ${color}30` }}
      >
        <Icon size={18} strokeWidth={1.8} style={{ color }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {n.title && (
          <p className="text-[13px] font-semibold text-text-primary leading-snug mb-0.5">
            {n.title}
          </p>
        )}
        {n.body && (
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.body}</p>
        )}
        <p className="text-[11px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ background: color }}
        />
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    notificationApi.list().then(res => {
      setNotifs(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Real-time new notifications via socket
  useEffect(() => {
    const socket = io(BASE_URL, { withCredentials: true, reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("notification:new", (notif: AppNotification) => {
      setNotifs(prev => {
        if (prev.some(n => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  const markRead = async (id: string) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    await notificationApi.markRead(id).catch(() => {});
  };

  const markAllRead = async () => {
    if (markingAll) return;
    setMarkingAll(true);
    await notificationApi.markAllRead().catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setMarkingAll(false);
  };

  const unread = notifs.filter(n => !n.isRead);
  const read = notifs.filter(n => n.isRead);

  return (
    <div className="max-w-[860px] mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-black font-serif mb-1">Мэдэгдэл</h1>
          <p className="text-text-secondary text-[14px]">
            {unread.length > 0 ? `${unread.length} шинэ мэдэгдэл байна` : "Бүх мэдэгдэл уншигдсан"}
          </p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="text-[13px] font-medium text-[#e8415a] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {markingAll && <Loader2 size={13} className="animate-spin" />}
            Бүгдийг уншсан
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
          <Bell size={40} strokeWidth={1.5} />
          <p className="text-[14px]">Мэдэгдэл байхгүй байна</p>
        </div>
      ) : (
        <>
          {unread.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">Шинэ</p>
              <div className="flex flex-col gap-2">
                {unread.map(n => <NotifRow key={n._id} n={n} onRead={markRead} />)}
              </div>
            </div>
          )}
          {read.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">Өмнөх</p>
              <div className="flex flex-col gap-2">
                {read.map(n => <NotifRow key={n._id} n={n} onRead={markRead} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
