const features = [
  {
    icon: "⚡",
    title: "Fast",
    description: "All tools run instantly",
  },
  {
    icon: "🔒",
    title: "Private",
    description: "Files stay in your browser",
  },
  {
    icon: "💯",
    title: "Free",
    description: "No registration required",
  },
  {
    icon: "🌎",
    title: "Global",
    description: "Available everywhere",
  },
]

export default function WhyToolset() {
  return (
    <section className="px-6 py-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-10 text-center">
          Why ToolSetApp?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-2xl bg-[#1e293b]/50 border border-white/5"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-white/40">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
