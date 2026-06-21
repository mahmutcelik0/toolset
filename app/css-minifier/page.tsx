import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import CSSTools from "@/components/CSSTools"

export const metadata: Metadata = {
  title: "CSS Minifier & Beautifier",
  description: "CSS kodunu minify et veya formatla. Ücretsiz online araç.",
}

export default function Page() {
  return (
    <ToolLayout title="CSS Minifier & Beautifier" description="CSS'i minify et, boyutunu küçült veya güzel formatla.">
      <CSSTools />
    </ToolLayout>
  )
}