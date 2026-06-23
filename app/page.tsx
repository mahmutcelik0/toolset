import type { Metadata } from "next"
import HeroSearch from "@/components/home/HeroSearch"
import CategoryGrid from "@/components/home/CategoryGrid"
import ToolScrollRow from "@/components/home/ToolScrollRow"
import WhyToolset from "@/components/home/WhyToolset"
import { popularTools, newTools, favoriteTools } from "@/lib/tools"

export const metadata: Metadata = {
  title: "500+ Free Online Tools",
  description:
    "Free online tools for developers, PDFs, images and more. JSON formatter, regex tester, PDF converter and 500+ tools. No registration required.",
}

export default function Home() {
  return (
    <main className="flex-1 bg-[#0f172a]">
      <HeroSearch />
      <ToolScrollRow title="Popular Tools" emoji="🔥" tools={popularTools} />
      <CategoryGrid />
      <ToolScrollRow title="Recently Added" emoji="🆕" badge="New" tools={newTools} />
      <ToolScrollRow title="Developer Favorites" emoji="⭐" tools={favoriteTools} />
      <WhyToolset />
    </main>
  )
}
