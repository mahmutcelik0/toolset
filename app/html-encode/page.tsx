import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import HtmlTool from "@/components/encode/HtmlTool"

export const metadata: Metadata = {
    title: "HTML Encode - Encode HTML Entities Online Free",
    description: "HTML özel karakterlerini encode edin. XSS koruması için ücretsiz online HTML encoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/html-encode" },
    openGraph: {
        title: "HTML Encode - Online Tool",
        description: "HTML özel karakterlerini encode et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/html-encode",
        type: "website",
    },
    keywords: "html encode, html encoder, encode html, html entities, html special characters",
}

export default function HtmlEncodePage() {
    return (
        <ToolLayout
            title="HTML Encode"
            description="HTML özel karakterlerini anında encode edin — ücretsiz, kayıt gerektirmez."
            toolId="html-encode"
        >
            <HtmlTool defaultMode="encode" />
        </ToolLayout>
    )
}