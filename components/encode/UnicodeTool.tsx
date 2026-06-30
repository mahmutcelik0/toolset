"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = `Merhaba Dünya! 🌍
Hello World! 🚀
日本語 こんにちは
中文 你好
한국어 안녕하세요
Emoji: 😊 🎉 ❤️ 🔥 💻`

const SAMPLE_UNICODE = `Merhaba D\\u00fcnya! \\uD83C\\uDF0D
Hello World! \\uD83D\\uDE80
\\u65E5\\u672C\\u8A9E \\u3053\\u3093\\u306B\\u3061\\u306F
\\u4E2D\\u6587 \\u4F60\\u597D
\\uD55C\\uAD6D\\uC5B4 \\uC548\\uB155\\uD558\\uC138\\uC694
Emoji: \\uD83D\\uDE0A \\uD83C\\uDF89 \\u2764\\uFE0F \\uD83D\\uDD25 \\uD83D\\uDCBB`

type Mode = "encode" | "decode"
type Format = "unicode" | "hex" | "decimal" | "html"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface UnicodeToolProps {
    defaultMode?: Mode
}

export default function UnicodeTool({ defaultMode = "encode" }: UnicodeToolProps) {
    const [input, setInput] = useState<string>(defaultMode === "encode" ? SAMPLE_TEXT : SAMPLE_UNICODE)
    const [output, setOutput] = useState<string>("")
    const [mode, setMode] = useState<Mode>(defaultMode)
    const [format, setFormat] = useState<Format>("unicode")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: defaultMode === "encode" ? "Metin girip Encode'a tıklayın" : "Unicode girip Decode'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [stats, setStats] = useState<{ inputSize: number; outputSize: number; charCount: number }>({
        inputSize: 0,
        outputSize: 0,
        charCount: 0
    })
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Unicode Encode işlemi
    const encodeUnicode = (str: string, fmt: Format): string => {
        const chars = [...str]
        return chars.map(char => {
            const code = char.codePointAt(0) || 0

            if (fmt === "unicode") {
                // \uXXXX formatı (4 digit)
                if (code <= 0xFFFF) {
                    return `\\u${code.toString(16).padStart(4, '0')}`
                } else {
                    // Surrogate pair for emoji
                    const high = Math.floor((code - 0x10000) / 0x400) + 0xD800
                    const low = ((code - 0x10000) % 0x400) + 0xDC00
                    return `\\u${high.toString(16).padStart(4, '0')}\\u${low.toString(16).padStart(4, '0')}`
                }
            } else if (fmt === "hex") {
                return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`
            } else if (fmt === "decimal") {
                return `&#${code};`
            } else if (fmt === "html") {
                if (code <= 0xFFFF) {
                    return `&#x${code.toString(16)};`
                } else {
                    return `&#x${code.toString(16)};`
                }
            }
            return char
        }).join('')
    }

    // Unicode Decode işlemi
    const decodeUnicode = (str: string): string => {
        // \uXXXX formatı
        let decoded = str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
            return String.fromCharCode(parseInt(hex, 16))
        })

        // \UXXXXXXXX formatı (8 digit)
        decoded = decoded.replace(/\\U([0-9a-fA-F]{8})/g, (_, hex) => {
            const code = parseInt(hex, 16)
            return String.fromCodePoint(code)
        })

        // U+XXXX formatı
        decoded = decoded.replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex) => {
            const code = parseInt(hex, 16)
            return String.fromCodePoint(code)
        })

        // &#XXXX; (decimal) formatı
        decoded = decoded.replace(/&#([0-9]+);/g, (_, dec) => {
            return String.fromCodePoint(parseInt(dec, 10))
        })

        // &#xXXXX; (hex) formatı
        decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
            return String.fromCodePoint(parseInt(hex, 16))
        })

        return decoded
    }

    // Encode/Decode işlemi
    const processUnicode = useCallback((val: string, m: Mode, fmt: Format) => {
        if (!val.trim()) {
            setOutput("")
            setStats({ inputSize: 0, outputSize: 0, charCount: 0 })
            setStatus({
                type: "idle",
                msg: m === "encode" ? "Metin girin" : "Unicode girin"
            })
            return
        }

        try {
            if (m === "encode") {
                const encoded = encodeUnicode(val, fmt)
                setOutput(encoded)
                const charCount = [...val].length
                setStats({
                    inputSize: val.length,
                    outputSize: encoded.length,
                    charCount
                })
                setStatus({
                    type: "ok",
                    msg: "✅ Unicode encoded successfully",
                    meta: `${charCount} characters → ${encoded.length} characters`
                })
            } else {
                const decoded = decodeUnicode(val)
                setOutput(decoded)
                const charCount = [...decoded].length
                setStats({
                    inputSize: val.length,
                    outputSize: decoded.length,
                    charCount
                })
                setStatus({
                    type: "ok",
                    msg: "✅ Unicode decoded successfully",
                    meta: `${charCount} characters → ${decoded.length} characters`
                })
            }
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStats({ inputSize: 0, outputSize: 0, charCount: 0 })
            setStatus({
                type: "error",
                msg: `❌ ${error.message}`
            })
        }
    }, [])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processUnicode(val, mode, format), 300)
    }, [mode, format, processUnicode])

    // Mode değişikliği
    const onModeChange = useCallback((newMode: Mode) => {
        setMode(newMode)
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0, charCount: 0 })
        setStatus({
            type: "idle",
            msg: newMode === "encode" ? "Metin girip Encode'a tıklayın" : "Unicode girip Decode'a tıklayın"
        })
    }, [])

    // Format değişikliği
    const onFormatChange = useCallback((newFormat: Format) => {
        setFormat(newFormat)
        if (input.trim()) {
            processUnicode(input, mode, newFormat)
        }
    }, [input, mode, processUnicode])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            const sample = mode === "encode" ? SAMPLE_TEXT : SAMPLE_UNICODE
            setInput(sample)
            processUnicode(sample, mode, format)
        }
    }, [mode, format, processUnicode])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0, charCount: 0 })
        setStatus({
            type: "idle",
            msg: mode === "encode" ? "Metin girip Encode'a tıklayın" : "Unicode girip Decode'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        if (mode === "encode") {
            setInput(SAMPLE_TEXT)
            processUnicode(SAMPLE_TEXT, mode, format)
        } else {
            setInput(SAMPLE_UNICODE)
            processUnicode(SAMPLE_UNICODE, mode, format)
        }
    }

    // Yer değiştir
    const doSwap = () => {
        if (!output) {
            showToast("Değiştirilecek çıktı yok")
            return
        }
        const temp = input
        setInput(output)
        setOutput(temp)
        const newMode = mode === "encode" ? "decode" : "encode"
        setMode(newMode)
        processUnicode(output, newMode, format)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        if (!output) {
            showToast("Kopyalanacak çıktı yok")
            return
        }
        navigator.clipboard.writeText(output).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            processUnicode(text, mode, format)
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

    // Output'u highlight et
    const highlightOutput = (text: string) => {
        if (!text) return ""
        let highlighted = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")

        // Unicode formatlarını vurgula
        highlighted = highlighted.replace(
            /(\\u[0-9a-fA-F]{4})/g,
            (match) => `<span style="color:#fbbf24">${match}</span>`
        )
        highlighted = highlighted.replace(
            /(U\+[0-9a-fA-F]{4,6})/g,
            (match) => `<span style="color:#60a5fa">${match}</span>`
        )
        highlighted = highlighted.replace(
            /(&#x[0-9a-fA-F]+;)/g,
            (match) => `<span style="color:#a78bfa">${match}</span>`
        )
        highlighted = highlighted.replace(
            /(&#[0-9]+;)/g,
            (match) => `<span style="color:#34d399">${match}</span>`
        )

        return highlighted
    }

    // Format seçenekleri
    const formatOptions: { value: Format; label: string }[] = [
        { value: "unicode", label: "\\uXXXX" },
        { value: "hex", label: "U+XXXX" },
        { value: "decimal", label: "&#XXXX;" },
        { value: "html", label: "&#xXXXX;" },
    ]

    return (
        <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onModeChange("encode")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === "encode"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                >
                    🔐 Encode
                </button>
                <button
                    onClick={() => onModeChange("decode")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === "decode"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                >
                    🔓 Decode
                </button>
                <div className="w-px h-8 bg-white/10 mx-1" />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Format:</span>
                    {formatOptions.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => onFormatChange(value)}
                            className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                                format === value
                                    ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                    : "bg-white/5 hover:bg-white/10 text-white/40"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processUnicode(input, mode, format)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {mode === "encode" ? "Encode" : "Decode"}
                </button>
                <button
                    onClick={doSwap}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    ↔ Swap
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
                <button
                    onClick={copyOutput}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Kopyala
                </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Stats */}
            {stats.inputSize > 0 && stats.outputSize > 0 && (
                <div className="flex gap-4 text-xs font-mono bg-[#1a1d27] p-3 rounded-lg border border-white/5">
                    <span className="text-white/40">Characters: <span className="text-white">{stats.charCount}</span></span>
                    <span className="text-white/40">Input: <span className="text-white">{stats.inputSize} chars</span></span>
                    <span className="text-white/40">Output: <span className="text-white">{stats.outputSize} chars</span></span>
                    {mode === "encode" && stats.outputSize > stats.inputSize && (
                        <span className="text-yellow-400">
              +{stats.outputSize - stats.inputSize} chars
            </span>
                    )}
                </div>
            )}

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Input */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Metin" : "Unicode"}
            </span>
                        <button
                            onClick={handlePaste}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Yapıştır
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        placeholder={mode === "encode" ? "Metin girin..." : "Unicode girin..."}
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Unicode" : "Metin"}
            </span>
                        <div className="flex gap-1">
                            <button
                                onClick={copyOutput}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Kopyala
                            </button>
                        </div>
                    </div>
                    <div
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap break-all select-text"
                        dangerouslySetInnerHTML={{ __html: highlightOutput(output) }}
                    />
                </div>
            </div>

            {/* Unicode Info */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Unicode Bilgisi</span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="text-white/40">📝 Unicode: Tüm karakterleri kapsar</div>
                    <div className="text-white/40">🌍 Emoji: Surrogate pair ile</div>
                    <div className="text-white/40">🔤 UTF-8, UTF-16, UTF-32</div>
                    <div className="text-white/40">📏 Her karakter 1-4 byte</div>
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