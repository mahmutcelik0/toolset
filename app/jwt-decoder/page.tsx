import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JwtDecoder from "@/components/jwt/JwtDecoder"

export const metadata: Metadata = {
    title: "JWT Decoder - Decode JWT Tokens Online Free",
    description: "JWT token'larını decode edin, header ve payload'ı görüntüleyin. Ücretsiz online JWT decoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/jwt-decoder" },
    openGraph: {
        title: "JWT Decoder - Online Tool",
        description: "JWT token'larını decode et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/jwt-decoder",
        type: "website",
    },
    keywords: "jwt decoder, decode jwt, jwt token decoder, jwt parser, json web token",
}

export default function JwtDecoderPage() {
    return (
        <ToolLayout
            title="JWT Decoder"
            description="JWT token'larını anında decode edin — ücretsiz, kayıt gerektirmez."
            toolId="jwt-decoder"
        >
            <JwtDecoder />
        </ToolLayout>
    )
}