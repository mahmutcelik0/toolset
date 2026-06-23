// app/json-minifier/page.tsx

import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonMinifier from "@/components/json/JsonMinifier"

export const metadata: Metadata = {
  title: "JSON Minifier - Compress & Minify JSON Online Free",
  description: "JSON verilerini anında küçült, gereksiz boşlukları kaldır ve dosya boyutunu azalt. Ücretsiz online JSON minify aracı.",
  alternates: { canonical: "https://toolsetapp.com/json-minifier" },
  openGraph: {
    title: "JSON Minifier - Compress JSON Data Online",
    description: "JSON'u anında minify et, boşlukları kaldır ve dosya boyutunu küçült. Ücretsiz, kayıt gerekmez.",
    url: "https://toolsetapp.com/json-minifier",
    type: "website",
  },
  keywords: "json minifier, minify json, compress json, json compressor, json küçültme",
}

export default function Page() {
  return (
      <ToolLayout
          title="JSON Minifier"
          description="JSON'u anında küçült, gereksiz boşlukları kaldır ve dosya boyutunu azalt — ücretsiz, kayıt gerektirmez."
          toolId="json-minifier"
      >
        <JsonMinifier />
      </ToolLayout>
  )
}