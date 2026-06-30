import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import Md5Generator from "@/components/hash/Md5Generator"

export const metadata: Metadata = {
    title: "MD5 Generator - Generate MD5 Hash Online Free",
    description: "Metinlerin MD5 hash'ini oluşturun. 128-bit MD5 hash üretici. Ücretsiz online MD5 generator aracı.",
    alternates: { canonical: "https://toolsetapp.com/md5-generator" },
    openGraph: {
        title: "MD5 Generator - Online Tool",
        description: "Metinlerin MD5 hash'ini oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/md5-generator",
        type: "website",
    },
    keywords: "md5 generator, md5 hash, generate md5, md5 encoder, hash generator",
}

export default function Md5GeneratorPage() {
    return (
        <ToolLayout
            title="MD5 Generator"
            description="Metinlerin MD5 hash'ini anında oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="md5-generator"
        >
            <Md5Generator />
        </ToolLayout>
    )
}