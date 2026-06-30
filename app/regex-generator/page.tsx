import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import RegexGenerator from "@/components/regex/RegexGenerator"

export const metadata: Metadata = {
    title: "Regex Generator - Create Regular Expressions Online Free",
    description: "Metinlerden otomatik regex oluşturun. Email, URL, telefon, tarih ve daha fazlası için ücretsiz regex generator.",
    alternates: { canonical: "https://toolsetapp.com/regex-generator" },
    openGraph: {
        title: "Regex Generator - Create Regular Expressions Online",
        description: "Regex desenlerini otomatik oluştur. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/regex-generator",
        type: "website",
    },
    keywords: "regex generator, generate regex, create regex, regex builder, regular expression generator",
}

export default function RegexGeneratorPage() {
    return (
        <ToolLayout
            title="Regex Generator"
            description="Metinlerden otomatik regex oluşturun — ücretsiz, kayıt gerektirmez."
            toolId="regex-generator"
        >
            <RegexGenerator />
        </ToolLayout>
    )
}