import { popularTools } from "@/lib/tools"
import ToolCard from "./ToolCard"

export default function PopularTools() {
  return (
    <section className="px-6 py-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-semibold text-white">Popular Tools</h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}
