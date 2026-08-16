import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

import { LiffProvider } from "@/components/providers/LiffProvider";

export const metadata: Metadata = {
  title: "世代銘印 | 講一個巷弄神明的日常",
  description: "解碼那些銘印於心的文化密碼，結合考證與視覺藝術，傳承台灣民俗信仰。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-xuan text-bone font-sans">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
