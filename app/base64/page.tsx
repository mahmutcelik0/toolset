import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import Base64Tool from "@/components/encode/Base64Tool"

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder",
  description: "Metni Base64'e encode et veya decode et. Anlık, ücretsiz online araç.",
}

export default function Page() {
  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Metni Base64'e çevir veya geri dönüştür." toolId="base64-decode">
      <Base64Tool />
    </ToolLayout>
  )
}