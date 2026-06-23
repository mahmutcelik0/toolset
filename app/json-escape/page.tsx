import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonEscape from "@/components/json/JsonEscape"

export const metadata: Metadata = {
    title: "JSON Escape / Unescape - Free Online Tool",
    description: "JSON özel karakterlerini escape edin veya unescape yapın. Ücretsiz online JSON escape/unescape aracı.",
    alternates: { canonical: "https://toolsetapp.com/json-escape" },
    openGraph: {
        title: "JSON Escape / Unescape - Online Tool",
        description: "JSON özel karakterlerini escape et veya unescape yap. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/json-escape",
        type: "website",
    },
    keywords: "json escape, json unescape, escape json, unescape json, json special characters",
}

export default function JsonEscapePage() {
    return (
        <ToolLayout
            title="JSON Escape / Unescape"
            description="JSON özel karakterlerini escape edin veya unescape yapın — ücretsiz, kayıt gerektirmez."
            toolId="json-escape"
        >
            <JsonEscape />
        </ToolLayout>
    )
}