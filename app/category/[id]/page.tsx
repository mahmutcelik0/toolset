import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ToolCard from "@/components/ToolCard"
import {
  categories,
  groups,
  getCategory,
  getToolsByCategory,
  getToolsByGroup,
  type ToolCategoryId,
  type ToolGroupId,
} from "@/lib/tools"

interface PageProps {
  params: Promise<{ id: ToolCategoryId }>
}

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const category = getCategory(id)
  if (!category) return { title: "Category Not Found" }

  return {
    title: `${category.name} — Free Online Tools`,
    description: `${category.toolCount}+ free ${category.name.toLowerCase()}. ${category.description}`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params
  const category = getCategory(id)
  if (!category) notFound()

  const categoryTools = getToolsByCategory(id)
  const isDeveloper = id === "developer"

  const groupedTools = isDeveloper
    ? groups
        .map((group) => ({
          group,
          tools: getToolsByGroup(group.id as ToolGroupId),
        }))
        .filter(({ tools }) => tools.length > 0)
    : null

  return (
    <main className="flex-1 bg-[#0f172a]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-4xl" role="img" aria-hidden="true">
            {category.emoji}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-white/40 mt-1">{category.description}</p>
          </div>
        </div>
        <p className="text-sm text-white/30 mb-10">{categoryTools.length} tools available</p>

        {groupedTools ? (
          <div className="space-y-12">
            {groupedTools.map(({ group, tools: groupToolsList }) => (
              <section key={group.id}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-sm font-mono text-white/50">
                    {group.icon}
                  </span>
                  <h2 className="text-lg font-semibold text-white">{group.name}</h2>
                  <span className="text-xs text-white/30">{groupToolsList.length} tools</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupToolsList.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
