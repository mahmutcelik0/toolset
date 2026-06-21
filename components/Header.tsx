// components/Header.tsx
import Link from "next/link"

const tools = [
  { href: "/json-formatter", label: "JSON" },
  { href: "/regex-tester", label: "Regex" },
  { href: "/css-minifier", label: "CSS" },
  { href: "/base64", label: "Base64" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0f1117]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-13 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white no-underline">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold font-mono">
            {}
          </div>
          DevTools
        </Link>
        <nav className="flex gap-1">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="text-sm text-white/50 hover:text-white hover:bg-white/8 px-3 py-1.5 rounded-md transition-colors no-underline"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}