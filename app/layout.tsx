import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CommandPalette from "@/components/CommandPalette"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: { default: "toolsetapp — 500+ Free Online Tools", template: "%s | toolsetapp" },
  description:
    "Free online tools for developers, PDFs, images and more. JSON formatter, regex tester, PDF converter and 500+ tools. No registration required.",
  metadataBase: new URL("https://toolsetapp.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#0f172a] text-white min-h-screen flex flex-col antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  )
}
