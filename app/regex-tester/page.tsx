import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import RegexTester from "@/components/regex/RegexTester"

export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Regex pattern'larını online test et. Anlık eşleşme highlight, flag desteği.",
}

export default function Page() {
  return (
    <ToolLayout title="Regex Tester" description="Pattern yaz, eşleşmeleri anlık gör." toolId="regex-tester">
      <RegexTester />
    </ToolLayout>
  )
}