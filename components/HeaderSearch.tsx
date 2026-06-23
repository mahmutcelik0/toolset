"use client"

import { useState } from "react"
import ToolSearch from "@/components/ToolSearch"

export default function HeaderSearch() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/30 text-left flex items-center justify-between hover:border-white/20 transition-colors"
      >
        <span>Search 500+ tools...</span>
        <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-white/30">
          ⌘K
        </kbd>
      </button>
    )
  }

  return <ToolSearch variant="header" autoFocus onSelect={() => setOpen(false)} />
}
