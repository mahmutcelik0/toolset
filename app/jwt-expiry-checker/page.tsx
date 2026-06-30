import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JwtExpiryChecker from "@/components/jwt/JwtExpiryChecker"

export const metadata: Metadata = {
    title: "JWT Expiry Checker - Check JWT Token Expiration Online Free",
    description: "JWT token'larının süre dolumunu kontrol edin. iat, exp ve kalan süreyi görüntüleyin. Ücretsiz online JWT expiry checker.",
    alternates: { canonical: "https://toolsetapp.com/jwt-expiry-checker" },
    openGraph: {
        title: "JWT Expiry Checker - Online Tool",
        description: "JWT token'larının süre dolumunu kontrol et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/jwt-expiry-checker",
        type: "website",
    },
    keywords: "jwt expiry checker, jwt expiration, jwt token check, jwt validator, jwt expiry control",
}

export default function JwtExpiryCheckerPage() {
    return (
        <ToolLayout
            title="JWT Expiry Checker"
            description="JWT token'larının süre dolumunu anında kontrol edin — ücretsiz, kayıt gerektirmez."
            toolId="jwt-expiry-checker"
        >
            <JwtExpiryChecker />
        </ToolLayout>
    )
}