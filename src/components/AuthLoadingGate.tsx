"use client";
import { useState, ReactNode } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function AuthLoadingGate({ children }: { children: ReactNode }) {
  const [isFirstVisit] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("splashShown")) return false;
    sessionStorage.setItem("splashShown", "1");
    return true;
  });

  const [splashDone, setSplashDone] = useState(false);

  if (isFirstVisit && !splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return <>{children}</>;
}
