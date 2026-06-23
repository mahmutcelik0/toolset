"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { searchTools, TOTAL_TOOL_COUNT, type Tool } from "@/lib/tools"

interface ToolSearchProps {
  variant?: "hero" | "header" | "palette"
  autoFocus?: boolean
  onSelect?: () => void
  placeholder?: string
}

export default function ToolSearch({
  variant = "hero",
  autoFocus = false,
  onSelect,
  placeholder,
}: ToolSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Tool[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultPlaceholder =
    variant === "palette"
      ? "Search tools..."
      : `Search ${TOTAL_TOOL_COUNT}+ tools...`

  const inputClass =
    variant === "hero"
      ? "w-full h-14 pl-5 pr-14 rounded-2xl bg-[#1e293b] border border-white/10 text-white placeholder:text-white/30 text-base focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
      : variant === "palette"
        ? "w-full h-12 pl-11 pr-4 bg-transparent text-white placeholder:text-white/30 text-base focus:outline-none"
        : "w-full h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    const matches = searchTools(value, variant === "palette" ? 8 : 12)
    setResults(matches)
    setOpen(value.trim().length > 0)
    setActiveIndex(0)
  }, [variant])

  function navigateToTool(tool: Tool) {
    if (tool.href) {
      router.push(tool.href)
      setOpen(false)
      setQuery("")
      onSelect?.()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const available = results.filter((t) => t.href)
    if (available.length > 0) {
      navigateToTool(available[activeIndex] ?? available[0])
    }
  }

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open || results.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const tool = results[activeIndex]
        if (tool?.href) navigateToTool(tool)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        {variant !== "hero" && (
          <svg
            className={`absolute top-1/2 -translate-y-1/2 text-white/30 pointer-events-none ${variant === "palette" ? "left-4 w-4 h-4" : "left-3 w-4 h-4"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder ?? defaultPlaceholder}
          className={inputClass}
        />

        {variant === "hero" && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          className={`absolute z-50 left-0 right-0 mt-2 py-2 rounded-2xl bg-[#1e293b] border border-white/10 shadow-2xl text-left overflow-hidden ${
            variant === "palette" ? "max-h-80 overflow-y-auto" : ""
          }`}
        >
          {results.map((tool, i) => (
            <li key={tool.id}>
              <button
                type="button"
                onMouseDown={() => navigateToTool(tool)}
                disabled={!tool.href}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left ${
                  i === activeIndex ? "bg-white/8" : "hover:bg-white/5"
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-white/60 shrink-0">
                  {tool.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white">{tool.name}</span>
                  <span className="block text-xs text-white/40 mt-0.5 truncate">{tool.description}</span>
                </div>
                {!tool.href && (
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                    Soon
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 py-4 px-5 rounded-2xl bg-[#1e293b] border border-white/10 text-sm text-white/40 text-left">
          No tools found for &ldquo;{query}&rdquo;
        </div>
      )}
    </form>
  )
}
