import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import BcryptGenerator from "@/components/hash/BcryptGenerator"

export const metadata: Metadata = {
    title: "BCrypt Generator - Generate BCrypt Hash Online Free",
    description: "Metinlerin BCrypt hash'ini oluşturun. Güvenli şifre hash'leme için BCrypt üretici. Ücretsiz online BCrypt generator.",
    alternates: { canonical: "https://toolsetapp.com/bcrypt-generator" },
    openGraph: {
        title: "BCrypt Generator - Online Tool",
        description: "Metinlerin BCrypt hash'ini oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/bcrypt-generator",
        type: "website",
    },
    keywords: "bcrypt generator, bcrypt hash, generate bcrypt, bcrypt encoder, password hash, bcrypt",
}

export default function BcryptGeneratorPage() {
    return (
        <ToolLayout
            title="BCrypt Generator"
            description="Metinlerin BCrypt hash'ini anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="bcrypt-generator"
        >
            <BcryptGenerator />
        </ToolLayout>
    )
}