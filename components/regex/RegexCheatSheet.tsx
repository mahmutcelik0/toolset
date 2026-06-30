"use client"

import { useState } from "react"

interface CheatSheetItem {
    category: string
    items: {
        pattern: string
        description: string
        example?: string
    }[]
}

const cheatSheetData: CheatSheetItem[] = [
    {
        category: "Temel Metakarakterler",
        items: [
            { pattern: ".", description: "Herhangi bir karakter (satır sonu hariç)", example: "a.b → aab, acb" },
            { pattern: "^", description: "Satır başı", example: "^abc → abc ile başlayan" },
            { pattern: "$", description: "Satır sonu", example: "abc$ → abc ile biten" },
            { pattern: "\\", description: "Kaçış karakteri", example: "\\. → literal nokta" },
            { pattern: "|", description: "VEYA", example: "a|b → a veya b" },
            { pattern: "()", description: "Grup", example: "(abc)+ → abc tekrarı" },
        ]
    },
    {
        category: "Miktar Belirleyiciler (Quantifiers)",
        items: [
            { pattern: "*", description: "0 veya daha fazla", example: "a* → '', a, aa, aaa..." },
            { pattern: "+", description: "1 veya daha fazla", example: "a+ → a, aa, aaa..." },
            { pattern: "?", description: "0 veya 1", example: "a? → '' veya a" },
            { pattern: "{n}", description: "Tam olarak n", example: "a{3} → aaa" },
            { pattern: "{n,}", description: "n veya daha fazla", example: "a{2,} → aa, aaa..." },
            { pattern: "{n,m}", description: "n ile m arası", example: "a{2,4} → aa, aaa, aaaa" },
        ]
    },
    {
        category: "Karakter Sınıfları",
        items: [
            { pattern: "[abc]", description: "a, b veya c'den biri", example: "[aeiou] → sesli harf" },
            { pattern: "[^abc]", description: "a, b veya c hariç", example: "[^0-9] → rakam olmayan" },
            { pattern: "[a-z]", description: "a'dan z'ye kadar", example: "[a-zA-Z] → harf" },
            { pattern: "[A-Z]", description: "A'dan Z'ye kadar", example: "[A-Z] → büyük harf" },
            { pattern: "[0-9]", description: "0'dan 9'a kadar", example: "[0-9] → rakam" },
        ]
    },
    {
        category: "Özel Karakter Sınıfları",
        items: [
            { pattern: "\\d", description: "Rakam [0-9]", example: "\\d+ → 123, 456" },
            { pattern: "\\D", description: "Rakam olmayan [^0-9]", example: "\\D+ → abc, !@#" },
            { pattern: "\\w", description: "Kelime karakteri [a-zA-Z0-9_]", example: "\\w+ → abc_123" },
            { pattern: "\\W", description: "Kelime olmayan karakter", example: "\\W+ → !@#" },
            { pattern: "\\s", description: "Boşluk karakteri", example: "\\s+ → boşluk, tab" },
            { pattern: "\\S", description: "Boşluk olmayan karakter", example: "\\S+ → abc123" },
            { pattern: "\\b", description: "Kelime sınırı", example: "\\bcat\\b → cat kelimesi" },
            { pattern: "\\B", description: "Kelime sınırı değil", example: "\\Bcat\\B → cat içinde" },
        ]
    },
    {
        category: "Lookaround (Öne/Arkaya Bakma)",
        items: [
            { pattern: "(?=...)", description: "Positive lookahead", example: "a(?=b) → ardından b gelen a" },
            { pattern: "(?!...)", description: "Negative lookahead", example: "a(?!b) → ardından b gelmeyen a" },
            { pattern: "(?<=...)", description: "Positive lookbehind", example: "(?<=a)b → öncesinde a olan b" },
            { pattern: "(?<!...)", description: "Negative lookbehind", example: "(?<!a)b → öncesinde a olmayan b" },
        ]
    },
    {
        category: "Eşleşen Gruplar",
        items: [
            { pattern: "(abc)", description: "Yakalayan grup", example: "(abc)+ → abcabc" },
            { pattern: "(?:abc)", description: "Yakalamayan grup", example: "(?:abc)+ → grup olarak kaydetmez" },
            { pattern: "(?P<name>...)", description: "Adlandırılmış grup", example: "(?P<id>\\d+) → id grubu" },
            { pattern: "\\1", description: "Geri referans", example: "(a)b\\1 → aba" },
        ]
    },
    {
        category: "Yaygın Regex Desenleri",
        items: [
            { pattern: "\\d{4}-\\d{2}-\\d{2}", description: "Tarih (YYYY-MM-DD)", example: "2026-06-27" },
            { pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Email", example: "ornek@email.com" },
            { pattern: "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)", description: "URL", example: "https://ornek.com" },
            { pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", description: "IPv4", example: "192.168.1.1" },
            { pattern: "\\+?[0-9]{1,3}?[ -]?[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{4}", description: "Telefon", example: "+90 555 123 4567" },
        ]
    },
    {
        category: "Alt Bilgiler",
        items: [
            { pattern: "i", description: "Büyük/küçük harf duyarsız", example: "/abc/i → ABC, Abc, abc" },
            { pattern: "g", description: "Global eşleşme (tümünü bul)", example: "/a/g → tüm 'a' karakterleri" },
            { pattern: "m", description: "Çok satırlı mod", example: "/^abc/m → her satır başı" },
            { pattern: "s", description: "DotAll (. satır sonunu da eşleştir)", example: "/a.b/s → a\nb" },
            { pattern: "u", description: "Unicode modu", example: "/\\p{L}/u → Unicode harf" },
        ]
    }
]

export default function RegexCheatSheet() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    // Kategorileri al
    const categories = ["all", ...cheatSheetData.map(c => c.category)]

    // Filtrele
    const filteredData = cheatSheetData
        .filter(category => selectedCategory === "all" || category.category === selectedCategory)
        .map(category => ({
            ...category,
            items: category.items.filter(item =>
                item.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.example && item.example.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }))
        .filter(category => category.items.length > 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">Regex Cheat Sheet</h1>
                <p className="text-white/40">Quick reference for regular expression syntax</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search regex patterns..."
                    className="flex-1 min-w-[200px] px-4 py-2 bg-[#1a1d27] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-400"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-[#1a1d27] border border-white/10 rounded-lg text-sm text-white outline-none focus:border-indigo-400"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat === "all" ? "📋 Tüm Kategoriler" : cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Cheat Sheet Content */}
            <div className="space-y-6">
                {filteredData.map((category, idx) => (
                    <div key={idx} className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-[#22263a] border-b border-white/8">
                            <h2 className="text-sm font-semibold text-white/80">{category.category}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Pattern</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-white/30 uppercase tracking-wider hidden md:table-cell">Example</th>
                                </tr>
                                </thead>
                                <tbody>
                                {category.items.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-mono text-yellow-200 whitespace-nowrap">
                                            {item.pattern}
                                        </td>
                                        <td className="px-4 py-3 text-white/70">
                                            {item.description}
                                        </td>
                                        <td className="px-4 py-3 text-white/40 font-mono text-xs hidden md:table-cell">
                                            {item.example || "-"}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-white/30">
                        Sonuç bulunamadı. Farklı bir arama terimi deneyin.
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-white/20 pt-4 border-t border-white/5">
                Pattern'lar JavaScript regex sözdizimine göredir. Farklı dillerde küçük farklılıklar olabilir.
            </div>
        </div>
    )
}