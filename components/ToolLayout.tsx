import AdSlot from "./AdSlot"
import RelatedTools from "./RelatedTools"

export default function ToolLayout({
  title,
  description,
  toolId,
  children,
}: {
  title: string
  description: string
  toolId?: string
  children: React.ReactNode
}) {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-4">
      <AdSlot slot="1234567890" className="min-h-[72px]" />

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="text-sm text-white/40 mt-1">{description}</p>
      </div>

      {children}

      <AdSlot slot="0987654321" className="min-h-[90px] mt-2" />

      {toolId && <RelatedTools toolId={toolId} />}
    </main>
  )
}
