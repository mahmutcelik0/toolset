"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE = `{
  "message": "Hello \\"World\\"!",
  "path": "C:\\\\Users\\\\Documents\\\\file.json",
  "multiline": "Line 1\\nLine 2\\nLine 3",
  "unicode": "\\u00E7 \\u015F \\u011F"
}`

type Mode = "escape" | "unescape"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

export default function JsonEscape() {
    const [input, setInput] = useState<string>(SAMPLE)
    const [output, setOutput] = useState<string>("")
    const [mode, setMode] = useState<Mode>("escape")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "JSON girip Escape veya Unescape butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Escape/Unescape işlemi
    const processEscape = useCallback((val: string, m: Mode) => {
        if (!val.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: "JSON girin veya yapıştırın"
            })
            return
        }

        try {
            if (m === "escape") {
                // JSON'u escape et - önce parse et sonra stringify yap
                const parsed = JSON.parse(val)
                const escaped = JSON.stringify(parsed)
                setOutput(escaped)
                setStatus({
                    type: "ok",
                    msg: "✅ JSON başarıyla escape edildi",
                    meta: `${escaped.length} karakter`
                })
            } else {
                // JSON'u unescape et - önce parse et (JSON otomatik olarak unescape yapar)
                const parsed = JSON.parse(val)
                const unescaped = JSON.stringify(parsed, null, 2)
                setOutput(unescaped)
                setStatus({
                    type: "ok",
                    msg: "✅ JSON başarıyla unescape edildi",
                    meta: `${unescaped.length} karakter`
                })
            }
        } catch (e) {
            const error = e as Error
            setOutput("")
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
        debounce.current = setTimeout(() => processEscape(val, mode), 300)
    }, [mode, processEscape])

    // Mode değişikliği
    const onModeChange = useCallback((newMode: Mode) => {
        setMode(newMode)
        processEscape(input, newMode)
    }, [input, processEscape])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            processEscape(SAMPLE, mode)
        }
    }, [mode, processEscape])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStatus({
            type: "idle",
            msg: "JSON girin veya yapıştırın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE)
        processEscape(SAMPLE, mode)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        const text = document.getElementById("escape-output")?.innerText ?? ""
        if (!text) {
            showToast("Kopyalanacak çıktı yok")
            return
        }
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // İndir
    const downloadOutput = () => {
        const text = document.getElementById("escape-output")?.innerText ?? ""
        if (!text) {
            showToast("İndirilecek çıktı yok")
            return
        }
        const a = document.createElement("a")
        const ext = mode === "escape" ? ".txt" : ".json"
        a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }))
        a.download = `output${ext}`
        a.click()
        showToast("İndiriliyor…")
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            processEscape(text, mode)
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
                /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g,
                (m: string) => {
                    if (/^"/.test(m)) return `<span style="color:#a8d8a8">${m}</span>`
                    if (/true|false/.test(m)) return `<span style="color:#c9a0dc">${m}</span>`
                    if (/null/.test(m)) return `<span style="color:#ff8c69">${m}</span>`
                    if (/[{}[\]]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
                    if (/[,:]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
                    return `<span style="color:#ffb347">${m}</span>`
                }
            )
    }

    return (
        <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => onModeChange("escape")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === "escape"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                >
                    🔒 Escape
                </button>
                <button
                    onClick={() => onModeChange("unescape")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === "unescape"
                            ? "bg-indigo-500 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                    }`}
                >
                    🔓 Unescape
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processEscape(input, mode)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {mode === "escape" ? "Escape" : "Unescape"}
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

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Input */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Giriş</span>
                        <div className="flex gap-1">
                            <button
                                onClick={handlePaste}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Yapıştır
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        placeholder='{ "key": "value" }'
                        spellCheck={false}
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "escape" ? "Escaped" : "Unescaped"}
            </span>
                        <div className="flex gap-1">
                            <button
                                onClick={copyOutput}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Kopyala
                            </button>
                            <button
                                onClick={downloadOutput}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                İndir
                            </button>
                        </div>
                    </div>
                    <div
                        id="escape-output"
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre select-text"
                        dangerouslySetInnerHTML={{ __html: highlightOutput(output) }}
                    />
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