"use client";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { chatApi, ChatRoom, ChatMessage } from "@/lib/api";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

function resolveAvatar(avatar?: string): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function roomDisplayName(room: ChatRoom): string {
  if (room.type === "direct") {
    return room.counterpart?.name ?? room.counterpart?.username ?? room.title ?? "Чат";
  }
  return room.title ?? "Групп чат";
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("mn", { hour: "2-digit", minute: "2-digit" });
}

function formatListTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Одоо";
  if (diffMin < 60) return `${diffMin} мин`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} цаг`;
  return `${Math.floor(diffH / 24)} өдөр`;
}

function Avatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
}) {
  const resolved = resolveAvatar(src ?? undefined);
  const initials = (name ?? "?").slice(0, 1).toUpperCase();

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name ?? ""}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 bg-[rgba(200,48,90,0.15)] border border-[rgba(200,48,90,0.3)] text-[#e8415a] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeRoomRef = useRef<ChatRoom | null>(null);
  const sentMessageIds = useRef<Set<string>>(new Set());

  // Keep ref in sync for socket handler closure
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Socket setup
  useEffect(() => {
    const socket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("chat:message", (msg: ChatMessage) => {
      // Skip messages we already added by replacing the optimistic via REST
      if (sentMessageIds.current.has(msg._id)) {
        sentMessageIds.current.delete(msg._id);
        return;
      }
      const current = activeRoomRef.current;
      if (current && msg.room === current._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      // Update last message in room list
      setRooms((prev) =>
        prev.map((r) =>
          r._id === msg.room
            ? {
              ...r,
              lastMessage: {
                _id: msg._id,
                body: msg.body,
                sender: msg.sender,
                createdAt: msg.createdAt,
              },
              unread: activeRoomRef.current?._id !== msg.room ? true : r.unread,
            }
            : r
        )
      );
    });

    socket.on("user:online", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("user:offline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Load chat list
  useEffect(() => {
    setRoomsLoading(true);
    chatApi
      .listChats()
      .then((res) => setRooms(res.data ?? []))
      .catch(() => { })
      .finally(() => setRoomsLoading(false));
  }, []);

  // Handle ?user= query param after rooms load
  useEffect(() => {
    const userId = searchParams.get("user");
    if (!userId || roomsLoading) return;

    chatApi
      .createDirect(userId)
      .then((res) => {
        const room = res.data;
        setRooms((prev) => {
          const exists = prev.find((r) => r._id === room._id);
          return exists ? prev : [room, ...prev];
        });
        openRoom(room);
      })
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomsLoading]);

  const openRoom = useCallback(async (room: ChatRoom) => {
    setActiveRoom(room);
    setMobileView("chat");
    setMessages([]);
    setMsgsLoading(true);

    try {
      const res = await chatApi.getMessages(room._id);
      // API returns newest-first; reverse to show oldest at top
      setMessages([...(res.data ?? [])].reverse());
    } catch {
      // ignore
    } finally {
      setMsgsLoading(false);
    }

    // Mark as read
    chatApi.markRead(room._id).catch(() => { });
    setRooms((prev) =>
      prev.map((r) => (r._id === room._id ? { ...r, unread: false } : r))
    );
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = async () => {
    if (!input.trim() || !activeRoom || sending) return;
    const body = input.trim();
    setInput("");
    setSending(true);

    // Optimistic message
    const optimistic: ChatMessage = {
      _id: `opt-${Date.now()}`,
      room: activeRoom._id,
      sender: {
        _id: user?._id ?? "",
        name: user?.name,
        avatar: user?.avatar,
      },
      type: "text",
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await chatApi.sendMessage(activeRoom._id, body);
      sentMessageIds.current.add(res.data._id);
      setMessages((prev) => {
        const socketAlreadyAdded = prev.some((m) => m._id === res.data._id);
        if (socketAlreadyAdded) {
          // Socket beat REST — real message already in list, just drop the optimistic
          return prev.filter((m) => m._id !== optimistic._id);
        }
        // REST beat socket — replace optimistic; sentMessageIds will block socket
        return prev.map((m) => (m._id === optimistic._id ? res.data : m));
      });
    } catch {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setInput(body);
    } finally {
      setSending(false);
    }
  };

  const isOnline = (room: ChatRoom) => {
    if (room.type === "direct" && room.counterpart) {
      return onlineUsers.has(room.counterpart._id);
    }
    return false;
  };

  const activeIsOnline = activeRoom ? isOnline(activeRoom) : false;

  const handleDeleteConfirm = async () => {
    if (!activeRoom || deleting) return;
    setDeleting(true);
    await chatApi.deleteChat(activeRoom._id).catch(() => {});
    setRooms((prev) => prev.filter((r) => r._id !== activeRoom._id));
    setActiveRoom(null);
    setMessages([]);
    setMobileView("list");
    setConfirmDelete(false);
    setDeleting(false);
  };

  return (
    <>
    {confirmDelete && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-[8px]"
        style={{ background: "rgba(4,2,10,0.85)" }}
        onClick={() => setConfirmDelete(false)}>
        <div className="bg-[rgba(17,14,30,0.98)] border border-white/[0.08] rounded-[24px] p-7 w-full max-w-[340px] text-center"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
          onClick={e => e.stopPropagation()}>
          <div className="text-[36px] mb-3">🗑️</div>
          <h3 className="font-serif text-[18px] font-bold mb-2">Чат устгах уу?</h3>
          <p className="text-text-secondary text-[13px] leading-relaxed mb-6">
            <strong className="text-white">{activeRoom ? roomDisplayName(activeRoom) : ""}</strong>-тай харилцсан бүх мессеж устна. Буцаах боломжгүй.
          </p>
          <div className="flex gap-2.5">
            <button onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2.5 rounded-[14px] text-[13px] font-medium text-text-secondary border border-white/[0.1] hover:text-text-primary transition-colors">
              Болих
            </button>
            <button onClick={handleDeleteConfirm} disabled={deleting}
              className="flex-1 py-2.5 rounded-[14px] text-[13px] font-bold text-white disabled:opacity-60 transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#e8415a,#9e1838)", boxShadow: "0 4px 16px rgba(200,37,74,0.4)" }}>
              {deleting ? "Устгаж байна..." : "Устгах"}
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="flex gap-4 h-[calc(100vh-168px)] md:h-[calc(100vh-100px)]">
      {/* ── Room list ── */}
      <div
        className={`w-[280px] shrink-0 bg-bg-card border border-white/[0.06] rounded-[22px] flex flex-col overflow-hidden
          ${mobileView === "chat" ? "max-md:hidden" : ""} max-md:w-full`}
      >
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-[15px] font-bold mb-2.5">Чатууд</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <Spinner />
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted text-sm px-4 text-center">
              <span className="text-3xl">💬</span>
              <span>Одоогоор чат байхгүй байна</span>
            </div>
          ) : (
            rooms.map((room) => {
              const name = roomDisplayName(room);
              const avatarSrc = room.type === "direct" ? room.counterpart?.avatar : undefined;
              const online = isOnline(room);
              const isActive = activeRoom?._id === room._id;

              return (
                <div
                  key={room._id}
                  onClick={() => openRoom(room)}
                  className="px-3.5 py-3 cursor-pointer transition-all duration-[180ms] hover:bg-white/[0.03]"
                  style={{
                    background: isActive ? "rgba(232,65,90,0.08)" : "transparent",
                    borderLeft: isActive
                      ? "2px solid var(--accent-primary)"
                      : "2px solid transparent",
                  }}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className="relative shrink-0">
                      <Avatar src={avatarSrc} name={name} size={40} />
                      {online && (
                        <div className="absolute bottom-px right-px w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-semibold truncate">{name}</span>
                        <span className="text-[10px] text-text-muted shrink-0 ml-1">
                          {room.lastMessage
                            ? formatListTime(room.lastMessage.createdAt)
                            : formatListTime(room.updatedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-xs text-text-muted truncate max-w-[150px]">
                          {room.lastMessage?.body ?? ""}
                        </span>
                        {room.unread && (
                          <span className="bg-accent text-white rounded-full text-[10px] font-bold px-1.5 py-px shrink-0 ml-1">
                            •
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div
        className={`flex-1 min-w-0 bg-bg-card border border-white/[0.06] rounded-[22px] flex flex-col overflow-hidden
          ${mobileView === "list" ? "max-md:hidden" : ""} max-md:w-full`}
      >
        {!activeRoom ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
            <span className="text-5xl">💬</span>
            <span className="text-sm">Чат сонгоно уу</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
              <button
                onClick={() => setMobileView("list")}
                className="hidden max-md:block bg-transparent border-none cursor-pointer text-xl text-text-secondary px-1 leading-none"
              >
                ←
              </button>
              <div className="relative">
                <Avatar
                  src={
                    activeRoom.type === "direct"
                      ? activeRoom.counterpart?.avatar
                      : undefined
                  }
                  name={roomDisplayName(activeRoom)}
                  size={40}
                />
                {activeIsOnline && (
                  <div className="absolute bottom-px right-px w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {roomDisplayName(activeRoom)}
                </div>
                <div
                  className={`text-[11px] ${activeIsOnline ? "text-green-400" : "text-text-muted"
                    }`}
                >
                  {activeIsOnline ? "● Онлайн" : "Офлайн"}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="bg-transparent border border-white/[0.1] rounded-full w-[34px] h-[34px] cursor-pointer text-sm text-text-secondary flex items-center justify-center hover:border-[rgba(232,65,90,0.4)] hover:text-[#e8415a] transition-colors"
                  title="Чат устгах"
                >
                  🗑
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2.5">
              {msgsLoading ? (
                <Spinner />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted text-sm">
                  <span className="text-3xl">👋</span>
                  <span>Мессеж илгээж яриа эхлүүлнэ үү</span>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender._id === user?._id;
                  const senderName =
                    msg.sender.name ?? msg.sender.username ?? "Хэрэглэгч";

                  return (
                    <div
                      key={idx}
                      className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"
                        }`}
                    >
                      {!isMe && (
                        <Avatar
                          src={msg.sender.avatar}
                          name={senderName}
                          size={28}
                        />
                      )}
                      <div className={isMe ? "items-end flex flex-col" : "items-start flex flex-col"}>
                        <div
                          className={
                            isMe
                              ? "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-sm leading-relaxed bg-gradient-to-br from-[#c8305a] to-[#a0204a] text-white shadow-[0_4px_16px_rgba(200,48,90,0.3)]"
                              : "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm leading-relaxed bg-bg-elevated text-text-primary border border-white/[0.07]"
                          }
                        >
                          {msg.body}
                        </div>
                        <div
                          className={`text-[10px] text-text-muted mt-0.5 ${isMe ? "text-right" : "text-left"
                            }`}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.06] flex gap-2 items-center">
              <input
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-2.5 rounded-lg font-[inherit] text-sm transition-[border-color,box-shadow] duration-200 outline-none flex-1 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]"
                placeholder="Мессеж бичих..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg()}
                disabled={sending}
              />
              <button
                onClick={sendMsg}
                disabled={sending || !input.trim()}
                className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-[13px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-4 py-2.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Илгээх ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
