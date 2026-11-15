import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  variable: "--font-display-latin",
});

export const metadata: Metadata = {
  title: {
    default: "声境 Shengjing",
    template: "%s · 声境",
  },
  description:
    "声境是可以现场调的自然声景。四处核心声景使用 CC0 录音，其余在浏览器里合成。适合专注、放松和入睡。",
  applicationName: "声境",
  openGraph: {
    title: "声境 Shengjing",
    description: "可以现场调的自然声景。四处核心声景使用 CC0 录音，其余在浏览器里合成。",
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#101614",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip font-sans">
        <a href="#main" className="skip-link">
          跳到主内容
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
