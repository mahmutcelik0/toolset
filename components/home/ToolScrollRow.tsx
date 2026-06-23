import ToolCard from "@/components/ToolCard"
import type { Tool } from "@/lib/tools"

interface ToolScrollRowProps {
  title: string
  emoji?: string
  badge?: string
  tools: Tool[]
}

export default function ToolScrollRow({ title, emoji, badge, tools }: ToolScrollRowProps) {
  if (tools.length === 0) return null

  return (
    <section className="py-8 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-5">
          {emoji && (
            <span className="text-xl" role="img" aria-hidden="true">
              {emoji}
            </span>
          )}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {badge && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} compact scroll />
          ))}
        </div>
      </div>
    </section>
  )
}
