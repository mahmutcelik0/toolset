import Link from "next/link"
import type { Tool } from "@/lib/tools"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const inner = (
    <>
      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm text-white/40 line-clamp-2">{tool.description}</p>
      {!tool.href && (
        <span className="inline-block mt-3 text-xs font-medium text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      )}
    </>
  )

  const className =
    "group block p-5 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-200 no-underline"

  if (tool.href) {
    return (
      <Link href={tool.href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={`${className} opacity-70 cursor-default hover:scale-100 hover:border-white/5`}>{inner}</div>
}
