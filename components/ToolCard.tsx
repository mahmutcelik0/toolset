import Link from "next/link"
import type { Tool } from "@/lib/tools"

interface ToolCardProps {
  tool: Tool
  compact?: boolean
  scroll?: boolean
}

export default function ToolCard({ tool, compact = false, scroll = false }: ToolCardProps) {
  const inner = (
    <>
      <div className={`flex items-start gap-3 ${compact ? "" : "mb-1"}`}>
        <span
          className={`shrink-0 rounded-lg bg-white/5 flex items-center justify-center font-mono text-white/50 ${
            compact ? "w-9 h-9 text-xs" : "w-10 h-10 text-sm"
          }`}
        >
          {tool.icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-white group-hover:text-blue-400 transition-colors ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {tool.name}
          </h3>
          <p className={`text-white/40 line-clamp-2 ${compact ? "text-xs mt-0.5" : "text-sm mt-1"}`}>
            {tool.description}
          </p>
        </div>
      </div>
      {!tool.href && (
        <span className="inline-block mt-2 text-xs font-medium text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      )}
    </>
  )

  const className = compact
    ? `group block p-4 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-blue-500/30 transition-all duration-200 no-underline ${scroll ? "w-[260px] shrink-0" : ""}`
    : "group block p-5 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-200 no-underline"

  if (tool.href) {
    return (
      <Link href={tool.href} className={className}>
        {inner}
      </Link>
    )
  }

  return (
    <div className={`${className} opacity-70 cursor-default hover:scale-100 hover:border-white/5`}>
      {inner}
    </div>
  )
}
