import BrandLogo from "@/components/BrandLogo"
import HeaderSearch from "@/components/HeaderSearch"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0f172a]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
        <BrandLogo />
        <div className="flex-1 max-w-md ml-auto hidden sm:block">
          <HeaderSearch />
        </div>
      </div>
    </header>
  )
}
