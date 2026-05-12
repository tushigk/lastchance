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
  { id: 5, category: "relationships", anon: false, author: "Oyunaa_96", avatar: "О", authorColor: "#3cc878", title: "Roleplay-оос жинхэнэ харилцаа болсон хүн байна уу?", body: "Intimate дээр roleplay хийж байгаад жинхэнэ дотуур болсон хүн байна уу?", likes: 156, comments: 44, hot: false, time: "3 цаг өмнө", tags: ["Roleplay", "Харилцаа"] },
];

export default function ForumPage() {
  const [cat, setCat] = useState("hot");
  const [newPost, setNewPost] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) =>
    setLiked(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const filtered = cat === "hot" ? POSTS.filter(p => p.hot || p.likes > 100) : POSTS;

  return (
    <div className="max-w-[820px] mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="font-serif text-[22px] font-bold leading-tight truncate">Нийгэмлэгийн Forum</h1>
          <p className="text-text-secondary text-[13px] mt-0.5">Санаа бодлоо чөлөөтэй хуваалц</p>
        </div>
        <button
          onClick={() => setNewPost(true)}
          className="shrink-0 text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 px-4 py-2.5 bg-[linear-gradient(135deg,#d4365a,#9a1c3e)]"
        >
          ✏️ Бичих
        </button>
      </div>

      {/* New post modal */}
      {newPost && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center backdrop-blur-[8px] p-4">
          <div className="bg-[rgba(17,14,30,0.97)] border border-white/[0.06] rounded-[24px] p-6 w-full max-w-[560px]">
            <h3 className="font-serif text-[20px] font-bold mb-5">Шинэ бичлэг</h3>
            <div className="flex flex-col gap-3">
              <input
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-text-muted"
                placeholder="Гарчиг..."
              />
              <textarea
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-text-muted resize-none"
                placeholder="Бичлэгийн агуулга..."
                rows={4}
              />
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-secondary">
                <input type="checkbox" /> Нэргүй нийтлэх
              </label>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setNewPost(false)}
                  className="bg-transparent text-text-primary border border-white/[0.12] rounded-xl font-medium text-[13px] cursor-pointer px-5 py-2.5">
                  Болих
                </button>
                <button onClick={() => setNewPost(false)}
                  className="text-white border-none rounded-xl font-semibold text-[13px] cursor-pointer px-5 py-2.5 bg-[linear-gradient(135deg,#d4365a,#9a1c3e)]">
                  Нийтлэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 min-w-0" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className="px-3.5 py-[6px] rounded-full text-[13px] cursor-pointer transition-all duration-[180ms] shrink-0 whitespace-nowrap"
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
          <div key={post.id} className="bg-bg-card border border-white/[0.05] rounded-[14px] p-4 transition-all duration-200 hover:border-[rgba(200,48,90,0.2)] overflow-hidden min-w-0">

            {/* Author row */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                style={{
                  background: post.anon ? "rgba(255,255,255,0.08)" : `${post.authorColor}22`,
                  border: `1px solid ${post.anon ? "rgba(255,255,255,0.1)" : `${post.authorColor}40`}`,
                  color: post.authorColor,
                }}>
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[13px] font-semibold truncate ${post.anon ? "text-text-muted" : "text-text-primary"}`}>
                    {post.author}
                  </span>
                  {post.anon && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)] shrink-0">
                      Нэргүй
                    </span>
                  )}
                  {post.hot && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-[rgba(200,48,90,0.15)] text-[#e04878] border border-[rgba(200,48,90,0.3)] shrink-0">
                      🔥 Халуун
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-text-muted">{post.time}</div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-[15px] font-bold mb-1.5 font-serif leading-snug">{post.title}</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3 line-clamp-2">{post.body}</p>

            {/* Tags + actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] text-text-muted shrink-0">{t}</span>
              ))}
              <div className="flex gap-3 ml-auto shrink-0">
                <button onClick={() => toggleLike(post.id)}
                  className={`bg-transparent border-none cursor-pointer flex items-center gap-1 text-[13px] transition-colors duration-[180ms] ${liked.includes(post.id) ? "text-[#e8415a]" : "text-text-muted"}`}>
                  {liked.includes(post.id) ? "❤️" : "🤍"} {post.likes + (liked.includes(post.id) ? 1 : 0)}
                </button>
                <button className="bg-transparent border-none cursor-pointer flex items-center gap-1 text-[13px] text-text-muted">
                  💬 {post.comments}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
