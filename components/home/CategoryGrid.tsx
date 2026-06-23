import Link from "next/link"
import { categories } from "@/lib/tools"

export default function CategoryGrid() {
  return (
    <section className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex items-center justify-between p-5 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-200 no-underline"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {cat.emoji}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/40 mt-0.5">{cat.description}</p>
                </div>
              </div>
              <span className="text-sm text-white/30 group-hover:text-blue-400 transition-colors shrink-0 ml-4">
                {cat.toolCount} Tools →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
