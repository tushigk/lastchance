"use client";
import { Heart, Eye, MessageCircle, Users, Star, Trophy } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "like",
    icon: Star,
    color: "#e8b850",
    avatar: "Б",
    avatarColor: "#c48830",
    user: "Badamkhand",
    text: "Таны зурганд super-like дарсан",
    time: "15 мин өмнө",
    read: false,
  },
  {
    id: 2,
    type: "match",
    icon: Heart,
    color: "#e8415a",
    avatar: "Т",
    avatarColor: "#1f9e60",
    user: "Tulgaa_88",
    text: "Таны хооронд match болсон",
    time: "1 цаг өмнө",
    read: false,
  },
  {
    id: 3,
    type: "view",
    icon: Eye,
    color: "#a06de0",
    avatar: "О",
    avatarColor: "#c22d50",
    user: "Oyunaa_96",
    text: "Таны профайлыг үзсэн",
    time: "2 цаг өмнө",
    read: false,
  },
  {
    id: 4,
    type: "message",
    icon: MessageCircle,
    color: "#3cc878",
    avatar: "С",
    avatarColor: "#1a8a50",
    user: "Suvd_01",
    text: "Танд мессеж илгээсэн",
    time: "3 цаг өмнө",
    read: true,
  },
  {
    id: 5,
    type: "forum",
    icon: Users,
    color: "#3c9be8",
    avatar: "Н",
    avatarColor: "#1d60bb",
    user: "Narantsetseg",
    text: "Таны Forum бичлэгт хариулт өгсөн",
    time: "5 цаг өмнө",
    read: true,
  },
  {
    id: 6,
    type: "view",
    icon: Eye,
    color: "#a06de0",
    avatar: "Э",
    avatarColor: "#8b4fd4",
    user: "Enkhjin",
    text: "Таны профайлыг үзсэн",
    time: "Өчигдөр",
    read: true,
  },
  {
    id: 7,
    type: "match",
    icon: Heart,
    color: "#e8415a",
    avatar: "М",
    avatarColor: "#c22d50",
    user: "Munkhzul",
    text: "Таны хооронд match болсон",
    time: "Өчигдөр",
    read: true,
  },
];

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => !n.read);
  const read = NOTIFICATIONS.filter(n => n.read);

  return (
    <div className="max-w-[860px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[24px] font-black font-serif mb-1">Мэдэгдэл</h1>
        <p className="text-text-secondary text-[14px]">{unread.length} шинэ мэдэгдэл байна</p>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">Шинэ</p>
          <div className="flex flex-col gap-2">
            {unread.map(n => <NotifRow key={n.id} n={n} />)}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">Өмнөх</p>
          <div className="flex flex-col gap-2">
            {read.map(n => <NotifRow key={n.id} n={n} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifRow({ n }: { n: typeof NOTIFICATIONS[0] }) {
  const Icon = n.icon;
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border transition-all duration-200"
      style={{
        background: n.read ? "rgba(14,11,28,0.6)" : `rgba(14,11,28,0.85)`,
        border: n.read ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${n.color}28`,
        boxShadow: n.read ? "none" : `0 2px 16px ${n.color}10`,
      }}>
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
          style={{ background: `${n.avatarColor}22`, color: n.avatarColor, border: `1px solid ${n.avatarColor}38` }}>
          {n.avatar}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: `${n.color}20`, border: `1px solid ${n.color}40` }}>
          <Icon size={10} strokeWidth={2} style={{ color: n.color }} />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug">
          <span className="font-semibold text-text-primary">{n.user} </span>
          <span className="text-text-secondary">{n.text}</span>
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">{n.time}</p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />
      )}
    </div>
  );
}
