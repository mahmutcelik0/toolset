import type { Metadata } from "next"
import HeroSearch from "@/components/home/HeroSearch"
import CategoryGrid from "@/components/home/CategoryGrid"
import TrendingTools from "@/components/home/TrendingTools"
import PopularTools from "@/components/home/PopularTools"
import WhyToolset from "@/components/home/WhyToolset"
import NewTools from "@/components/home/NewTools"
import CategorySections from "@/components/home/CategorySections"

export const metadata: Metadata = {
  title: "500+ Free Online Tools — ToolSetApp",
  description:
    "Free online tools for developers, PDFs, images and more. JSON formatter, regex tester, PDF converter and 500+ tools. No registration required.",
}

export default function Home() {
  return (
    <main className="flex-1 bg-[#0f172a]">
      <HeroSearch />
      <CategoryGrid />
      <TrendingTools />
      <PopularTools />
      <WhyToolset />
      <NewTools />
      <CategorySections />
    </main>
  )
}
