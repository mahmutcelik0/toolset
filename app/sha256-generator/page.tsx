import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import Sha256Generator from "@/components/hash/Sha256Generator"

export const metadata: Metadata = {
    title: "SHA-256 Generator - Generate SHA-256 Hash Online Free",
    description: "Metinlerin SHA-256 hash'ini oluşturun. 256-bit SHA-256 hash üretici. Ücretsiz online SHA-256 generator aracı.",
    alternates: { canonical: "https://toolsetapp.com/sha256-generator" },
    openGraph: {
        title: "SHA-256 Generator - Online Tool",
        description: "Metinlerin SHA-256 hash'ini oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/sha256-generator",
        type: "website",
    },
    keywords: "sha256 generator, sha256 hash, generate sha256, sha256 encoder, hash generator, sha-256",
}

export default function Sha256GeneratorPage() {
    return (
        <ToolLayout
            title="SHA-256 Generator"
            description="Metinlerin SHA-256 hash'ini anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="sha256-generator"
        >
            <Sha256Generator />
        </ToolLayout>
    )
}