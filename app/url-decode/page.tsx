import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import UrlTool from "@/components/encode/UrlTool"

export const metadata: Metadata = {
    title: "URL Decoder - Decode URLs Online Free",
    description: "Encoded URL'leri decode edin. Ücretsiz online URL decoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/url-decode" },
    openGraph: {
        title: "URL Decoder - Decode URLs Online",
        description: "Encoded URL'leri decode et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/url-decode",
        type: "website",
    },
    keywords: "url decode, url decoder, decode url, url decoding, url çözümleme",
}

export default function UrlDecodePage() {
    return (
        <ToolLayout
            title="URL Decoder"
            description="Encoded URL'leri anında decode edin — ücretsiz, kayıt gerektirmez."
            toolId="url-decode"
        >
            <UrlTool />
        </ToolLayout>
    )
}