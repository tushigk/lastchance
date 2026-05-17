"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Check, Search, Loader2,
  Upload, X, Camera, UserCheck, AlertTriangle,
} from "lucide-react";
import { profileApi } from "@/apis";

const TOTAL_STEPS = 5;

type UploadedPhoto = {
  file: File;
  preview: string;
  url?: string;
  faceStatus: "pending" | "detected" | "not_found" | "unsupported" | "checking";
};

type FormData = {
  photos: UploadedPhoto[];
  city: string;
  birthYear: string;
  bio: string;
  interests: string[];
};

const INITIAL: FormData = { photos: [], city: "", birthYear: "", bio: "", interests: [] };

// Browser native Face Detector (Chrome Shape Detection API)
async function detectFace(imgEl: HTMLImageElement): Promise<"detected" | "not_found" | "unsupported"> {
  if (typeof window === "undefined" || !("FaceDetector" in window)) return "unsupported";
  try {
    const detector = new (window as any).FaceDetector({ fastMode: true });
    const faces = await detector.detect(imgEl);
    return faces.length > 0 ? "detected" : "not_found";
  } catch {
    return "unsupported";
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed = () => {
    if (step === 1) return data.photos.length > 0 && data.photos.every(p => p.faceStatus !== "checking");
    return true;
  };

  const next = async () => {
    setError("");
    if (step === 1) {
      // Warn if a face wasn't found but still allow continue
      const noFace = data.photos.some(p => p.faceStatus === "not_found");
      if (noFace && !window.confirm("Нэг зурагт царай илрүүлсэнгүй. Үргэлжлүүлэх үү?")) return;
    }
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return; }

    setLoading(true);
    try {
      const form = new FormData();
      if (data.city) form.append("city", data.city);
      if (data.birthYear) form.append("birthYear", data.birthYear);
      if (data.bio) form.append("bio", data.bio);
      if (data.interests.length > 0) {
        form.append("interests", JSON.stringify(data.interests));
      }

      // Add all photo files to the 'photos' field
      for (const photo of data.photos) {
        if (photo.file) {
          form.append("photos", photo.file);
        }
      }

      await profileApi.updateMyProfile(form);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const back = () => step > 1 && setStep(s => s - 1);
  const set = (key: keyof FormData, val: any) => setData(d => ({ ...d, [key]: val }));
  const toggleInterest = (t: string) =>
    setData(d => ({
      ...d,
      interests: d.interests.includes(t)
        ? d.interests.filter(i => i !== t)
        : d.interests.length < 6 ? [...d.interests, t] : d.interests,
    }));

  if (done) return <DoneScreen />;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-white font-serif bg-[linear-gradient(135deg,#c8254a,#780f20)]">С</div>
          <span className="text-[15px] font-bold font-serif text-text-primary">Khuslen</span>
        </div>
        <span className="text-[12px] text-text-muted">{step} / {TOTAL_STEPS}</span>
      </div>

      {/* Progress */}
      <div className="mx-5 h-1 rounded-full bg-[rgba(255,255,255,0.07)] mb-8">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #e8415a, #9b59ff)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 flex flex-col max-w-[480px] mx-auto w-full overflow-hidden">
        {step === 1 && (
          <StepPhotos
            photos={data.photos}
            onChange={photos => set("photos", photos)}
          />
        )}
        {step === 2 && <StepCity value={data.city} onChange={v => set("city", v)} />}
        {step === 3 && <StepBirthYear value={data.birthYear} onChange={v => set("birthYear", v)} />}
        {step === 4 && <StepBio value={data.bio} onChange={v => set("bio", v)} />}
        {step === 5 && <StepInterests selected={data.interests} toggle={toggleInterest} />}
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 px-5 py-4 max-w-[480px] mx-auto w-full bg-bg-primary border-t border-[rgba(255,255,255,0.05)]">
        {error && <p className="text-[12px] text-[#e04878] text-center mb-3">{error}</p>}
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={back} disabled={loading}
              className="w-11 h-11 rounded-xl flex items-center justify-center border transition-colors duration-200 hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 cursor-pointer bg-transparent"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <ChevronLeft size={18} strokeWidth={2} className="text-text-secondary" />
            </button>
          )}
          <button
            onClick={next}
            disabled={loading || !canProceed()}
            className="flex-1 h-11 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 20px rgba(200,37,74,0.4)" }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Хадгалж байна..." : step === TOTAL_STEPS ? "Дуусгах" : "Үргэлжлүүлэх"}
            {!loading && <ChevronRight size={16} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Photo upload with face detection ─── */

function StepPhotos({
  photos,
  onChange,
}: {
  photos: UploadedPhoto[];
  onChange: (p: UploadedPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const runFaceDetect = async (idx: number, list: UploadedPhoto[]) => {
    const img = imgRefs.current[idx];
    if (!img) return;
    const status = await detectFace(img);
    const updated = [...list];
    updated[idx] = { ...updated[idx], faceStatus: status };
    onChange(updated);
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = 2 - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const newPhotos: UploadedPhoto[] = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      faceStatus: "checking",
    }));
    const updated = [...photos, ...newPhotos];
    onChange(updated);
    // Run face detection after images load (via ref callback)
    newPhotos.forEach((_, relIdx) => {
      const absIdx = photos.length + relIdx;
      setTimeout(() => runFaceDetect(absIdx, updated), 300);
    });
  }, [photos, onChange]);

  const remove = (idx: number) => {
    URL.revokeObjectURL(photos[idx].preview);
    onChange(photos.filter((_, i) => i !== idx));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-[26px] font-black font-serif mb-1.5 leading-tight">Зургаа оруулна уу</h2>
      <p className="text-text-secondary text-[14px] mb-6">
        Нүүр тань тодорхой харагдах 1–2 зургийг оруулна уу. Зурагт царай автоматаар илрүүлнэ.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {Array.from({ length: 2 }).map((_, idx) => {
          const photo = photos[idx];
          return (
            <div key={idx} className="relative aspect-[3/4]">
              {photo ? (
                <div className="w-full h-full rounded-[20px] overflow-hidden relative border border-white/[0.08]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={el => { imgRefs.current[idx] = el; }}
                    src={photo.preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      if (photo.faceStatus === "checking") {
                        runFaceDetect(idx, photos);
                      }
                    }}
                    crossOrigin="anonymous"
                  />
                  {/* Face status badge */}
                  <div className="absolute bottom-2 left-2">
                    {photo.faceStatus === "checking" && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-black/70 text-white backdrop-blur-sm">
                        <Loader2 size={10} className="animate-spin" /> Шалгаж байна
                      </span>
                    )}
                    {photo.faceStatus === "detected" && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[rgba(60,200,120,0.85)] text-white backdrop-blur-sm">
                        <UserCheck size={10} /> Царай илэрсэн
                      </span>
                    )}
                    {photo.faceStatus === "not_found" && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[rgba(232,184,80,0.85)] text-white backdrop-blur-sm">
                        <AlertTriangle size={10} /> Царай илрүүлсэнгүй
                      </span>
                    )}
                    {photo.faceStatus === "unsupported" && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white/70 backdrop-blur-sm">
                        <Check size={10} /> Зураг нэмэгдсэн
                      </span>
                    )}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => photos.length === idx && inputRef.current?.click()}
                  className="w-full h-full rounded-[20px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer bg-transparent"
                  style={{
                    borderColor: photos.length === idx ? "rgba(232,65,90,0.4)" : "rgba(255,255,255,0.08)",
                    background: photos.length === idx ? "rgba(232,65,90,0.05)" : "rgba(255,255,255,0.02)",
                    opacity: photos.length < idx ? 0.4 : 1,
                  }}
                >
                  {photos.length === idx ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[rgba(232,65,90,0.12)] flex items-center justify-center border border-[rgba(232,65,90,0.3)]">
                        <Upload size={18} style={{ color: "#e8415a" }} />
                      </div>
                      <span className="text-[12px] font-medium text-[#e8415a]">
                        {idx === 0 ? "Үндсэн зураг" : "2-р зураг"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Camera size={22} className="text-text-muted" />
                      <span className="text-[11px] text-text-muted">2-р зураг</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Drop zone / click to add (when both slots visible) */}
      {photos.length < 2 && (
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border border-dashed rounded-2xl py-4 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[rgba(232,65,90,0.04)]"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <Upload size={15} className="text-text-muted" />
          <span className="text-[13px] text-text-muted">Зураг сонгох эсвэл чирч оруулах</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Tips */}
      <div className="mt-4 flex flex-col gap-2 text-white">
        {[
          "Нүүр тань тодорхой, гэрэлтэй байх",
          "Дангаараа байгаа зуйрлаа оруулах",
          "Нар шил, малгайгүй зургийг илүүд үзнэ",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-[rgba(232,65,90,0.12)] flex items-center justify-center shrink-0 mt-0.5">
              <Check size={9} style={{ color: "#e8415a" }} />
            </div>
            <span className="text-[12px] text-text-muted text-white">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 2: City ─── */

const ALL_LOCATIONS = [
  "Улаанбаатар",
  "Архангай", "Баян-Өлгий", "Баянхонгор", "Булган",
  "Говь-Алтай", "Говьсүмбэр", "Дархан-Уул", "Дорноговь",
  "Дорнод", "Дундговь", "Завхан", "Орхон", "Өвөрхангай",
  "Өмнөговь", "Сүхбаатар", "Сэлэнгэ", "Төв", "Увс",
  "Ховд", "Хөвсгөл", "Хэнтий",
];

function StepCity({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = ALL_LOCATIONS.filter(c => c.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <h2 className="text-[26px] font-black font-serif mb-2 leading-tight">Та хаана байна вэ?</h2>
      <p className="text-text-secondary text-[14px] mb-5">Ойрын хүмүүстэй танилцахад ашиглана</p>
      <div className="relative mb-4">
        <Search size={15} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Аймаг хайх..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] text-text-primary outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", colorScheme: "dark" }}
        />
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
        {filtered.length === 0 && <p className="text-center text-text-muted text-[13px] py-6">Олдсонгүй</p>}
        {filtered.map(c => (
          <button key={c} onClick={() => onChange(c)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-left transition-all duration-200 shrink-0 cursor-pointer border"
            style={{
              background: value === c ? "rgba(232,65,90,0.1)" : "rgba(255,255,255,0.04)",
              border: value === c ? "1px solid rgba(232,65,90,0.4)" : "1px solid rgba(255,255,255,0.07)",
            }}>
            <span className="text-[14px] font-medium text-text-primary">{c}</span>
            {value === c && <Check size={14} strokeWidth={2.5} style={{ color: "#e8415a" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 3: Birth year ─── */

function StepBirthYear({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 43 }, (_, i) => currentYear - 18 - i);
  return (
    <div className="flex-1">
      <h2 className="text-[26px] font-black font-serif mb-2 leading-tight">Төрсөн оноо</h2>
      <p className="text-text-secondary text-[14px] mb-8">18-аас дээш насны хэрэглэгч бүртгүүлэх боломжтой</p>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl text-[15px] font-medium text-text-primary outline-none appearance-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", colorScheme: "dark" }}>
          <option value="">Оноо сонгоно уу...</option>
          {years.map(y => <option key={y} value={y}>{y} он — {currentYear - y} нас</option>)}
        </select>
        <ChevronRight size={16} strokeWidth={2} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted rotate-90 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Step 4: Bio ─── */

function StepBio({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1">
      <h2 className="text-[26px] font-black font-serif mb-2 leading-tight">Өөрийнхөө тухай</h2>
      <p className="text-text-secondary text-[14px] mb-8">Танд сонирхолтой хүмүүс анхаарлаа хандуулах болно</p>
      <div className="relative">
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder="Өөрийгөө товчхон танилцуулаарай... Юу дуртай вэ? Юу хайж байна вэ?"
          rows={5} maxLength={200}
          className="w-full px-4 py-3.5 rounded-2xl text-[14px] text-text-primary resize-none outline-none leading-relaxed"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", colorScheme: "dark" }} />
        <span className="absolute bottom-3 right-4 text-[11px] text-text-muted">{value.length}/200</span>
      </div>
    </div>
  );
}

/* ─── Step 5: Interests ─── */

const INTERESTS_LIST = [
  "Хөгжим", "Аялал", "Бичлэг", "Кафе", "Уран зохиол", "Спорт",
  "Roleplay", "Фото", "Тоглоом", "Хоол хийх", "Байгаль", "Уран бүтээл",
  "Фитнесс", "Кофе", "Шөнийн амьдрал", "Ном уншлага", "Дуу хөгжим",
];

function StepInterests({ selected, toggle }: { selected: string[]; toggle: (t: string) => void }) {
  return (
    <div className="flex-1">
      <h2 className="text-[26px] font-black font-serif mb-2 leading-tight">Сонирхол</h2>
      <p className="text-text-secondary text-[14px] mb-2">Хамгийн дуртай зүйлсээ сонгоно уу</p>
      <p className="text-[12px] text-text-muted mb-6">
        <span style={{ color: selected.length >= 6 ? "#e8415a" : "#e8b850" }}>{selected.length}</span>/6 сонгосон
      </p>
      <div className="flex flex-wrap gap-2.5">
        {INTERESTS_LIST.map(t => {
          const active = selected.includes(t);
          const disabled = !active && selected.length >= 6;
          return (
            <button key={t} onClick={() => toggle(t)} disabled={disabled}
              className="px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer border"
              style={{
                background: active ? "rgba(232,65,90,0.15)" : "rgba(255,255,255,0.05)",
                border: active ? "1px solid rgba(232,65,90,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: active ? "#e8415a" : disabled ? "rgba(255,255,255,0.25)" : "var(--text-secondary)",
                opacity: disabled ? 0.5 : 1,
              }}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Done ─── */

function DoneScreen() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-5 text-center">
      <div className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(200,37,74,0.12) 0%, transparent 65%)" }} />
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10"
        style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 8px 40px rgba(200,37,74,0.5)" }}>
        <Check size={36} strokeWidth={2.5} className="text-white" />
      </div>
      <h2 className="text-[30px] font-black font-serif mb-3 relative z-10">Тавтай морил!</h2>
      <p className="text-text-secondary text-[15px] leading-relaxed mb-10 max-w-[300px] relative z-10">
        Профайл тань бэлэн боллоо. Одоо шинэ хүмүүстэй танилцаж эхэлцгээе.
      </p>
      <Link href="/" className="relative z-10">
        <button className="px-8 py-3.5 rounded-2xl font-semibold text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5 border-none cursor-pointer"
          style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 24px rgba(200,37,74,0.45)" }}>
          Эхлэх →
        </button>
      </Link>
    </div>
  );
}
