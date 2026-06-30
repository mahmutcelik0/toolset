"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = `<html>
  <head>
    <title>Merhaba Dünya</title>
  </head>
  <body>
    <h1>Başlık</h1>
    <p>Bu bir <strong>test</strong> metnidir.</p>
    <a href="https://example.com?q=merhaba&cat=1">Link</a>
    <script>alert("Merhaba!");</script>
  </body>
</html>`

const SAMPLE_ENCODED = `&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Merhaba Dünya&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Başlık&lt;/h1&gt;
    &lt;p&gt;Bu bir &lt;strong&gt;test&lt;/strong&gt; metnidir.&lt;/p&gt;
    &lt;a href=&quot;https://example.com?q=merhaba&amp;cat=1&quot;&gt;Link&lt;/a&gt;
    &lt;script&gt;alert(&quot;Merhaba!&quot;);&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;`

type Mode = "encode" | "decode"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface HtmlToolProps {
    defaultMode?: Mode
}

// HTML karakter eşleştirme tablosu
const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '§': '&sect;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
    '·': '&middot;',
    '¬': '&not;',
    '¢': '&cent;',
}

// Reverse mapping
const htmlEntitiesReverse: { [key: string]: string } = {}
Object.entries(htmlEntities).forEach(([key, value]) => {
    htmlEntitiesReverse[value] = key
})

export default function HtmlTool({ defaultMode = "encode" }: HtmlToolProps) {
    const [input, setInput] = useState<string>(defaultMode === "encode" ? SAMPLE_TEXT : SAMPLE_ENCODED)
    const [output, setOutput] = useState<string>("")
    const [mode, setMode] = useState<Mode>(defaultMode)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: defaultMode === "encode" ? "HTML girip Encode'a tıklayın" : "Encoded HTML girip Decode'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [stats, setStats] = useState<{ inputSize: number; outputSize: number }>({
        inputSize: 0,
        outputSize: 0
    })
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // HTML Encode işlemi
    const encodeHtml = (str: string): string => {
        return str.replace(/[&<>"'`©®™€£¥§±×÷·¬¢]/g, (char) => {
            return htmlEntities[char] || char
        })
    }

    // HTML Decode işlemi
    const decodeHtml = (str: string): string => {
        return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
            return htmlEntitiesReverse[entity] || entity
        })
    }

    // Encode/Decode işlemi
    const processHtml = useCallback((val: string, m: Mode) => {
        if (!val.trim()) {
            setOutput("")
            setStats({ inputSize: 0, outputSize: 0 })
            setStatus({
                type: "idle",
                msg: m === "encode" ? "HTML metni girin" : "Encoded HTML girin"
            })
            return
        }

        try {
            if (m === "encode") {
                const encoded = encodeHtml(val)
                setOutput(encoded)
                setStats({
                    inputSize: val.length,
                    outputSize: encoded.length
                })
                setStatus({
                    type: "ok",
                    msg: "✅ HTML encoded successfully",
                    meta: `${val.length} → ${encoded.length} characters`
                })
            } else {
                const decoded = decodeHtml(val)
                setOutput(decoded)
                setStats({
                    inputSize: val.length,
                    outputSize: decoded.length
                })
                setStatus({
                    type: "ok",
                    msg: "✅ HTML decoded successfully",
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
        debounce.current = setTimeout(() => processHtml(val, mode), 300)
    }, [mode, processHtml])

    // Mode değişikliği
    const onModeChange = useCallback((newMode: Mode) => {
        setMode(newMode)
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0 })
        setStatus({
            type: "idle",
            msg: newMode === "encode" ? "HTML girip Encode'a tıklayın" : "Encoded HTML girip Decode'a tıklayın"
        })
    }, [])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            const sample = mode === "encode" ? SAMPLE_TEXT : SAMPLE_ENCODED
            setInput(sample)
            processHtml(sample, mode)
        }
    }, [mode, processHtml])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStats({ inputSize: 0, outputSize: 0 })
        setStatus({
            type: "idle",
            msg: mode === "encode" ? "HTML girip Encode'a tıklayın" : "Encoded HTML girip Decode'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        if (mode === "encode") {
            setInput(SAMPLE_TEXT)
            processHtml(SAMPLE_TEXT, mode)
        } else {
            setInput(SAMPLE_ENCODED)
            processHtml(SAMPLE_ENCODED, mode)
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
        processHtml(output, newMode)
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
            processHtml(text, mode)
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
                /(&[a-zA-Z0-9#]+;)/g,
                (match) => `<span style="color:#fbbf24">${match}</span>`
            )
    }

    // Karakter dönüşüm tablosu
    const getCharMapping = () => {
        const chars = [
            { char: "&", encoded: "&amp;" },
            { char: "<", encoded: "&lt;" },
            { char: ">", encoded: "&gt;" },
            { char: '"', encoded: "&quot;" },
            { char: "'", encoded: "&#39;" },
            { char: "`", encoded: "&#96;" },
            { char: "©", encoded: "&copy;" },
            { char: "®", encoded: "&reg;" },
            { char: "™", encoded: "&trade;" },
            { char: "€", encoded: "&euro;" },
            { char: "£", encoded: "&pound;" },
            { char: "¥", encoded: "&yen;" },
            { char: "§", encoded: "&sect;" },
            { char: "±", encoded: "&plusmn;" },
            { char: "×", encoded: "&times;" },
            { char: "÷", encoded: "&divide;" },
            { char: "·", encoded: "&middot;" },
            { char: "¬", encoded: "&not;" },
            { char: "¢", encoded: "&cent;" },
        ]
        return chars
    }

    return (
        <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex gap-2">
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
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processHtml(input, mode)}
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
              {mode === "encode" ? "HTML" : "Encoded HTML"}
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
                        placeholder={mode === "encode" ? "HTML metni girin..." : "Encoded HTML girin..."}
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Encoded HTML" : "HTML"}
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
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">HTML Entity Reference</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 text-xs">
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
                    <span className="text-white/40">Note:</span> HTML encode işlemi, XSS (Cross-Site Scripting) saldırılarını önlemek için kullanılır.
                    <br />
                    <span className="text-white/40">Common uses:</span> &lt;, &gt;, &amp;, &quot;, &#39; characters are always encoded.
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