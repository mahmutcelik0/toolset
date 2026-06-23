import ToolCard from "@/components/ToolCard"
import { getRelatedTools } from "@/lib/tools"

interface RelatedToolsProps {
  toolId: string
}

export default function RelatedTools({ toolId }: RelatedToolsProps) {
  const related = getRelatedTools(toolId)

  if (related.length === 0) return null

  return (
    <section className="mt-8 pt-8 border-t border-white/8">
      <h2 className="text-lg font-semibold text-white mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} compact />
        ))}
      </div>
    </section>
  )
}
