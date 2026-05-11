"use client";
import { useState } from "react";

const SCENARIOS = [
  { id: 1, title: "Нууцлаг Кафе", desc: "Шөнийн кафенд хоёр харь хүн тохиолдсоор...", genre: "Романтик", emoji: "☕", color: "#e8415a", plays: 1240, rating: 4.8 },
  { id: 2, title: "Дасгал заалны уулзалт", desc: "Шөнө дасгал хийж байтал нэг хүн хандна...", genre: "Дэгжин", emoji: "🏋️", color: "#3cc878", plays: 867, rating: 4.6 },
  { id: 3, title: "Ажлын байрны нууц", desc: "Хоёр хамт ажиллагч нь хоорондоо нуусан зүйлтэй...", genre: "Дарамт", emoji: "💼", color: "#9b59ff", plays: 2103, rating: 4.9 },
  { id: 4, title: "Хорвоогийн эзэд", desc: "Уран зохиолын дэлхийд хоёр сонгогдсон хүн...", genre: "Фэнтэзи", emoji: "🐉", color: "#f0c040", plays: 534, rating: 4.5 },
  { id: 5, title: "Шөнийн галт тэрэг", desc: "Улаанбаатараас нисэх галт тэрэгний купэд...", genre: "Сэтгэл хөдлөл", emoji: "🚂", color: "#ff6b35", plays: 789, rating: 4.7 },
  { id: 6, title: "Нуутай захидал", desc: "Нуутай захидлаар харилцаж байсан хоёр хүн нүүр тулна...", genre: "Романтик", emoji: "💌", color: "#388add", plays: 1567, rating: 4.9 },
];

const GENRES = ["Бүгд", "Романтик", "Дэгжин", "Дарамт", "Фэнтэзи", "Сэтгэл хөдлөл"];

export default function RoleplayPage() {
  const [filter, setFilter] = useState("Бүгд");
  const [active, setActive] = useState<number | null>(null);
  const [messages, setMessages] = useState([
    { role: "system", text: "Тавтай морил! Та кафенд ширээний өмнө суусан байна. Хажуугийн ширээнд нэгэн харь хүн сонирхолтой ном уншиж байна..." }
  ]);
  const [input, setInput] = useState("");

  const filtered = filter === "Бүгд" ? SCENARIOS : SCENARIOS.filter(s => s.genre === filter);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: "Тэр хүн номноосоо нүдээ өргөж, тийм инэмсэглэлээр хариулна: \"Сайн байна уу? Энэ ном маш сонирхолтой байна... та унших дуртай юу?\"" }]);
    }, 1200);
  };

  if (active !== null) {
    const scenario = SCENARIOS.find(s => s.id === active)!;
    return (
      <div className="max-w-[720px] mx-auto flex flex-col h-[calc(100vh-180px)]">
        <div className="bg-bg-card border border-white/[0.06] rounded-[22px] p-4 mb-4 flex items-center gap-3.5">
          <button onClick={() => setActive(null)}
            className="bg-transparent border border-white/[0.1] rounded-full w-[34px] h-[34px] cursor-pointer text-text-secondary text-base flex items-center justify-center">←</button>
          <span className="text-[28px]">{scenario.emoji}</span>
          <div>
            <h3 className="font-serif text-lg font-bold">{scenario.title}</h3>
            <span className="text-[10px] font-semibold px-2 py-px rounded-full"
              style={{ background: `${scenario.color}18`, color: scenario.color, border: `1px solid ${scenario.color}30` }}>
              {scenario.genre}
            </span>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(139,63,212,0.12)] text-[#a855f7] border border-[rgba(139,63,212,0.25)]">🤖 AI Туслагч</span>
          </div>
        </div>

        <div className="flex-1 bg-bg-card border border-white/[0.06] rounded-[22px] p-5 overflow-y-auto flex flex-col gap-3.5 mb-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role !== "user" && (
                <div className={`w-7 h-7 rounded-full mr-2 shrink-0 flex items-center justify-center text-xs ${m.role === "system" ? "bg-[linear-gradient(135deg,rgba(155,89,255,0.3),rgba(232,65,90,0.3))]" : "bg-[linear-gradient(135deg,#9b59ff,#7c3aed)]"}`}>
                  {m.role === "system" ? "📖" : "🤖"}
                </div>
              )}
              <div className={m.role === "user"
                ? "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-sm leading-relaxed bg-gradient-to-br from-[#c8305a] to-[#a0204a] text-white shadow-[0_4px_16px_rgba(200,48,90,0.3)]"
                : m.role === "system"
                  ? "max-w-[85%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-[13px] italic leading-relaxed border border-[rgba(155,89,255,0.2)] text-text-secondary bg-[rgba(155,89,255,0.1)]"
                  : "max-w-[70%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm leading-relaxed bg-bg-elevated text-text-primary border border-white/[0.07]"
              }>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <input
            className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm outline-none flex-1 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)] transition-[border-color,box-shadow] duration-200"
            placeholder="Тайлбарлах эсвэл хариулах..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-sm cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-5 py-3 shrink-0"
          >
            Илгээх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-7">
        <h1 className="font-serif text-[26px] font-bold mb-1.5">Roleplay Орон</h1>
        <p className="text-text-secondary text-sm">Дуртай дүрээрээ орж, AI-тай хамтаар туршилт хий</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {GENRES.map(g => (
          <button key={g} onClick={() => setFilter(g)}
            className={`px-4 py-[7px] rounded-full text-[13px] cursor-pointer transition-all duration-[180ms] ${
              filter === g
                ? "bg-[rgba(232,65,90,0.15)] border border-[rgba(232,65,90,0.5)] text-[#e8415a] font-semibold"
                : "bg-transparent border border-[rgba(255,255,255,0.1)] text-text-secondary font-normal"
            }`}>
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {filtered.map(s => (
          <div key={s.id}
            className="bg-bg-card border border-white/[0.06] rounded-[22px] p-6 cursor-pointer transition-all duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_16px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(200,48,90,0.08)]"
            onClick={() => setActive(s.id)}>
            <div className="flex justify-between items-start mb-3.5">
              <span className="text-[40px]">{s.emoji}</span>
              <div className="text-right">
                <span className="px-2 py-[3px] rounded-full text-[11px] font-bold"
                  style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}>
                  {s.genre}
                </span>
                <div className="text-xs text-text-muted mt-1">⭐ {s.rating}</div>
              </div>
            </div>
            <h3 className="font-serif text-lg font-bold mb-2">{s.title}</h3>
            <p className="text-[13px] text-text-secondary leading-[1.6] mb-3.5">{s.desc}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-muted">🎭 {s.plays.toLocaleString()} удаа тоглосон</span>
              <button
                onClick={() => setActive(s.id)}
                className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-xs cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-4 py-[7px]"
              >
                Эхлэх →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
