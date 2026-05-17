import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";
import { AuthProvider } from "@/store/AuthProvider";
import { NotificationProvider } from "@/store/NotificationProvider";
import AuthLoadingGate from "@/components/AuthLoadingGate";

export const metadata: Metadata = {
  title: "Khuslen | Насанд хүрэгчдийн Монголын Нийгэмлэг",
  description: "Насанд хүрэгчдийн Монголын Нийгэмлэг",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <NotificationProvider>
            <AuthLoadingGate>
              <Header />
              {children}
            </AuthLoadingGate>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
