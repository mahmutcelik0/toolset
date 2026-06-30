"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = `https://example.com/search?q=merhaba dünya&category=yazılım&tags=[js,react,nextjs]`

const SAMPLE_ENCODED = `https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dmerhaba%20d%C3%BCnya%26category%3Dyaz%C4%B1l%C4%B1m%26tags%3D%5Bjs%2Creact%2Cnextjs%5D`

type Mode = "encode" | "decode"
type EncodingType = "component" | "full"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface UrlToolProps {
    defaultMode?: Mode
}

export default function UrlTool({ defaultMode = "encode" }: UrlToolProps) {
    const [input, setInput] = useState<string>(defaultMode === "encode" ? SAMPLE_TEXT : SAMPLE_ENCODED)
    const [output, setOutput] = useState<string>("")
    const [mode, setMode] = useState<Mode>(defaultMode)
    const [encodingType, setEncodingType] = useState<EncodingType>("component")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: defaultMode === "encode" ? "URL girip Encode'a tıklayın" : "Encoded URL girip Decode'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [stats, setStats] = useState<{ inputSize: number; outputSize: number }>({
        inputSize: 0,
        outputSize: 0
    })
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Encode/Decode işlemi
    const processUrl = useCallback((val: string, m: Mode, type: EncodingType) => {
        if (!val.trim()) {
            setOutput("")
            setStats({ inputSize: 0, outputSize: 0 })
            setStatus({
                type: "idle",
                msg: m === "encode" ? "URL veya metin girin" : "Encoded URL girin"
            })
            return
        }

        try {
            if (m === "encode") {
                let encoded: string
                if (type === "component") {
                    encoded = encodeURIComponent(val)
                } else {
                    encoded = encodeURI(val)
                }
                setOutput(encoded)
                setStats({
                    inputSize: val.length,
                    outputSize: encoded.length
                })
                setStatus({
                    type: "ok",
                    msg: "✅ URL encoded successfully",
                    meta: `${val.length} → ${encoded.length} characters`
                })
            } else {
                let decoded: string
                try {
                    decoded = decodeURIComponent(val)
                } catch {
                    decoded = decodeURI(val)
                }
                setOutput(decoded)
                setStats({
                    inputSize: val.length,
                    outputSize: decoded.length
                })
                setStatus({
                    type: "ok",
                    msg: "✅ URL decoded successfully",
                    meta: `${val.length} → ${decoded.length} characters`
                })
            }
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStats({ inputSize: 0, outputSize: 0 })
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
        debounce.current = setTimeout(() => processUrl(val, mode, encodingType), 300)
    }, [mode, encodingType, processUrl])

    // Mode değişikliği
    const onModeChange = useCallback((newMode: Mode) => {
        setMode(newMode)
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0 })
        setStatus({
            type: "idle",
            msg: newMode === "encode" ? "URL girip Encode'a tıklayın" : "Encoded URL girip Decode'a tıklayın"
        })
    }, [])

    // Encoding type değişikliği
    const onEncodingTypeChange = useCallback((newType: EncodingType) => {
        setEncodingType(newType)
        if (input.trim()) {
            processUrl(input, mode, newType)
        }
    }, [input, mode, processUrl])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            const sample = mode === "encode" ? SAMPLE_TEXT : SAMPLE_ENCODED
            setInput(sample)
            processUrl(sample, mode, encodingType)
        }
    }, [mode, encodingType, processUrl])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0 })
        setStatus({
            type: "idle",
            msg: mode === "encode" ? "URL girip Encode'a tıklayın" : "Encoded URL girip Decode'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        if (mode === "encode") {
            setInput(SAMPLE_TEXT)
            processUrl(SAMPLE_TEXT, mode, encodingType)
        } else {
            setInput(SAMPLE_ENCODED)
            processUrl(SAMPLE_ENCODED, mode, encodingType)
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
        processUrl(output, newMode, encodingType)
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
            processUrl(text, mode, encodingType)
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
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(
                /(%[0-9A-Fa-f]{2})/g,
                (match) => `<span style="color:#fbbf24">${match}</span>`
            )
    }

    // Karakter dönüşüm tablosu
    const getCharMapping = () => {
        const chars = [
            { char: " ", encoded: "%20" },
            { char: "!", encoded: "%21" },
            { char: '"', encoded: "%22" },
            { char: "#", encoded: "%23" },
            { char: "$", encoded: "%24" },
            { char: "%", encoded: "%25" },
            { char: "&", encoded: "%26" },
            { char: "'", encoded: "%27" },
            { char: "(", encoded: "%28" },
            { char: ")", encoded: "%29" },
            { char: "*", encoded: "%2A" },
            { char: "+", encoded: "%2B" },
            { char: ",", encoded: "%2C" },
            { char: "-", encoded: "%2D" },
            { char: ".", encoded: "%2E" },
            { char: "/", encoded: "%2F" },
            { char: ":", encoded: "%3A" },
            { char: ";", encoded: "%3B" },
            { char: "<", encoded: "%3C" },
            { char: "=", encoded: "%3D" },
            { char: ">", encoded: "%3E" },
            { char: "?", encoded: "%3F" },
            { char: "@", encoded: "%40" },
            { char: "[", encoded: "%5B" },
            { char: "\\", encoded: "%5C" },
            { char: "]", encoded: "%5D" },
            { char: "^", encoded: "%5E" },
            { char: "_", encoded: "%5F" },
            { char: "`", encoded: "%60" },
            { char: "{", encoded: "%7B" },
            { char: "|", encoded: "%7C" },
            { char: "}", encoded: "%7D" },
            { char: "~", encoded: "%7E" },
        ]
        return chars
    }

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
                <button
                    onClick={() => onEncodingTypeChange("component")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        encodingType === "component"
                            ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                            : "bg-white/5 hover:bg-white/10 text-white/40"
                    }`}
                >
                    Component
                </button>
                <button
                    onClick={() => onEncodingTypeChange("full")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        encodingType === "full"
                            ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                            : "bg-white/5 hover:bg-white/10 text-white/40"
                    }`}
                >
                    Full URL
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processUrl(input, mode, encodingType)}
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
              {mode === "encode" ? "URL / Metin" : "Encoded URL"}
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
                        placeholder={mode === "encode" ? "URL veya metin girin..." : "Encoded URL girin..."}
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Encoded URL" : "URL / Metin"}
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

            {/* Character Reference Table */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">URL Encoding Reference</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 text-xs">
                        {getCharMapping().map(({ char, encoded }) => (
                            <div key={char} className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                <span className="text-white/60 text-[10px]">
                  {char === " " ? "space" : `'${char}'`}
                </span>
                                <span className="text-yellow-300 font-mono text-[10px] break-all">{encoded}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-4 py-2 border-t border-white/5 text-xs text-white/30">
                    <span className="text-white/40">encodeURIComponent:</span> All characters except A-Z, a-z, 0-9, - _ . ! ~ * &apos; ( )
                    <br />
                    <span className="text-white/40">encodeURI:</span> All characters except A-Z, a-z, 0-9, ; , / ? : @ & = + $ - _ . ! ~ * &apos; ( ) #
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