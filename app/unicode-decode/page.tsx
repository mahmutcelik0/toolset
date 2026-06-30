import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import UnicodeTool from "@/components/encode/UnicodeTool"

export const metadata: Metadata = {
    title: "Unicode Decode - Decode Unicode to Text Online Free",
    description: "Unicode kodlarını metne dönüştürün. Ücretsiz online Unicode decoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/unicode-decode" },
    openGraph: {
        title: "Unicode Decode - Online Tool",
        description: "Unicode'u metne dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/unicode-decode",
        type: "website",
    },
    keywords: "unicode decode, unicode decoder, decode unicode, unicode converter",
}

export default function UnicodeDecodePage() {
    return (
        <ToolLayout
            title="Unicode Decode"
            description="Unicode kodlarını anında metne dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="unicode-decode"
        >
            <UnicodeTool defaultMode="decode" />
        </ToolLayout>
    )
}