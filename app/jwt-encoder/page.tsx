import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JwtEncoder from "@/components/jwt/JwtEncoder"

export const metadata: Metadata = {
    title: "JWT Encoder - Generate JWT Tokens Online Free",
    description: "JWT token'ları oluşturun. Header, payload ve secret ile JWT encode edin. Ücretsiz online JWT encoder aracı.",
    alternates: { canonical: "https://toolsetapp.com/jwt-encoder" },
    openGraph: {
        title: "JWT Encoder - Online Tool",
        description: "JWT token'ları oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/jwt-encoder",
        type: "website",
    },
    keywords: "jwt encoder, generate jwt, jwt token generator, jwt creator, json web token",
}

export default function JwtEncoderPage() {
    return (
        <ToolLayout
            title="JWT Encoder"
            description="JWT token'larını anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="jwt-encoder"
        >
            <JwtEncoder />
        </ToolLayout>
    )
}