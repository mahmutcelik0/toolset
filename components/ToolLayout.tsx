// components/ToolLayout.tsx
import AdSlot from "./AdSlot"

export default function ToolLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-4">
      {/* Header banner ad */}
      <AdSlot slot="1234567890" className="min-h-[72px]" />

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="text-sm text-white/40 mt-1">{description}</p>
      </div>

      {children}

      {/* Below-tool ad — en yüksek CTR bölgesi */}
      <AdSlot slot="0987654321" className="min-h-[90px] mt-2" />
    </main>
  )
}