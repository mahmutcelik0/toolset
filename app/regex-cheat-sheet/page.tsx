import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import RegexCheatSheet from "@/components/regex/RegexCheatSheet"

export const metadata: Metadata = {
    title: "Regex Cheat Sheet - Quick Reference for Regular Expressions",
    description: "Regex sözdizimi için hızlı başvuru. Tüm metakarakterler, quantifier'lar, karakter sınıfları ve yaygın pattern'lar tek sayfada.",
    alternates: { canonical: "https://toolsetapp.com/regex-cheat-sheet" },
    openGraph: {
        title: "Regex Cheat Sheet - Quick Reference",
        description: "Regular expression syntax için hızlı başvuru sayfası.",
        url: "https://toolsetapp.com/regex-cheat-sheet",
        type: "website",
    },
    keywords: "regex cheat sheet, regular expression reference, regex syntax, regex quick guide",
}

export default function RegexCheatSheetPage() {
    return (
        <ToolLayout
            title="Regex Cheat Sheet"
            description="Quick reference for regular expression syntax"
            toolId="regex-cheat-sheet"
        >
            <RegexCheatSheet />
        </ToolLayout>
    )
}