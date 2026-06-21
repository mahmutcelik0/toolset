import Link from "next/link"
import { categories } from "@/lib/tools"

export default function CategoryGrid() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/#${cat.id}`}
              className="group block p-6 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-blue-500/30 hover:scale-[1.03] transition-all duration-200 no-underline"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {cat.emoji}
                </span>
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  {cat.toolCount} Tools
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-sm text-white/40">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
