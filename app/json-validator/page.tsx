import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonValidator from "@/components/json/JsonValidator"

export const metadata: Metadata = {
  title: "JSON Validator - Check JSON Syntax Online Free",
  description: "JSON verilerinin geçerliliğini kontrol edin, hataları tespit edin. Ücretsiz online JSON doğrulama aracı.",
  alternates: { canonical: "https://toolsetapp.com/json-validator" },
  openGraph: {
    title: "JSON Validator - Validate JSON Online",
    description: "JSON kodunuzu doğrulayın ve hataları bulun. Ücretsiz, kayıt gerekmez.",
    url: "https://toolsetapp.com/json-validator",
    type: "website",
  },
  keywords: "json validator, validate json, json checker, json syntax checker",
}

export default function JsonValidatorPage() {
  return (
      <ToolLayout
          title="JSON Validator"
          description="JSON verilerinin geçerliliğini kontrol edin, hataları tespit edin — ücretsiz, kayıt gerektirmez."
          toolId="json-validator"
      >
        <JsonValidator />
      </ToolLayout>
  )
}