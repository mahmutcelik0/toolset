import Link from "next/link"
import { tools } from "@/lib/tools"
import BrandLogo from "@/components/BrandLogo"

const navTools = tools.filter((t) => t.href).slice(0, 5)

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0f172a]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden sm:flex gap-1">
          {navTools.map((t) => (
            <Link
              key={t.id}
              href={t.href!}
              className="text-sm text-white/50 hover:text-white hover:bg-white/8 px-3 py-1.5 rounded-md transition-colors no-underline"
            >
              {t.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
