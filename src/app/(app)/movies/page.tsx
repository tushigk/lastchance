"use client";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Lock, CheckCircle, X, Film, Zap, Package, ShoppingCart } from "lucide-react";
import { movieApi, Movie, MovieBundle, QPayInvoice, MovieBulkPurchaseResponse, MovieBundlePurchaseResponse } from "@/apis";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

function resolveImg(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

function fmtDuration(seconds: number) {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h} цаг ${m} мин` : `${m} минут`;
}

function fmtPrice(price: number) {
  return `₮${price.toLocaleString()}`;
}

const POLL_MS = 3000;

export default function MoviesPage() {
  const [genre, setGenre] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkInvoice, setBulkInvoice] = useState<MovieBulkPurchaseResponse | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data, mutate, isLoading } = useSWR("movies-list", async () => {
    const [res, bundleRes, bundlesRes] = await Promise.all([
      movieApi.list(1, 100),
      movieApi.getBundle().catch(() => null),
      movieApi.listBundles(1, 50).catch(() => null),
    ]);
    const allGenres = Array.from(new Set(res.data.flatMap(m => m.genres))).filter(Boolean);
    return {
      movies: res.data,
      genres: allGenres,
      bundle: bundleRes?.data ?? null,
      customBundles: bundlesRes?.data ?? [],
    };
  });

  const movies = data?.movies ?? [];
  const genres = data?.genres ?? [];
  const bundle = data?.bundle ?? null;
  const customBundles = data?.customBundles ?? [];

  const handlePurchased = (updatedMovie: Movie) => {
    mutate(prev => prev ? {
      ...prev,
      movies: prev.movies.map(m => m._id === updatedMovie._id ? updatedMovie : m)
    } : prev, false);
    setSelected(updatedMovie);
  };

  const handleBulkPurchased = (updatedMovies: Movie[]) => {
    mutate(prev => {
      if (!prev) return prev;
      const movieMap = new Map(updatedMovies.map(m => [m._id, m]));
      return {
        ...prev,
        movies: prev.movies.map(m => movieMap.has(m._id) ? { ...m, ...movieMap.get(m._id), owned: true } : m)
      };
    }, false);
    setSelectedIds([]);
  };

  const setBundle = (newBundle: MovieBundle) => {
    mutate(prev => prev ? { ...prev, bundle: newBundle } : prev, false);
  };

  const updateCustomBundle = (updated: MovieBundle) => {
    mutate(prev => prev ? {
      ...prev,
      customBundles: prev.customBundles.map(b => b._id === updated._id ? updated : b),
      movies: prev.movies.map(m =>
        updated.movieIds.includes(m._id) ? { ...m, owned: true, ownership: "bundle" as const } : m
      ),
    } : prev, false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkBuy = async () => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length === 1) {
      const movie = movies.find(m => m._id === selectedIds[0]);
      if (movie) { setSelected(movie); setSelectedIds([]); }
      return;
    }
    setBulkLoading(true);
    try {
      const res = await movieApi.bulkPurchase(selectedIds);
      setBulkInvoice(res);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setBulkLoading(false);
    }
  };

  const filtered = genre ? movies.filter(m => m.genres.includes(genre)) : movies;
  const selectedTotal = movies.filter(m => selectedIds.includes(m._id)).reduce((acc, m) => acc + m.effectivePrice, 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pb-32">
      <div className="relative z-10">

        {/* Header */}
        <header className="mb-8 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-black tracking-tight text-white">Бичлэгүүд</h1>
            <p className="text-[15px] text-white/60 mt-0.5">Сонирхсон бичлэгүүдээ сонгоод үзээрэй</p>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-[14px] text-white/50 hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
            >
              <X size={15} /> Сонголт цуцлах
            </button>
          )}
        </header>

        {/* All-movies bundle banner */}
        {bundle?.isActive && (
          <BundleBanner bundle={bundle} onPurchased={b => setBundle(b)} />
        )}

        {/* Custom bundles */}
        {customBundles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package size={17} className="text-white/70" />
              <h2 className="text-[16px] font-bold text-white">Багц</h2>
              <span className="text-[13px] text-white/40">(хэд хэдэн бичлэг нэг үнээр)</span>
            </div>
            <div className="flex flex-col gap-3">
              {customBundles.map(cb => (
                <CustomBundleCard key={cb._id} bundle={cb} onPurchased={updateCustomBundle} />
              ))}
            </div>
          </div>
        )}

        {/* Genre filter */}
        <div className="mb-6">
          <p className="text-[13px] text-white/50 mb-3 font-medium">Төрлөөр шүүх:</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setGenre("")}
              className={`px-4 py-2 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border ${!genre
                ? "bg-[#e8415a] border-[#e8415a] text-white"
                : "bg-white/[0.05] border-white/[0.12] text-white/70 hover:bg-white/[0.1]"
                }`}
            >
              Бүгд
            </button>
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-4 py-2 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all border ${genre === g
                  ? "bg-[#e8415a] border-[#e8415a] text-white"
                  : "bg-white/[0.05] border-white/[0.12] text-white/70 hover:bg-white/[0.1]"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movie grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="text-[#e8415a] animate-spin" />
            <p className="text-[16px] text-white/60">Ачаалж байна...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-32 gap-4 text-white/40 border border-white/[0.06] rounded-2xl bg-white/[0.02]">
            <Film size={40} strokeWidth={1.5} />
            <p className="text-[16px]">Одоогоор Бичлэг байхгүй байна</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map(m => (
              <MovieCard
                key={m._id}
                movie={m}
                isSelected={selectedIds.includes(m._id)}
                onSelect={toggleSelect}
                onClick={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk checkout bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[520px]">
          <div className="bg-[#18141c] border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="pl-1">
              <p className="text-[15px] font-bold text-white">{selectedIds.length} Бичлэг сонгосон</p>
              <p className="text-[13px] text-white/60 mt-0.5">Нийт дүн: <span className="text-white font-bold">{fmtPrice(selectedTotal)}</span></p>
            </div>
            <button
              onClick={handleBulkBuy}
              disabled={bulkLoading}
              className="px-6 h-11 rounded-xl bg-[#e8415a] text-white font-bold text-[14px] disabled:opacity-50 cursor-pointer border-none flex items-center gap-2 shrink-0"
            >
              {bulkLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
              Худалдан авах
            </button>
          </div>
        </div>
      )}

      {selected && (
        <MovieDetailModal
          movie={selected}
          bundleOwned={bundle?.owned ?? false}
          onClose={() => setSelected(null)}
          onPurchased={handlePurchased}
        />
      )}

      {bulkInvoice && (
        <BulkInvoiceModal
          res={bulkInvoice}
          onClose={() => setBulkInvoice(null)}
          onSuccess={handleBulkPurchased}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function MovieCard({
  movie,
  isSelected,
  onSelect,
  onClick,
}: {
  movie: Movie;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (m: Movie) => void;
}) {
  const img = resolveImg(movie.image?.url);
  const isOwned = movie.owned;

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 bg-[#18141c] ${isSelected
        ? "border-[#e8415a] shadow-[0_0_0_2px_rgba(232,65,90,0.3)]"
        : "border-white/[0.08] hover:border-white/20"
        }`}
    >
      {/* Poster — always visible, never blurred */}
      <div
        className="relative aspect-[2/3] overflow-hidden bg-[#1f1a25]"
        onClick={() => onClick(movie)}
      >
        {img ? (
          <img
            src={img}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film size={36} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Owned badge */}
        {isOwned && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3cc878] text-white text-[12px] font-bold shadow-lg">
            <CheckCircle size={12} strokeWidth={2.5} />
            Авсан
          </div>
        )}

        {/* Genre badge */}
        {movie.genres[0] && !isOwned && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 text-white/90 text-[12px] font-medium">
            {movie.genres[0]}
          </div>
        )}

        {/* Selection checkbox for unowned */}
        {!isOwned && (
          <button
            onClick={e => { e.stopPropagation(); onSelect(movie._id); }}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
              ? "bg-[#e8415a] border-[#e8415a]"
              : "bg-black/40 border-white/40 hover:border-white/80"
              }`}
          >
            {isSelected && <CheckCircle size={15} className="text-white" strokeWidth={2.5} />}
          </button>
        )}
      </div>

      {/* Card footer */}
      <div className="p-3 flex flex-col gap-2">
        <div onClick={() => onClick(movie)}>
          <h3 className="font-bold text-[14px] text-white leading-snug line-clamp-2">{movie.title}</h3>
          <p className="text-[12px] text-white/50 mt-1">
            {movie.releaseYear ?? "—"}{movie.duration ? ` · ${fmtDuration(movie.duration)}` : ""}
          </p>
        </div>

        {isOwned ? (
          <button
            onClick={() => onClick(movie)}
            className="w-full py-2 rounded-xl bg-[#3cc878] text-white font-bold text-[13px] flex items-center justify-center gap-2 border-none cursor-pointer hover:bg-[#2daa65] transition-colors"
          >
            <Play size={14} fill="white" /> Үзэх
          </button>
        ) : (
          <button
            onClick={() => onClick(movie)}
            className={`w-full py-2 rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all ${isSelected
              ? "bg-[#e8415a] text-white"
              : "bg-white/[0.07] text-white hover:bg-[#e8415a] hover:text-white"
              }`}
          >
            {isSelected ? <CheckCircle size={13} strokeWidth={2.5} /> : <Lock size={13} />}
            {fmtPrice(movie.effectivePrice)}
          </button>
        )}
      </div>
    </div>
  );
}

function BundleBanner({ bundle, onPurchased }: { bundle: MovieBundle; onPurchased: (b: MovieBundle) => void }) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [paid, setPaid] = useState(bundle.owned);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!purchaseId || paid) return;
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(purchaseId);
        if (s.active) {
          setPaid(true);
          setInvoice(null);
          clearInterval(intervalRef.current!);
          onPurchased({ ...bundle, owned: true });
        }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [purchaseId, paid]);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await movieApi.purchaseBundle();
      setInvoice(res.invoice);
      setPurchaseId(res.purchaseId);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (invoice) {
    return <InvoiceModal invoice={invoice} title={bundle.title} price={bundle.effectivePrice} onClose={() => setInvoice(null)} />;
  }

  if (paid || bundle.owned) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#3cc878]/30 bg-[#3cc878]/10 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#3cc878]/20 flex items-center justify-center shrink-0">
          <CheckCircle size={22} className="text-[#3cc878]" />
        </div>
        <div>
          <p className="text-[16px] font-bold text-[#3cc878]">Та бүх бичлэг багцыг авсан байна</p>
          <p className="text-[14px] text-[#3cc878]/70 mt-0.5">Бүх бичлэгүүдийг чөлөөтэй үзэх боломжтой</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e8b850]/30 bg-[#1f1a14] mb-8 overflow-hidden">
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#e8b850] text-black text-[12px] font-black">ХАМГИЙН ХЭМНЭЛТТЭЙ</span>
          </div>
          <h2 className="text-[20px] font-black text-[#e8b850] mb-1">{bundle.title}</h2>
          <p className="text-[14px] text-white/60">
            {bundle.totalMovies ? `${bundle.totalMovies} Бичлэг` : "Бүх Бичлэг"} нэг дор нэг үнээр — хэдийд ч үзэж болно
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          {bundle.discountedPrice != null && bundle.discountedPrice < bundle.price && (
            <p className="text-[13px] text-white/40 line-through">{fmtPrice(bundle.price)}</p>
          )}
          <p className="text-[28px] font-black text-white leading-none">{fmtPrice(bundle.effectivePrice)}</p>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-[#e8b850] text-black font-black text-[15px] disabled:opacity-60 flex items-center gap-2 cursor-pointer border-none hover:bg-[#f0c840] transition-colors"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <ShoppingCart size={17} />}
            Бүх бичлэг авах
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomBundleCard({ bundle, onPurchased }: { bundle: MovieBundle; onPurchased: (b: MovieBundle) => void }) {
  const [loading, setLoading] = useState(false);
  const [purchaseRes, setPurchaseRes] = useState<MovieBundlePurchaseResponse | null>(null);
  const [paid, setPaid] = useState(bundle.owned);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!purchaseRes || paid) return;
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(purchaseRes.purchaseIds[0]);
        if (s.active) {
          setPaid(true);
          setPurchaseRes(null);
          clearInterval(intervalRef.current!);
          onPurchased({ ...bundle, owned: true });
        }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [purchaseRes, paid]);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await movieApi.purchaseMovieBundle(bundle._id);
      setPurchaseRes(res);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const img = resolveImg(bundle.image?.url);
  const isOwned = paid || bundle.owned;
  const moviePreviews = bundle.movies.slice(0, 5);
  const movieCount = bundle.movieCount ?? bundle.movies.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-white/[0.1] bg-[#18141c] hover:border-white/20 transition-colors">
        {/* Movie thumbnails */}
        <div className="shrink-0 flex items-center">
          {img ? (
            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden border border-white/[0.1]">
              <img src={img} alt={bundle.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center">
              {moviePreviews.map((m, i) => (
                <div
                  key={m._id}
                  className="w-[44px] h-[58px] rounded-lg overflow-hidden border border-white/[0.12] shrink-0"
                  style={{ marginLeft: i > 0 ? "-12px" : 0, zIndex: moviePreviews.length - i }}
                >
                  {m.image?.url ? (
                    <img src={resolveImg(m.image.url)} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1f1a25] flex items-center justify-center">
                      <Film size={12} className="text-white/20" />
                    </div>
                  )}
                </div>
              ))}
              {movieCount > 5 && (
                <div className="w-[44px] h-[58px] rounded-lg bg-[#1f1a25] border border-white/[0.1] flex items-center justify-center shrink-0" style={{ marginLeft: "-12px", zIndex: 0 }}>
                  <span className="text-[11px] font-bold text-white/50">+{movieCount - 5}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-[12px] font-bold">
              {movieCount} Бичлэг
            </span>
            {isOwned && (
              <span className="px-2 py-0.5 rounded-md bg-[#3cc878]/20 text-[#3cc878] text-[12px] font-bold">
                ✓ Авсан
              </span>
            )}
          </div>
          <h3 className="text-[16px] font-bold text-white truncate">{bundle.title}</h3>
          {bundle.description && (
            <p className="text-[13px] text-white/50 mt-1 line-clamp-2">{bundle.description}</p>
          )}
          <div className="flex items-baseline gap-2 mt-2">
            {bundle.discountedPrice != null && bundle.discountedPrice < bundle.price && (
              <span className="text-[13px] text-white/40 line-through">{fmtPrice(bundle.price)}</span>
            )}
            <span className="text-[20px] font-black text-white">{fmtPrice(bundle.effectivePrice)}</span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0 flex items-center sm:self-center">
          {isOwned ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3cc878]/15 border border-[#3cc878]/25">
              <CheckCircle size={16} className="text-[#3cc878]" />
              <span className="text-[14px] font-bold text-[#3cc878]">Нээлттэй</span>
            </div>
          ) : (
            <button
              onClick={handleBuy}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#e8415a] text-white font-bold text-[14px] flex items-center gap-2 cursor-pointer border-none hover:bg-[#d63550] disabled:opacity-60 transition-colors shrink-0"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />}
              Авах
            </button>
          )}
        </div>
      </div>

      {purchaseRes && !paid && (
        <BundlePurchaseModal
          res={purchaseRes}
          onClose={() => setPurchaseRes(null)}
          onSuccess={() => { setPaid(true); onPurchased({ ...bundle, owned: true }); }}
        />
      )}
    </>
  );
}

function BundlePurchaseModal({ res, onClose, onSuccess }: {
  res: MovieBundlePurchaseResponse;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [paid, setPaid] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(res.purchaseIds[0]);
        if (s.active) { setPaid(true); clearInterval(intervalRef.current!); onSuccess(); }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [res.purchaseIds]);

  if (paid) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
        <div className="w-full max-w-[400px] rounded-2xl bg-[#18141c] border border-[#3cc878]/30 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#3cc878]/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-[#3cc878]" />
          </div>
          <h2 className="text-[22px] font-black text-white mb-2">Төлбөр амжилттай!</h2>
          <p className="text-[15px] text-white/60 mb-7">{res.bundle.title} — {res.movies.length} Бичлэг нээгдлээ</p>
          <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[#3cc878] text-white font-bold text-[15px] cursor-pointer border-none hover:bg-[#2daa65] transition-colors">
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    );
  }

  return <InvoiceModal invoice={res.invoice} title={res.bundle.title} price={res.totalPrice} onClose={onClose} />;
}

function MovieDetailModal({
  movie,
  bundleOwned,
  onClose,
  onPurchased,
}: {
  movie: Movie;
  bundleOwned: boolean;
  onClose: () => void;
  onPurchased: (m: Movie) => void;
}) {
  const [buying, setBuying] = useState(false);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOwned = movie.owned || bundleOwned;

  useEffect(() => {
    if (!purchaseId) return;
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(purchaseId);
        if (s.active) {
          clearInterval(intervalRef.current!);
          setInvoice(null);
          onPurchased({ ...movie, owned: true, ownership: "single" });
        }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [purchaseId]);

  const handleBuy = async () => {
    setBuying(true);
    try {
      const res = await movieApi.purchase(movie._id);
      setInvoice(res.invoice);
      setPurchaseId(res.purchaseId);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setBuying(false);
    }
  };

  const handleStream = async () => {
    setStreaming(true);
    try {
      const res = await movieApi.getStream(movie._id);
      setStreamUrl(res.data.streamUrl);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setStreaming(false);
    }
  };

  const img = resolveImg(movie.image?.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div
        className="w-full max-w-[480px] rounded-2xl overflow-hidden border border-white/10 bg-[#18141c] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Poster — always clear, never blurred */}
        <div className="relative aspect-[16/9] bg-[#1f1a25] overflow-hidden">
          {img ? (
            <img src={img} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film size={56} className="text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18141c] via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/10 cursor-pointer hover:bg-black/80 transition-colors"
          >
            <X size={18} />
          </button>

          {isOwned && (
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3cc878] text-white text-[13px] font-bold shadow-lg">
              <CheckCircle size={14} strokeWidth={2.5} /> Авсан — үзэж болно
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Title & meta */}
          <h2 className="text-[22px] font-black text-white leading-tight mb-2">{movie.title}</h2>
          <div className="flex items-center gap-3 text-[14px] text-white/50 mb-4">
            {movie.releaseYear && <span>{movie.releaseYear} он</span>}
            {movie.duration > 0 && <><span>·</span><span>{fmtDuration(movie.duration)}</span></>}
            {movie.genres.length > 0 && <><span>·</span><span className="text-[#e8415a] font-medium">{movie.genres[0]}</span></>}
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 mb-6">
            <p className="text-[14px] text-white/70 leading-relaxed">
              {movie.description || "Энэхүү Бичлэгны тайлбар одоогоор ороогүй байна."}
            </p>
          </div>

          {/* Price info for unowned */}
          {!isOwned && (
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[15px] text-white/60">Үнэ:</span>
              <div className="flex items-baseline gap-2">
                {movie.discountedPrice != null && movie.discountedPrice < movie.price && (
                  <span className="text-[14px] text-white/40 line-through">{fmtPrice(movie.price)}</span>
                )}
                <span className="text-[22px] font-black text-white">{fmtPrice(movie.effectivePrice)}</span>
              </div>
            </div>
          )}

          {/* Action button */}
          {isOwned ? (
            <button
              onClick={handleStream}
              disabled={streaming}
              className="w-full py-4 rounded-xl font-black text-[16px] text-white bg-[#3cc878] flex items-center justify-center gap-3 hover:bg-[#2daa65] transition-colors disabled:opacity-60 cursor-pointer border-none"
            >
              {streaming ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="white" />}
              Үзэж эхлэх
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-4 rounded-xl font-black text-[16px] text-white bg-[#e8415a] flex items-center justify-center gap-3 hover:bg-[#d63550] transition-colors disabled:opacity-60 cursor-pointer border-none"
            >
              {buying ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
              QPay-аар худалдан авах
            </button>
          )}
        </div>
      </div>

      {invoice && (
        <InvoiceModal
          invoice={invoice}
          title={movie.title}
          price={movie.effectivePrice}
          onClose={() => setInvoice(null)}
        />
      )}

      {streamUrl && (
        <VideoPlayer url={streamUrl} title={movie.title} onClose={() => setStreamUrl(null)} />
      )}
    </div>
  );
}

function InvoiceModal({ invoice, title, price, onClose }: {
  invoice: QPayInvoice;
  title: string;
  price: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <div
        className="w-full max-w-[400px] rounded-2xl overflow-hidden border border-white/10 bg-[#18141c] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.07]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[20px] font-black text-white">QPay төлбөр</h2>
              <p className="text-[14px] text-white/50 mt-1">{title}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-white/40">Нийт дүн</p>
              <p className="text-[22px] font-black text-white">{fmtPrice(price)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Numbered steps */}
          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center gap-3 text-[14px] text-white/70">
              <span className="w-6 h-6 rounded-full bg-[#e8415a] text-white font-black text-[12px] flex items-center justify-center shrink-0">1</span>
              Дараах банкны аппликейшнийг нээнэ үү
            </div>
            <div className="flex items-center gap-3 text-[14px] text-white/70">
              <span className="w-6 h-6 rounded-full bg-[#e8415a] text-white font-black text-[12px] flex items-center justify-center shrink-0">2</span>
              QR кодыг камераар уншуулна уу
            </div>
            <div className="flex items-center gap-3 text-[14px] text-white/70">
              <span className="w-6 h-6 rounded-full bg-[#e8415a] text-white font-black text-[12px] flex items-center justify-center shrink-0">3</span>
              Төлбөрийг баталгаажуулна уу
            </div>
          </div>

          {/* QR code */}
          <div className="bg-white rounded-2xl p-4 flex justify-center mb-5">
            <img
              src={`data:image/png;base64,${invoice.qr_image}`}
              alt="QPay QR код"
              className="w-[190px] h-[190px] block"
            />
          </div>

          {/* Bank app links */}
          {invoice.urls && invoice.urls.length > 0 && (
            <>
              <p className="text-[13px] text-white/50 font-medium mb-3 text-center">Банкны апп сонгох:</p>
              <div className="grid grid-cols-3 gap-2">
                {invoice.urls.slice(0, 6).map((u, i) => (
                  <a
                    key={i}
                    href={u.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition-colors no-underline"
                  >
                    {u.logo && <img src={u.logo} alt={u.name} className="w-9 h-9 rounded-lg object-contain" />}
                    <span className="text-[11px] text-white/60 font-medium truncate w-full text-center">{u.name}</span>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Waiting indicator */}
          <div className="mt-5 flex items-center justify-center gap-2.5 text-[14px] text-white/50">
            <div className="w-2 h-2 rounded-full bg-[#e8415a] animate-ping" />
            Төлбөр хүлээж байна...
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function VideoPlayer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-black" onClick={onClose}>
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-5 bg-gradient-to-b from-black/80 to-transparent"
        onClick={e => e.stopPropagation()}
      >
        <p className="font-bold text-[16px] text-white">{title}</p>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[14px] font-medium transition-all cursor-pointer border-none"
        >
          <X size={16} /> Хаах
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <video
          src={url}
          controls
          autoPlay
          controlsList="nodownload"
          className="w-full max-h-full"
          style={{ maxHeight: "100vh" }}
        />
      </div>
    </div>
  );
}

function BulkInvoiceModal({ res, onClose, onSuccess }: {
  res: MovieBulkPurchaseResponse;
  onClose: () => void;
  onSuccess: (movies: Movie[]) => void;
}) {
  const [paid, setPaid] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(res.purchaseIds[0]);
        if (s.active) { setPaid(true); clearInterval(intervalRef.current!); onSuccess(res.movies); }
      } catch { /* keep polling */ }
    }, 3000);
    return () => clearInterval(intervalRef.current!);
  }, [res.purchaseIds]);

  if (paid) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
        <div className="w-full max-w-[400px] rounded-2xl bg-[#18141c] border border-[#3cc878]/30 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#3cc878]/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-[#3cc878]" />
          </div>
          <h2 className="text-[22px] font-black text-white mb-2">Төлбөр амжилттай!</h2>
          <p className="text-[15px] text-white/60 mb-7">Таны {res.movies.length} Бичлэг амжилттай нээгдлээ</p>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#3cc878] text-white font-bold text-[15px] cursor-pointer border-none hover:bg-[#2daa65] transition-colors"
          >
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <InvoiceModal
      invoice={res.invoice}
      title={`${res.movies.length} Бичлэг`}
      price={res.totalPrice}
      onClose={onClose}
    />
  );
}
