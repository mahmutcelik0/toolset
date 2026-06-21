import { categories, getToolsByCategory } from "@/lib/tools"
import ToolCard from "./ToolCard"

export default function CategorySections() {
  return (
    <>
      {categories.map((cat) => {
        const catTools = getToolsByCategory(cat.id)
        if (catTools.length === 0) return null

        return (
          <section
            key={cat.id}
            id={cat.id}
            className="px-6 py-12 border-t border-white/5 scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {cat.emoji}
                </span>
                <h2 className="text-xl font-semibold text-white">{cat.name}</h2>
                <span className="text-xs text-white/30">{cat.toolCount} tools</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
