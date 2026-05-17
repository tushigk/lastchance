"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone?: () => void } = {}) {
  const [show, setShow] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    setShow(true);

    const fadeOutTimer = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      setShow(false);
      onDone?.();
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-500 ease-in-out ${isAnimatingOut ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="relative flex flex-col items-center animate-bounce" style={{ animationDuration: '2s' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[rgba(232,65,90,0.2)] rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex items-center justify-center">
          <Image src="/logo.png" alt="" width={50} height={50} />
        </div>

        <span className="relative z-10 mt-6 text-3xl font-bold tracking-[-0.02em] text-white font-serif tracking-widest uppercase">
          Khuslen
        </span>
      </div>
    </div>
  );
}
