"use client";
import { useState } from "react";

const CATEGORIES = [
  { id: "hot", label: "🔥 Халуун", color: "#e8415a" },
  { id: "new", label: "✨ Шинэ", color: "#3cc878" },
  { id: "relationships", label: "❤️ Харилцаа", color: "#ff6b35" },
  { id: "ub", label: "🏙️ УБ амьдрал", color: "#9b59ff" },
  { id: "travel", label: "✈️ Аялал", color: "#388add" },
  { id: "anon", label: "🎭 Нэргүй", color: "#f0c040" },
];

const POSTS = [
  { id: 1, category: "relationships", anon: false, author: "Narantsetseg", avatar: "Н", authorColor: "#e8415a", title: "Удаан харилцааны дараа хэрхэн дахин итгэлтэй болох вэ?", body: "3 жил болсон харилцаа дуусгавар болсны дараа яаж дахин нэгнийг таних эр зоригийг олох вэ? Ижил туршлагатай хүмүүс санал бодлоо хуваалцаарай.", likes: 142, comments: 38, hot: true, time: "2 цаг өмнө", tags: ["Зөвлөгөө", "Харилцаа"] },
  { id: 2, category: "ub", anon: true, author: "Нэргүй_хэрэглэгч", avatar: "?", authorColor: "#9b59ff", title: "Нийслэлд шинэ хүн танихын хэцүүлэг", body: "УБ-д 2 жил болсон ч гэсэн жинхэнэ найз олоогүй хэвээр байна. Хаанаас хайх вэ?", likes: 89, comments: 22, hot: false, time: "4 цаг өмнө", tags: ["УБ", "Найзлалт"] },
  { id: 3, category: "travel", anon: false, author: "Gantulga_traveler", avatar: "Г", authorColor: "#388add", title: "Хөвсгөлд 5 хоног аялах хамтрагч хайж байна — 2 суудал байна", body: "8 дугаар сарын 15-20-нд нуурын баг руу явна. 2 суудал чөлөөтэй байна.", likes: 67, comments: 31, hot: false, time: "1 өдрийн өмнө", tags: ["Аялал", "Хөвсгөл"] },
  { id: 4, category: "anon", anon: true, author: "Нэргүй_хэрэглэгч", avatar: "?", authorColor: "#f0c040", title: "[18+] Эхний удаагийн нервийг хэрхэн арилгах вэ?", body: "Маш их санаа зовлонтой байна. Зөвлөгөө өгч чадах хүн байна уу?", likes: 203, comments: 67, hot: true, time: "30 мин өмнө", tags: ["18+", "Зөвлөгөө"] },
  { id: 5, category: "relationships", anon: false, author: "Oyunaa_96", avatar: "О", authorColor: "#3cc878", title: "Roleplay-оос жинхэнэ харилцаа болсон хүн байна уу?", body: "Солонго дээр roleplay хийж байгаад жинхэнэ дотуур болсон хүн байна уу?", likes: 156, comments: 44, hot: false, time: "3 цаг өмнө", tags: ["Roleplay", "Харилцаа"] },
];

export default function ForumPage() {
  const [cat, setCat] = useState("hot");
  const [newPost, setNewPost] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) =>
    setLiked(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const filtered = cat === "hot" ? POSTS.filter(p => p.hot || p.likes > 100) : POSTS;

  return (
    <div className="max-w-[820px] mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-serif text-[26px] font-bold mb-1.5">Нийгэмлэгийн Forum</h1>
          <p className="text-text-secondary text-sm">Санаа бодлоо чөлөөтэй хуваалц</p>
        </div>
        <button
          onClick={() => setNewPost(true)}
          className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-sm cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-5 py-2.5"
        >
          ✏️ Бичих
        </button>
      </div>

      {/* New post modal */}
      {newPost && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-[8px] p-6">
          <div className="bg-[rgba(17,14,30,0.88)] backdrop-blur-[24px] border border-white/[0.06] rounded-[32px] p-8 w-full max-w-[560px]">
            <h3 className="font-serif text-[22px] font-bold mb-5">Шинэ бичлэг</h3>
            <div className="flex flex-col gap-3.5">
              <input
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)] transition-[border-color,box-shadow] duration-200"
                placeholder="Гарчиг..."
              />
              <textarea
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)] transition-[border-color,box-shadow] duration-200 resize-y"
                placeholder="Бичлэгийн агуулга..."
                rows={5}
              />
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-secondary">
                <input type="checkbox" /> Нэргүй нийтлэх
              </label>
              <div className="flex gap-2.5 justify-end">
                <button
                  onClick={() => setNewPost(false)}
                  className="bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-sm cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light px-7 py-3"
                >Болих</button>
                <button
                  onClick={() => setNewPost(false)}
                  className="bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-sm cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-7 py-3"
                >Нийтлэх</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-5">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className="px-4 py-[7px] rounded-full text-[13px] cursor-pointer transition-all duration-[180ms]"
            style={{
              background: cat === c.id ? `${c.color}18` : "transparent",
              border: cat === c.id ? `1px solid ${c.color}50` : "1px solid rgba(255,255,255,0.1)",
              color: cat === c.id ? c.color : "var(--text-secondary)",
              fontWeight: cat === c.id ? 600 : 400,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {filtered.map(post => (
          <div key={post.id} className="bg-bg-card border border-white/[0.05] rounded-[14px] p-5 transition-all duration-200 hover:border-[rgba(200,48,90,0.2)] hover:bg-bg-elevated hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            {/* Author */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{
                  background: post.anon ? "rgba(255,255,255,0.08)" : `${post.authorColor}22`,
                  border: `1px solid ${post.anon ? "rgba(255,255,255,0.1)" : `${post.authorColor}40`}`,
                  color: post.authorColor,
                }}>
                {post.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[13px] font-semibold ${post.anon ? "text-text-muted" : "text-text-primary"}`}>
                    {post.author}
                  </span>
                  {post.anon && <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[9px] font-bold tracking-[0.05em] uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">Нэргүй</span>}
                  {post.hot && <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[9px] font-bold tracking-[0.05em] uppercase bg-[rgba(200,48,90,0.15)] text-[#e04878] border border-[rgba(200,48,90,0.3)]">🔥 Халуун</span>}
                </div>
                <div className="text-[11px] text-text-muted">{post.time}</div>
              </div>
              <div className="flex gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="px-2 py-[3px] rounded-full text-[11px] bg-white/[0.06] text-text-muted">{t}</span>
                ))}
              </div>
            </div>
            <h3 className="text-base font-bold mb-2 font-serif">{post.title}</h3>
            <p className="text-sm text-text-secondary leading-[1.65] mb-3.5">{post.body}</p>
            <div className="flex gap-4 items-center">
              <button onClick={() => toggleLike(post.id)}
                className={`bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[13px] transition-colors duration-[180ms] ${liked.includes(post.id) ? "text-[#e8415a]" : "text-text-muted"}`}>
                {liked.includes(post.id) ? "❤️" : "🤍"} {post.likes + (liked.includes(post.id) ? 1 : 0)}
              </button>
              <button className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[13px] text-text-muted">
                💬 {post.comments} хариулт
              </button>
              <button className="bg-transparent border-none cursor-pointer text-[13px] text-text-muted ml-auto">
                🔗 Хуваалцах
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
