"use client";

const GAMES = [
  { title: "Үг Таавар", emoji: "🔤", genre: "Хэл", players: 1240, desc: "Монгол хэлний 5 үсэгтэй үгийг 6 оролдлогоор тааварла. Wordle загварт тоглоом.", color: "#e8415a", available: true },
  { title: "Дурын Асуулт", emoji: "❓", genre: "Нийгмийн", players: 867, desc: "Тандашгүй асуултуудад хариулж, бусад тоглогчидтой харьцуул. Хамтдаа инэмсэглэ.", color: "#9b59ff", available: true },
  { title: "Дуртай Дүр", emoji: "🎭", genre: "Тааварлалт", players: 534, desc: "Нэр хүндтэй дүрийг бусад тоглогчид тааварлах ёстой. Монгол болон дэлхийн соёлын дүрүүд.", color: "#f0c040", available: false },
  { title: "Нууц Найз", emoji: "🎁", genre: "Нийгмийн", players: 0, desc: "Танихгүй хүнд бэлэг хүргэх тоглоом. Солонго-гийн хэрэглэгчдийн дунд хийнэ.", color: "#3cc878", available: false },
];

export default function GamesPage() {
  return (
    <div className="max-w-[860px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2.5">
          <h1 className="font-serif text-[26px] font-bold">Тоглоомын Орон</h1>
          <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">✨ Beta</span>
        </div>
        <p className="text-text-secondary text-sm">Premium гишүүд онцгой тоглоомуудад хандах эрхтэй. Шинэ тоглоом сар бүр нэмэгдэнэ!</p>
      </div>

      {/* Leaderboard teaser */}
      <div className="bg-[rgba(17,14,30,0.88)] backdrop-blur-[24px] border border-[rgba(200,48,90,0.45)] shadow-[0_0_0_1px_rgba(200,48,90,0.08),0_0_40px_rgba(200,48,90,0.18),inset_0_0_40px_rgba(200,48,90,0.05)] rounded-[22px] px-6 py-5 mb-7 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold text-text-muted tracking-[0.05em] mb-1">ЭНЭ ДОЛОО ХОНОГИЙН ТОП ТОГЛОГЧ</div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏆</span>
            <span className="font-serif text-xl font-bold">
              <span className="bg-gradient-to-br from-[#e8b850] to-[#c48830] bg-clip-text text-transparent">munkh_22</span>
            </span>
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">1,240 оноо</span>
          </div>
        </div>
        <button className="bg-gradient-to-br from-[#e8b850] to-[#b87820] text-[#1a0f00] border-none rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(212,160,64,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_35px_rgba(212,160,64,0.45)] px-5 py-2.5">
          Рейтинг харах
        </button>
      </div>

      {/* Games grid */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {GAMES.map((g, i) => (
          <div key={i} className={`bg-bg-card border border-white/[0.06] rounded-[22px] p-6 relative transition-all duration-[250ms] ${g.available ? "opacity-100" : "opacity-70"}`}
            onMouseEnter={e => g.available && (e.currentTarget.style.borderColor = `${g.color}40`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
          >
            {!g.available && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-[2px] z-[2] bg-[rgba(10,10,15,0.5)]">
                <span className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-bold tracking-[0.05em] uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">🔒 Удахгүй</span>
              </div>
            )}
            <div className="flex gap-3.5 items-start">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[28px] shrink-0"
                style={{ background: `${g.color}18`, border: `1px solid ${g.color}30` }}>
                {g.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-serif text-lg font-bold">{g.title}</h3>
                  <span className="px-2 py-px rounded-full text-[11px] font-semibold"
                    style={{ background: `${g.color}15`, color: g.color, border: `1px solid ${g.color}25` }}>
                    {g.genre}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary leading-[1.6] mb-3.5">{g.desc}</p>
                <div className="flex justify-between items-center">
                  {g.available && <span className="text-xs text-text-muted">👥 {g.players.toLocaleString()} онлайн</span>}
                  {g.available && (
                    <button className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-[13px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-[18px] py-2">
                      Тоглох →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-7 bg-bg-card border border-white/[0.06] rounded-[22px] p-7 text-center">
        <div className="text-[36px] mb-3">🚀</div>
        <h3 className="font-serif text-xl font-bold mb-2">Шинэ тоглоом хүлээж байна?</h3>
        <p className="text-text-secondary text-sm mb-4">Санаа байгаа бол бидэнд мэдэгдэ. Хамгийн олон санал авсан тоглоомыг хамгийн эхэнд хийнэ!</p>
        <button className="bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-sm cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light px-6 py-2.5">
          💡 Санаа илгээх
        </button>
      </div>
    </div>
  );
}
