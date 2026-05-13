"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Send, Trash2 } from "lucide-react";
import { networkApi, NetworkPost, NetworkComment } from "@/lib/api";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

const CATEGORIES = [
  { id: "new", label: "✨ Шинэ", color: "#3cc878" },
  { id: "hot", label: "🔥 Халуун", color: "#e8415a" },
  { id: "breakup", label: "💔 Харилцаа", color: "#ff6b35" },
  { id: "friends", label: "👥 Найзлалт", color: "#9b59ff" },
];

const CAT_LABELS: Record<string, string> = { breakup: "💔 Харилцаа", friends: "👥 Найзлалт" };

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  return `${Math.floor(diff / 86400)} өдрийн өмнө`;
}

function resolveAvatar(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function AuthorAvatar({ author, size = 32 }: { author: { name?: string; username?: string; avatar?: string }; size?: number }) {
  const letter = (author.name ?? author.username ?? "?")[0].toUpperCase();
  const src = resolveAvatar(author.avatar);
  return (
    <div className="rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: "linear-gradient(135deg,#c8254a,#780f20)" }}>
      {src ? <img src={src} className="w-full h-full object-cover" alt="" /> : letter}
    </div>
  );
}

function CommentSection({ post, currentUserId }: { post: NetworkPost; currentUserId?: string }) {
  const [comments, setComments] = useState<NetworkComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    networkApi.listComments(post._id).then(res => {
      setComments(res.data.slice().reverse());
    }).catch(() => { }).finally(() => setLoading(false));
  }, [post._id]);

  async function submit() {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await networkApi.createComment(post._id, message.trim());
      setComments(prev => [...prev, res.data]);
      setMessage("");
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  async function removeComment(id: string) {
    await networkApi.deleteComment(id).catch(() => { });
    setComments(prev => prev.filter(c => c._id !== id));
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.06]">
      {loading ? (
        <div className="flex justify-center py-3"><Loader2 size={18} className="animate-spin text-[#c8254a]" /></div>
      ) : (
        <div className="flex flex-col gap-2 mb-3 max-h-[260px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
          {comments.length === 0 && (
            <p className="text-[12px] text-text-muted text-center py-2">Коммент байхгүй байна</p>
          )}
          {comments.map(c => (
            <div key={c._id} className="flex gap-2 items-start group">
              <AuthorAvatar author={c.user} size={26} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[12px] font-semibold text-text-primary">
                    {c.isAiGenerated ? "🤖 AI" : (c.user.name ?? c.user.username)}
                  </span>
                  <span className="text-[10px] text-text-muted">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">{c.message}</p>
              </div>
              {c.user._id === currentUserId && (
                <button onClick={() => removeComment(c._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-[#e8415a] p-0.5">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder="Коммент бичих..."
          className="flex-1 bg-[rgba(255,255,255,0.04)] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-[rgba(200,37,74,0.4)]"
        />
        <button onClick={submit} disabled={submitting || !message.trim()}
          className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#c8254a,#780f20)" }}>
          {submitting ? <Loader2 size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
        </button>
      </div>
    </div>
  );
}

function PostCard({ post: initialPost, currentUserId, onDelete }: {
  post: NetworkPost;
  currentUserId?: string;
  onDelete: (id: string) => void;
}) {
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);

  async function toggleLike() {
    if (liking) return;
    setLiking(true);
    const wasLiked = post.likedByMe;
    setPost(p => ({ ...p, likedByMe: !wasLiked, likeCount: p.likeCount + (wasLiked ? -1 : 1) }));
    try {
      if (wasLiked) await networkApi.unlikePost(post._id);
      else await networkApi.likePost(post._id);
    } catch {
      setPost(p => ({ ...p, likedByMe: wasLiked, likeCount: p.likeCount + (wasLiked ? 1 : -1) }));
    }
    setLiking(false);
  }

  const author = post.createdBy;
  const isOwn = author._id === currentUserId;

  return (
    <div className="bg-bg-card border border-white/[0.05] rounded-[14px] p-4 transition-all duration-200 hover:border-[rgba(200,48,90,0.18)]">

      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-3">
        <Link href={`/profile/${author._id}`}>
          <AuthorAvatar author={author} size={32} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href={`/profile/${author._id}`}
              className="text-[13px] font-semibold text-text-primary truncate hover:text-[#e8415a] transition-colors">
              {author.name ?? author.username ?? "Хэрэглэгч"}
            </Link>
            {post.isPinned && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[rgba(232,184,80,0.12)] text-[#e8b850] border border-[rgba(232,184,80,0.25)]">
                📌 Тогтоосон
              </span>
            )}
            {post.category && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/[0.06] text-text-muted border border-white/[0.08]">
                {CAT_LABELS[post.category] ?? post.category}
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-muted">{timeAgo(post.createdAt)}</div>
        </div>
        {isOwn && (
          <button onClick={() => networkApi.deletePost(post._id).then(() => onDelete(post._id))}
            className="text-text-muted hover:text-[#e8415a] transition-colors p-1">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <h3 className="text-[15px] font-bold mb-1.5 font-serif leading-snug">{post.title}</h3>
      <p className="text-[13px] text-text-secondary leading-relaxed mb-3 line-clamp-3">{post.description}</p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={toggleLike} disabled={liking}
          className={`flex items-center gap-1.5 text-[13px] transition-colors ${post.likedByMe ? "text-[#e8415a]" : "text-text-muted hover:text-text-primary"}`}>
          {post.likedByMe ? "❤️" : "🤍"} {post.likeCount}
        </button>
        <button onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors">
          💬 {post.commentCount}
        </button>
      </div>

      {showComments && (
        <CommentSection post={post} currentUserId={currentUserId} />
      )}
    </div>
  );
}

export default function ForumPage() {
  const { user } = useAuth();
  const [cat, setCat] = useState("new");
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [newCat, setNewCat] = useState<"" | "breakup" | "friends">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    networkApi.listPosts(1, 50).then(res => {
      setPosts(res.data);
      setTotalPages(res.totalPages);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const res = await networkApi.listPosts(page + 1, 50);
      setPosts(prev => [...prev, ...res.data]);
      setPage(p => p + 1);
      setTotalPages(res.totalPages);
    } catch { /* ignore */ } finally {
      setLoadingMore(false);
    }
  }

  async function submitPost() {
    if (!title.trim() || !body.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await networkApi.createPost({
        title: title.trim(),
        description: body.trim(),
        category: newCat || undefined,
      });
      setPosts(prev => [res.data, ...prev]);
      setTitle(""); setBody(""); setNewCat(""); setShowModal(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  const displayed = (() => {
    if (cat === "hot") return [...posts].sort((a, b) => b.likeCount - a.likeCount);
    if (cat === "breakup") return posts.filter(p => p.category === "breakup");
    if (cat === "friends") return posts.filter(p => p.category === "friends");
    return posts;
  })();

  return (
    <div className="max-w-[860px] mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-[22px] font-bold">Нийгэмлэгийн Forum</h1>
          <p className="text-text-secondary text-[13px] mt-0.5">Санаа бодлоо чөлөөтэй хуваалц</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="shrink-0 text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all hover:-translate-y-0.5 px-4 py-2.5 bg-[linear-gradient(135deg,#d4365a,#9a1c3e)] shadow-[0_4px_20px_rgba(200,48,90,0.35)]">
          ✏️ Бичих
        </button>
      </div>

      {/* New post modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-[8px] p-4 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setError(""); } }}
        >
          <div className="bg-[rgba(17,14,30,0.97)] border border-white/[0.06] rounded-[24px] p-6 w-full max-w-[560px] my-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-[20px] font-bold">Шинэ бичлэг</h3>
              <button onClick={() => { setShowModal(false); setError(""); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors text-[18px]">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-text-muted focus:border-[rgba(200,37,74,0.4)]"
                placeholder="Гарчиг..." />
              <textarea value={body} onChange={e => setBody(e.target.value)}
                className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-text-muted resize-none focus:border-[rgba(200,37,74,0.4)]"
                placeholder="Бичлэгийн агуулга..." rows={4} />

              {/* Category — custom buttons instead of native select to avoid mobile picker glitch */}
              <div className="flex gap-2">
                {[
                  { val: "" as const, label: "Ангилалгүй" },
                  { val: "breakup" as const, label: "💔 Харилцаа" },
                  { val: "friends" as const, label: "👥 Найзлалт" },
                ].map(opt => (
                  <button key={opt.val} type="button"
                    onClick={() => setNewCat(opt.val)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                    style={{
                      background: newCat === opt.val ? "rgba(200,37,74,0.15)" : "rgba(255,255,255,0.04)",
                      border: newCat === opt.val ? "1px solid rgba(200,37,74,0.45)" : "1px solid rgba(255,255,255,0.08)",
                      color: newCat === opt.val ? "#e8415a" : "var(--text-secondary)",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              {error && <p className="text-[12px] text-[#e8415a]">{error}</p>}
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => { setShowModal(false); setError(""); }}
                  className="bg-transparent text-text-primary border border-white/[0.12] rounded-xl font-medium text-[13px] cursor-pointer px-5 py-2.5">
                  Болих
                </button>
                <button onClick={submitPost} disabled={submitting || !title.trim() || !body.trim()}
                  className="text-white border-none rounded-xl font-semibold text-[13px] cursor-pointer px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 bg-[linear-gradient(135deg,#d4365a,#9a1c3e)]">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Нийтлэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className="px-3.5 py-[6px] rounded-full text-[13px] cursor-pointer transition-all shrink-0 whitespace-nowrap"
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
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-center text-text-muted py-16">Пост олдсонгүй</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {displayed.map(post => (
              <PostCard key={post._id} post={post} currentUserId={user?._id}
                onDelete={id => setPosts(prev => prev.filter(p => p._id !== id))} />
            ))}
          </div>

          {cat === "new" && page < totalPages && (
            <div className="flex justify-center mt-5">
              <button onClick={loadMore} disabled={loadingMore}
                className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary border border-white/[0.1] hover:border-[rgba(200,37,74,0.3)] hover:text-text-primary transition-all disabled:opacity-50 flex items-center gap-2">
                {loadingMore && <Loader2 size={14} className="animate-spin" />}
                Цааш үзэх
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
