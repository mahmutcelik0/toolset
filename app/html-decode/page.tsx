import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import HtmlTool from "@/components/encode/HtmlTool"

export const metadata: Metadata = {
    title: "HTML Decode - Decode HTML Entities Online Free",
    description: "Encoded HTML entity'leri decode edin. Ücretsiz online HTML decoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/html-decode" },
    openGraph: {
        title: "HTML Decode - Online Tool",
        description: "Encoded HTML entity'lerini decode et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/html-decode",
        type: "website",
    },
    keywords: "html decode, html decoder, decode html, html entities, html special characters",
}

export default function HtmlDecodePage() {
    return (
        <ToolLayout
            title="HTML Decode"
            description="Encoded HTML entity'lerini anında decode edin — ücretsiz, kayıt gerektirmez."
            toolId="html-decode"
        >
            <HtmlTool defaultMode="decode" />
        </ToolLayout>
    )
}