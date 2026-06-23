"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import * as yaml from "js-yaml"

const SAMPLE = `kullanici:
  id: 1
  ad: Ahmet Yılmaz
  email: ahmet@ornek.com
  aktif: true
  roller:
    - admin
    - editor
  adres:
    sehir: İstanbul
    posta: "34000"
toplam: 42
zaman_damgasi: null`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

export default function YamlToJson() {
    const [input, setInput] = useState<string>(SAMPLE)
    const [output, setOutput] = useState<string>("")
    const [indent, setIndent] = useState<number>(2)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "YAML girip Dönüştür butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // YAML to JSON dönüşümü
    const convert = useCallback((val: string, ind: number) => {
        if (!val.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: "YAML girin veya yapıştırın"
            })
            return
        }

        try {
            const parsed = yaml.load(val)
            const jsonStr = JSON.stringify(parsed, null, ind)
            setOutput(jsonStr)

            const byteSize = new Blob([jsonStr]).size
            const lineCount = jsonStr.split('\n').length

            setStatus({
                type: "ok",
                msg: "✅ YAML başarıyla JSON'a dönüştürüldü",
                meta: `${byteSize} byte · ${lineCount} satır`
            })
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStatus({
                type: "error",
                msg: `❌ Geçersiz YAML: ${error.message}`
            })
        }
    }, [])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => convert(val, indent), 300)
    }, [indent, convert])

    // Indent değişikliği
    const onIndentChange = useCallback((val: number) => {
        setIndent(val)
        convert(input, val)
    }, [input, convert])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            convert(SAMPLE, indent)
        }
    }, [indent, convert])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStatus({
            type: "idle",
            msg: "YAML girin veya yapıştırın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE)
        convert(SAMPLE, indent)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        const text = document.getElementById("json-output")?.innerText ?? ""
        if (!text) {
            showToast("Kopyalanacak çıktı yok")
            return
        }
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // İndir
    const downloadOutput = () => {
        const text = document.getElementById("json-output")?.innerText ?? ""
        if (!text) {
            showToast("İndirilecek çıktı yok")
            return
        }
        const a = document.createElement("a")
        a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }))
        a.download = "output.json"
        a.click()
        showToast("İndiriliyor…")
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            convert(text, indent)
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

    // JSON output'u highlight et
    const highlightJson = (text: string) => {
        if (!text) return ""
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(
                /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g,
                (m: string) => {
                    if (/^"/.test(m)) {
                        return /:$/.test(m)
                            ? `<span style="color:#7cb9e8">${m}</span>`
                            : `<span style="color:#a8d8a8">${m}</span>`
                    }
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
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => convert(input, indent)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Dönüştür
                </button>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Indent:</label>
                    <select
                        value={indent}
                        onChange={(e) => onIndentChange(parseInt(e.target.value))}
                        className="h-8 px-3 bg-white/5 border border-white/10 text-sm text-white rounded-lg outline-none focus:border-indigo-400"
                    >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                        <option value={0}>Minify</option>
                    </select>
                </div>
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
                {/* Input - YAML */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">YAML</span>
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
                        placeholder="key: value"
                        spellCheck={false}
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output - JSON */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JSON</span>
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
                        id="json-output"
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre select-text"
                        dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
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