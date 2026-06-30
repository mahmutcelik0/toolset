import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import Sha1Generator from "@/components/hash/Sha1Generator"

export const metadata: Metadata = {
    title: "SHA-1 Generator - Generate SHA-1 Hash Online Free",
    description: "Metinlerin SHA-1 hash'ini oluşturun. 160-bit SHA-1 hash üretici. Ücretsiz online SHA-1 generator aracı.",
    alternates: { canonical: "https://toolsetapp.com/sha1-generator" },
    openGraph: {
        title: "SHA-1 Generator - Online Tool",
        description: "Metinlerin SHA-1 hash'ini oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/sha1-generator",
        type: "website",
    },
    keywords: "sha1 generator, sha1 hash, generate sha1, sha1 encoder, hash generator",
}

export default function Sha1GeneratorPage() {
    return (
        <ToolLayout
            title="SHA-1 Generator"
            description="Metinlerin SHA-1 hash'ini anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="sha1-generator"
        >
            <Sha1Generator />
        </ToolLayout>
    )
}