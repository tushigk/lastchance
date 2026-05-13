"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { notificationApi, AppNotification } from "@/lib/api";
import { useAuth } from "./AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

interface NotificationContextValue {
  notifs: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    notificationApi.list().then(res => setNotifs(res.data)).catch(() => {}).finally(() => setLoading(false));

    const socket = io(BASE_URL, { withCredentials: true, reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("notification:new", (notif: AppNotification) => {
      setNotifs(prev => prev.some(n => n._id === notif._id) ? prev : [notif, ...prev]);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [user?._id]);

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    notificationApi.markRead(id).catch(() => {});
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    notificationApi.markAllRead().catch(() => {});
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifs, unreadCount, loading, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
