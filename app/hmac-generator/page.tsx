import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import HmacGenerator from "@/components/hash/HmacGenerator"

export const metadata: Metadata = {
    title: "HMAC Generator - Generate HMAC Hash Online Free",
    description: "HMAC (Hash-based Message Authentication Code) oluşturun. SHA-1, SHA-256, SHA-384, SHA-512 desteği. Ücretsiz online HMAC generator.",
    alternates: { canonical: "https://toolsetapp.com/hmac-generator" },
    openGraph: {
        title: "HMAC Generator - Online Tool",
        description: "HMAC hash oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/hmac-generator",
        type: "website",
    },
    keywords: "hmac generator, hmac hash, generate hmac, hmac sha256, hmac sha512, message authentication code",
}

export default function HmacGeneratorPage() {
    return (
        <ToolLayout
            title="HMAC Generator"
            description="HMAC (Hash-based Message Authentication Code) oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="hmac-generator"
        >
            <HmacGenerator />
        </ToolLayout>
    )
}