import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import Sha512Generator from "@/components/hash/Sha512Generator"

export const metadata: Metadata = {
    title: "SHA-512 Generator - Generate SHA-512 Hash Online Free",
    description: "Metinlerin SHA-512 hash'ini oluşturun. 512-bit SHA-512 hash üretici. Ücretsiz online SHA-512 generator aracı.",
    alternates: { canonical: "https://toolsetapp.com/sha512-generator" },
    openGraph: {
        title: "SHA-512 Generator - Online Tool",
        description: "Metinlerin SHA-512 hash'ini oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/sha512-generator",
        type: "website",
    },
    keywords: "sha512 generator, sha512 hash, generate sha512, sha512 encoder, hash generator, sha-512",
}

export default function Sha512GeneratorPage() {
    return (
        <ToolLayout
            title="SHA-512 Generator"
            description="Metinlerin SHA-512 hash'ini anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="sha512-generator"
        >
            <Sha512Generator />
        </ToolLayout>
    )
}