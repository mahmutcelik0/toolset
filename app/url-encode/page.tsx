import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import UrlTool from "@/components/encode/UrlTool"

export const metadata: Metadata = {
    title: "URL Encode - Encode URLs Online Free",
    description: "URL'leri encode edin. Ücretsiz online URL encoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/url-encode" },
    openGraph: {
        title: "URL Encode - Online Tool",
        description: "URL'leri encode et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/url-encode",
        type: "website",
    },
    keywords: "url encode, url encoder, encode url, url encoding",
}

export default function UrlEncodePage() {
    return (
        <ToolLayout
            title="URL Encode"
            description="URL'leri anında encode edin — ücretsiz, kayıt gerektirmez."
            toolId="url-encode"
        >
            <UrlTool defaultMode="encode" />
        </ToolLayout>
    )
}