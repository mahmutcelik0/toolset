import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import UnicodeTool from "@/components/encode/UnicodeTool"

export const metadata: Metadata = {
    title: "Unicode Encode - Encode Text to Unicode Online Free",
    description: "Metinleri Unicode formatına dönüştürün. Ücretsiz online Unicode encoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/unicode-encode" },
    openGraph: {
        title: "Unicode Encode - Online Tool",
        description: "Metinleri Unicode'a dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/unicode-encode",
        type: "website",
    },
    keywords: "unicode encode, unicode encoder, encode unicode, unicode converter",
}

export default function UnicodeEncodePage() {
    return (
        <ToolLayout
            title="Unicode Encode"
            description="Metinleri anında Unicode formatına dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="unicode-encode"
        >
            <UnicodeTool defaultMode="encode" />
        </ToolLayout>
    )
}