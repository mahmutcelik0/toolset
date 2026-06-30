"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = `Ahmet Yılmaz
Email: ahmet@ornek.com
Telefon: +90 555 123 45 67
Web: https://www.ornek.com
Tarih: 2026-06-27
IP: 192.168.1.1`

const SAMPLE_PATTERN = `\\d{4}-\\d{2}-\\d{2}`
const SAMPLE_REPLACEMENT = `DD.MM.YYYY`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface MatchInfo {
    value: string
    index: number
    replacement: string
}

export default function RegexReplaceTester() {
    const [pattern, setPattern] = useState<string>(SAMPLE_PATTERN)
    const [replacement, setReplacement] = useState<string>(SAMPLE_REPLACEMENT)
    const [text, setText] = useState<string>(SAMPLE_TEXT)
    const [flags, setFlags] = useState<string>("g")
    const [result, setResult] = useState<string>("")
    const [matches, setMatches] = useState<MatchInfo[]>([])
    const [matchCount, setMatchCount] = useState<number>(0)
    const [isValid, setIsValid] = useState<boolean>(true)
    const [status, setStatus] = useState<Status>({
        type: "ok",
        msg: "✅ Regex geçerli",
        meta: "0 eşleşme"
    })
    const [toast, setToast] = useState<string>("")
    const [highlightedText, setHighlightedText] = useState<string>("")
    const [highlightedResult, setHighlightedResult] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Replace işlemi
    const processReplace = useCallback((pat: string, rep: string, txt: string, fl: string) => {
        if (!pat.trim() || !txt.trim()) {
            setResult(txt)
            setMatches([])
            setMatchCount(0)
            setIsValid(true)
            setHighlightedText(txt)
            setHighlightedResult(txt)
            setStatus({
                type: "idle",
                msg: "Regex deseni ve metin girin"
            })
            return
        }

        try {
            let flagStr = fl || "g"
            const regex = new RegExp(pat, flagStr)

            // Eşleşmeleri bul
            const matchList: MatchInfo[] = []
            let match: RegExpExecArray | null
            const tempRegex = new RegExp(pat, flagStr.includes('g') ? flagStr : flagStr + 'g')

            while ((match = tempRegex.exec(txt)) !== null) {
                let replacementText = rep
                // $1, $2, $3 gibi grup referanslarını değiştir
                if (match.length > 1) {
                    for (let i = 1; i < match.length; i++) {
                        replacementText = replacementText.replace(new RegExp(`\\$${i}`, 'g'), match[i] || '')
                    }
                }
                // $& tüm eşleşme için
                replacementText = replacementText.replace(/\$&/g, match[0])

                matchList.push({
                    value: match[0],
                    index: match.index,
                    replacement: replacementText
                })
            }

            // Replace işlemini gerçekleştir
            const resultText = txt.replace(regex, rep)
            setResult(resultText)
            setMatches(matchList)
            setMatchCount(matchList.length)
            setIsValid(true)

            // Highlight metinler
            const highlighted = highlightMatches(txt, regex)
            setHighlightedText(highlighted)

            const highlightedResultText = highlightResult(resultText, matchList)
            setHighlightedResult(highlightedResultText)

            setStatus({
                type: "ok",
                msg: "✅ Regex geçerli",
                meta: `${matchList.length} eşleşme`
            })
        } catch (e) {
            const error = e as Error
            setMatches([])
            setMatchCount(0)
            setIsValid(false)
            setResult(txt)
            setHighlightedText(txt)
            setHighlightedResult(txt)
            setStatus({
                type: "error",
                msg: `❌ Geçersiz regex: ${error.message}`
            })
        }
    }, [])

    // Metin highlight et (eşleşmeleri göster)
    const highlightMatches = (txt: string, regex: RegExp): string => {
        if (!txt) return ""

        const escaped = txt
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")

        try {
            const parts: string[] = []
            let lastIndex = 0
            let match: RegExpExecArray | null

            const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g'
            const globalRegex = new RegExp(regex.source, flags)

            while ((match = globalRegex.exec(txt)) !== null) {
                const start = match.index
                const end = start + match[0].length

                if (start > lastIndex) {
                    parts.push(escaped.substring(lastIndex, start))
                }

                const matchedText = escaped.substring(start, end)
                parts.push(`<span class="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">${matchedText}</span>`)

                lastIndex = end
            }

            if (lastIndex < escaped.length) {
                parts.push(escaped.substring(lastIndex))
            }

            return parts.join('')
        } catch {
            return escaped
        }
    }

    // Sonuç highlight et (değişen yerleri göster)
    const highlightResult = (txt: string, matchList: MatchInfo[]): string => {
        if (!txt || matchList.length === 0) return txt

        const escaped = txt
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")

        try {
            let result = escaped
            // Tersten sırala ki index'ler bozulmasın
            const sortedMatches = [...matchList].sort((a, b) => b.index - a.index)

            for (const match of sortedMatches) {
                const originalText = match.value
                const replacementText = match.replacement

                // Original text'i bul ve replace et
                const escapedOriginal = originalText
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")

                const escapedReplacement = replacementText
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")

                // Sadece ilk bulunanı değiştir (index bazlı)
                const regex = new RegExp(escapedOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
                let count = 0
                result = result.replace(regex, (match) => {
                    count++
                    if (count === 1) {
                        return `<span class="bg-emerald-500/30 text-emerald-200 px-0.5 rounded">${escapedReplacement}</span>`
                    }
                    return match
                })
            }

            return result
        } catch {
            return escaped
        }
    }

    // Pattern değişikliği
    const onPatternChange = useCallback((val: string) => {
        setPattern(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processReplace(val, replacement, text, flags), 300)
    }, [replacement, text, flags, processReplace])

    // Replacement değişikliği
    const onReplacementChange = useCallback((val: string) => {
        setReplacement(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processReplace(pattern, val, text, flags), 300)
    }, [pattern, text, flags, processReplace])

    // Text değişikliği
    const onTextChange = useCallback((val: string) => {
        setText(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processReplace(pattern, replacement, val, flags), 300)
    }, [pattern, replacement, flags, processReplace])

    // Flags değişikliği
    const onFlagChange = useCallback((flag: string) => {
        let newFlags = flags
        if (newFlags.includes(flag)) {
            newFlags = newFlags.replace(flag, '')
        } else {
            newFlags += flag
        }
        setFlags(newFlags)
        processReplace(pattern, replacement, text, newFlags)
    }, [pattern, replacement, text, flags, processReplace])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            processReplace(SAMPLE_PATTERN, SAMPLE_REPLACEMENT, SAMPLE_TEXT, flags)
        }
    }, [flags, processReplace])

    // Temizle
    const doClear = () => {
        setPattern("")
        setReplacement("")
        setText("")
        setResult("")
        setMatches([])
        setMatchCount(0)
        setHighlightedText("")
        setHighlightedResult("")
        setStatus({
            type: "idle",
            msg: "Regex deseni ve metin girin"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setPattern(SAMPLE_PATTERN)
        setReplacement(SAMPLE_REPLACEMENT)
        setText(SAMPLE_TEXT)
        processReplace(SAMPLE_PATTERN, SAMPLE_REPLACEMENT, SAMPLE_TEXT, flags)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyResult = () => {
        if (!result) {
            showToast("Kopyalanacak sonuç yok")
            return
        }
        navigator.clipboard.writeText(result).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePasteText = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setText(text)
            processReplace(pattern, replacement, text, flags)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Status renkleri
    const getDotColor = () => {
        if (status.type === "ok") return "bg-emerald-400"
        if (status.type === "error") return "bg-red-400"
        return "bg-white/20"
    }

    const getMsgColor = () => {
        if (status.type === "ok") return "text-emerald-400"
        if (status.type === "error") return "text-red-400"
        return "text-white/40"
    }

    // Flag butonları
    const flagButtons = [
        { key: 'g', label: 'Global' },
        { key: 'i', label: 'Case Insensitive' },
        { key: 'm', label: 'Multiline' },
        { key: 's', label: 'Dot All' },
    ]

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processReplace(pattern, replacement, text, flags)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Replace
                </button>
                <button
                    onClick={copyResult}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Sonucu Kopyala
                </button>
                <div className="w-px h-5 bg-white/10" />
                <button
                    onClick={doClear}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Temizle
                </button>
                <button
                    onClick={doLoadSample}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Örnek yükle
                </button>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-2">
                {flagButtons.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => onFlagChange(key)}
                        className={`h-7 px-3 rounded-lg text-xs font-medium transition-colors ${
                            flags.includes(key)
                                ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                        }`}
                    >
                        {label} ({key})
                    </button>
                ))}
                <span className="text-xs text-white/30 ml-2 self-center">Flags: {flags || 'none'}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Pattern & Replacement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Regex Pattern</span>
                        <span className="text-xs text-white/30">/{pattern}/{flags}</span>
                    </div>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => onPatternChange(e.target.value)}
                        placeholder="/[a-z]+/g"
                        className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                    />
                </div>

                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Replacement</span>
                        <span className="text-xs text-white/30">$1, $&, $`...</span>
                    </div>
                    <input
                        type="text"
                        value={replacement}
                        onChange={(e) => onReplacementChange(e.target.value)}
                        placeholder="Yeni değer"
                        className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Text Input */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Metin</span>
                    <button
                        onClick={handlePasteText}
                        className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                    >
                        Yapıştır
                    </button>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="Metni buraya yapıştırın..."
                    spellCheck={false}
                    className="w-full min-h-48 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                />
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Highlighted Original */}
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Orijinal (Eşleşmeler)</span>
                        <span className="text-xs text-white/30">{matchCount} eşleşme</span>
                    </div>
                    <div
                        className="min-h-32 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
                        dangerouslySetInnerHTML={{ __html: highlightedText || text || 'Eşleşme bulunamadı' }}
                    />
                </div>

                {/* Highlighted Result */}
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Sonuç (Değişenler)</span>
                        <button
                            onClick={copyResult}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Kopyala
                        </button>
                    </div>
                    <div
                        className="min-h-32 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
                        dangerouslySetInnerHTML={{ __html: highlightedResult || result || 'Sonuç yok' }}
                    />
                </div>
            </div>

            {/* Match Details */}
            {matches.length > 0 && (
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Eşleşme Detayları</span>
                        <span className="text-xs text-white/30">{matchCount} eşleşme</span>
                    </div>
                    <div className="p-4 max-h-48 overflow-auto space-y-1">
                        {matches.map((match, i) => (
                            <div key={i} className="text-sm font-mono text-white/80 flex items-start gap-2">
                                <span className="text-white/30 text-xs min-w-8">#{i + 1}</span>
                                <span className="text-yellow-200 break-all">{match.value}</span>
                                <span className="text-white/30 text-xs ml-2">→</span>
                                <span className="text-emerald-300 break-all">{match.replacement}</span>
                                <span className="text-white/30 text-xs ml-auto">index: {match.index}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cheatsheet */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Replace Özel Karakterleri</span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="text-white/40">$& - Tüm eşleşme</div>
                    <div className="text-white/40">$` - Eşleşme öncesi</div>
                    <div className="text-white/40">$' - Eşleşme sonrası</div>
                    <div className="text-white/40">$1 - 1. grup</div>
                    <div className="text-white/40">$2 - 2. grup</div>
                    <div className="text-white/40">$n - n. grup</div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-[#22263a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white z-50">
                    {toast}
                </div>
            )}
        </div>
    )
}