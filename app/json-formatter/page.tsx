// app/json-formatter/page.tsx
import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonFormatter from "@/components/JsonFormatter"

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description: "JSON kodunu anında formatla, doğrula ve minify et. Ücretsiz online araç.",
  alternates: { canonical: "https://toolsetapp.com" },
}

export default function Page() {
  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="JSON'u anında formatla, doğrula ve minify et — ücretsiz, kayıt gerektirmez."
    >
      <JsonFormatter />
    </ToolLayout>
  )
}