import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import RegexReplaceTester from "@/components/regex/RegexReplaceTester"

export const metadata: Metadata = {
    title: "Regex Replace Tester - Test Regular Expression Replacements",
    description: "Regex ile metin üzerinde replace işlemlerini test edin. Ücretsiz online regex replace tester aracı.",
    alternates: { canonical: "https://toolsetapp.com/regex-replace-tester" },
    openGraph: {
        title: "Regex Replace Tester - Test Regex Replacements",
        description: "Regex replace işlemlerini test et. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/regex-replace-tester",
        type: "website",
    },
    keywords: "regex replace tester, regex replace, replace regex, regex test, replace tester",
}

export default function RegexReplaceTesterPage() {
    return (
        <ToolLayout
            title="Regex Replace Tester"
            description="Regex ile metin üzerinde replace işlemlerini test edin — ücretsiz, kayıt gerektirmez."
            toolId="regex-replace-tester"
        >
            <RegexReplaceTester />
        </ToolLayout>
    )
}