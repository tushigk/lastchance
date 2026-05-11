"use client";
import { useState, useRef, useEffect } from "react";

const CONVERSATIONS = [
  { id: 1, name: "Oyunaa_96", avatar: "О", color: "#e8415a", last: "Маргааш уулзах боломжтой юу?", time: "2 мин", unread: 2, online: true },
  { id: 2, name: "Tsetseg_lit", avatar: "Ц", color: "#9b59ff", last: "Тэр ном маш сайн байсан ❤️", time: "15 мин", unread: 0, online: true },
  { id: 3, name: "Gantulga88", avatar: "Г", color: "#388add", last: "Тоглоомын рейтинг чинь өслөө!", time: "1 цаг", unread: 1, online: false },
  { id: 4, name: "Enkhjin_01", avatar: "Э", color: "#3cc878", last: "Хамт roleplay хийх үү?", time: "3 цаг", unread: 0, online: true },
];

const MOCK_MSGS: Record<number, { role: "me" | "them"; text: string; time: string }[]> = {
  1: [
    { role: "them", text: "Сайн байна уу! 👋 Таны профайл маш сонирхолтой байсан", time: "14:32" },
    { role: "me", text: "Сайн! Баярлалаа, тань ч бас 😊", time: "14:35" },
    { role: "them", text: "Аялалд дуртай гэж бичсэн байсан, сүүлд хаа явсан бэ?", time: "14:36" },
    { role: "me", text: "Хустайд явсан, маш гоё байсан! Та аяллын хамтрагч хайж байна уу?", time: "14:40" },
    { role: "them", text: "Маргааш уулзах боломжтой юу?", time: "14:55" },
  ],
  2: [
    { role: "them", text: "Тэр roleplay сценари маш гайхалтай байсан!", time: "12:00" },
    { role: "me", text: "Тийм ээ, 'Нуутай захидал' сценари дуртай минь!", time: "12:05" },
    { role: "them", text: "Тэр ном маш сайн байсан ❤️", time: "13:20" },
  ],
};

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MSGS[1] || []);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConv = (c: typeof CONVERSATIONS[0]) => {
    setActiveConv(c);
    setMessages(MOCK_MSGS[c.id] || []);
    setMobileView("chat");
  };

  const sendMsg = () => {
    if (!input.trim()) return;
    const newMsg = { role: "me" as const, text: input, time: new Date().toLocaleTimeString("mn", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(m => [...m, newMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "them" as const, text: "Тийм ээ, мэдээж! Маргааш 6 цагт тохиромжтой юу?", time: new Date().toLocaleTimeString("mn", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 2000);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-100px)]">
      {/* Conversation list */}
      <div
        className={`w-[280px] shrink-0 bg-bg-card border border-white/[0.06] rounded-[22px] flex flex-col overflow-hidden
          ${mobileView === "chat" ? "max-md:hidden" : ""} max-md:w-full`}
      >
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-[15px] font-bold mb-2.5">Чатууд</h3>
          <input
            className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-3 py-2 rounded-lg font-[inherit] text-[13px] transition-[border-color,box-shadow] duration-200 outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]"
            placeholder="🔍 Хайх..."
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map(c => (
            <div key={c.id} onClick={() => selectConv(c)} className="px-3.5 py-3 cursor-pointer transition-all duration-[180ms] hover:bg-white/[0.03]"
              style={{
                background: activeConv.id === c.id ? "rgba(232,65,90,0.08)" : "transparent",
                borderLeft: activeConv.id === c.id ? "2px solid var(--accent-primary)" : "2px solid transparent",
              }}>
              <div className="flex gap-2.5 items-start">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold"
                    style={{ background: `${c.color}22`, border: `1px solid ${c.color}44`, color: c.color }}>
                    {c.avatar}
                  </div>
                  {c.online && <div className="absolute bottom-px right-px w-2.5 h-2.5 bg-green rounded-full border-2 border-bg-primary animate-glow-pulse" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-semibold">{c.name}</span>
                    <span className="text-[10px] text-text-muted">{c.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-xs text-text-muted truncate max-w-[150px]">{c.last}</span>
                    {c.unread > 0 && (
                      <span className="bg-accent text-white rounded-full text-[10px] font-bold px-1.5 py-px shrink-0">{c.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 min-w-0 bg-bg-card border border-white/[0.06] rounded-[22px] flex flex-col overflow-hidden
          ${mobileView === "list" ? "max-md:hidden" : ""} max-md:w-full`}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
          <button
            onClick={() => setMobileView("list")}
            className="hidden max-md:block bg-transparent border-none cursor-pointer text-xl text-text-secondary px-1 leading-none"
          >←</button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold"
              style={{ background: `${activeConv.color}22`, border: `1px solid ${activeConv.color}44`, color: activeConv.color }}>
              {activeConv.avatar}
            </div>
            {activeConv.online && <div className="absolute bottom-px right-px w-2.5 h-2.5 bg-green rounded-full border-2 border-bg-primary animate-glow-pulse" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{activeConv.name}</div>
            <div className={`text-[11px] ${activeConv.online ? "text-green" : "text-text-muted"}`}>
              {activeConv.online ? "● Онлайн" : "Сүүлд ирсэн цаг"}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="bg-transparent border border-white/[0.1] rounded-full w-[34px] h-[34px] cursor-pointer text-sm text-text-secondary flex items-center justify-center">📞</button>
            <button className="bg-transparent border border-white/[0.1] rounded-full w-[34px] h-[34px] cursor-pointer text-sm text-text-secondary flex items-center justify-center">⋯</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2.5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 items-end ${m.role === "me" ? "justify-end" : "justify-start"}`}>
              {m.role === "them" && (
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `${activeConv.color}22`, border: `1px solid ${activeConv.color}44`, color: activeConv.color }}>
                  {activeConv.avatar}
                </div>
              )}
              <div>
                <div className={m.role === "me"
                  ? "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-sm leading-relaxed bg-gradient-to-br from-[#c8305a] to-[#a0204a] text-white shadow-[0_4px_16px_rgba(200,48,90,0.3)]"
                  : "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm leading-relaxed bg-bg-elevated text-text-primary border border-white/[0.07]"
                }>
                  {m.text}
                </div>
                <div className={`text-[10px] text-text-muted mt-0.5 ${m.role === "me" ? "text-right" : "text-left"}`}>{m.time}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: `${activeConv.color}22`, color: activeConv.color }}>
                {activeConv.avatar}
              </div>
              <div className="max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm bg-bg-elevated border border-white/[0.07]">
                <span className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted animate-glow-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex gap-2 items-center">
          <button className="bg-transparent border-none cursor-pointer text-xl shrink-0">😊</button>
          <input
            className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-2.5 rounded-lg font-[inherit] text-sm transition-[border-color,box-shadow] duration-200 outline-none flex-1 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]"
            placeholder="Мессеж бичих..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMsg()}
          />
          <button
            onClick={sendMsg}
            className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-[13px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-4 py-2.5 shrink-0"
          >
            Илгээх ➤
          </button>
        </div>
      </div>
    </div>
  );
}
