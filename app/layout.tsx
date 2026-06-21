import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/Header"
import "./globals.css"

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: { default: "DevTools — Ücretsiz Geliştirici Araçları", template: "%s | DevTools" },
  description: "JSON formatter, Regex tester, CSS minifier ve daha fazlası. Ücretsiz, kayıt gerektirmez.",
  metadataBase: new URL("https://toolsetapp.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className={`${geistMono.variable} bg-[#0f1117] text-white min-h-screen flex flex-col antialiased`}>
        <Header />
        {children}
        <footer className="border-t border-white/8 py-5 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-white/30">
            <span>© 2025 DevTools</span>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-white/60 transition-colors">Gizlilik</a>
              <a href="/about" className="hover:text-white/60 transition-colors">Hakkında</a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}