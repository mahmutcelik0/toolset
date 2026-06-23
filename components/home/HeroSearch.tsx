import Link from "next/link"
import { heroPopularLinks, getToolByName, TOTAL_TOOL_COUNT } from "@/lib/tools"
import ToolSearch from "@/components/ToolSearch"

export default function HeroSearch() {
  return (
    <section className="relative px-6 pt-14 pb-10 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Free Online Tools
        </h1>

        <p className="text-base sm:text-lg text-white/50 mb-8">
          For Developers, PDFs, Images and Everyday Tasks
        </p>

        <div className="max-w-xl mx-auto">
          <ToolSearch variant="hero" />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-white/40">
          <span>Popular:</span>
          {heroPopularLinks.map((name, i) => {
            const tool = getToolByName(name)
            const isLast = i === heroPopularLinks.length - 1

            return (
              <span key={name}>
                {tool?.href ? (
                  <Link
                    href={tool.href}
                    className="text-white/60 hover:text-blue-400 transition-colors"
                  >
                    {name}
                  </Link>
                ) : (
                  <span className="text-white/50">{name}</span>
                )}
                {!isLast && <span className="mx-1.5 text-white/20">·</span>}
              </span>
            )
          })}
        </div>

        <p className="mt-6 text-xs text-white/25">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-white/40">
            ⌘K
          </kbd>{" "}
          to search {TOTAL_TOOL_COUNT}+ tools
        </p>
      </div>
    </section>
  )
}
