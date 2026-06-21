"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import {
  heroPopularLinks,
  searchTools,
  getToolByName,
  TOTAL_TOOL_COUNT,
  type Tool,
} from "@/lib/tools"

export default function HeroSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Tool[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(value: string) {
    setQuery(value)
    const matches = searchTools(value)
    setResults(matches)
    setOpen(value.trim().length > 0)
  }

  function navigateToTool(tool: Tool) {
    if (tool.href) {
      router.push(tool.href)
      setOpen(false)
      setQuery("")
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (results.length > 0 && results[0].href) {
      navigateToTool(results[0])
    }
  }

  return (
    <section className="relative px-6 pt-16 pb-20 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Free · Private · No signup required
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
          {TOTAL_TOOL_COUNT}+ Free Online Tools
        </h1>

        <p className="text-lg sm:text-xl text-white/50 mb-10">
          For Developers, PDFs, Images &amp; More
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => query.trim() && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search for a tool..."
              className="w-full h-14 pl-5 pr-14 rounded-2xl bg-[#1e293b] border border-white/10 text-white placeholder:text-white/30 text-base focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {open && results.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-2 py-2 rounded-2xl bg-[#1e293b] border border-white/10 shadow-xl text-left overflow-hidden">
              {results.map((tool) => (
                <li key={tool.id}>
                  <button
                    type="button"
                    onMouseDown={() => navigateToTool(tool)}
                    disabled={!tool.href}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{tool.name}</span>
                      <span className="block text-xs text-white/40 mt-0.5">{tool.description}</span>
                    </div>
                    {!tool.href && (
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full shrink-0 ml-3">
                        Soon
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {open && query.trim() && results.length === 0 && (
            <div className="absolute z-20 left-0 right-0 mt-2 py-4 px-5 rounded-2xl bg-[#1e293b] border border-white/10 text-sm text-white/40 text-left">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          )}
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-white/40">
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
      </div>
    </section>
  )
}
