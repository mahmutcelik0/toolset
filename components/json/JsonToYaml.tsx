"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import * as yaml from "js-yaml"

const SAMPLE = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": true,
    "roller": ["admin", "editor"],
    "adres": {
      "sehir": "İstanbul",
      "posta": "34000"
    }
  },
  "toplam": 42,
  "zaman_damgasi": null
}`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

export default function JsonToYaml() {
    const [input, setInput] = useState<string>(SAMPLE)
    const [output, setOutput] = useState<string>("")
    const [indent, setIndent] = useState<number>(2)
    const [lineWidth, setLineWidth] = useState<number>(120)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "JSON girip Dönüştür butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // JSON to YAML dönüşümü
    const convert = useCallback((val: string, ind: number, width: number) => {
        if (!val.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: "JSON girin veya yapıştırın"
            })
            return
        }

        try {
            const parsed = JSON.parse(val)
            const yamlStr = yaml.dump(parsed, {
                indent: ind,
                lineWidth: width,
                noRefs: true,
                sortKeys: false,
                flowLevel: -1
            })
            setOutput(yamlStr)
            setStatus({
                type: "ok",
                msg: "✅ JSON başarıyla YAML'a dönüştürüldü",
                meta: `${yamlStr.length} karakter · ${yamlStr.split('\n').length} satır`
            })
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStatus({
                type: "error",
                msg: `❌ Geçersiz JSON: ${error.message}`
            })
        }
    }, [])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => convert(val, indent, lineWidth), 300)
    }, [indent, lineWidth, convert])

    // Ayarlar değişikliği
    const onIndentChange = useCallback((val: number) => {
        setIndent(val)
        convert(input, val, lineWidth)
    }, [input, lineWidth, convert])

    const onLineWidthChange = useCallback((val: number) => {
        setLineWidth(val)
        convert(input, indent, val)
    }, [input, indent, convert])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            convert(SAMPLE, indent, lineWidth)
        }
    }, [indent, lineWidth, convert])

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
        convert(SAMPLE, indent, lineWidth)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        const text = document.getElementById("yaml-output")?.innerText ?? ""
        if (!text) {
            showToast("Kopyalanacak çıktı yok")
            return
        }
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // İndir
    const downloadOutput = () => {
        const text = document.getElementById("yaml-output")?.innerText ?? ""
        if (!text) {
            showToast("İndirilecek çıktı yok")
            return
        }
        const a = document.createElement("a")
        a.href = URL.createObjectURL(new Blob([text], { type: "text/yaml" }))
        a.download = "output.yaml"
        a.click()
        showToast("İndiriliyor…")
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            convert(text, indent, lineWidth)
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

    // YAML output'u highlight et (basit highlight)
    const highlightYaml = (text: string) => {
        if (!text) return ""
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(
                /^(\s*)([a-zA-Z_][a-zA-Z0-9_\-]*)(:)/gm,
                (_, spaces, key, colon) => {
                    return `${spaces}<span style="color:#7cb9e8">${key}</span>${colon}`
                }
            )
            .replace(
                /:\s+("[^"]*"|'[^']*')/g,
                (_, value) => `: <span style="color:#a8d8a8">${value}</span>`
            )
            .replace(
                /:\s+(true|false)/g,
                (_, value) => `: <span style="color:#c9a0dc">${value}</span>`
            )
            .replace(
                /:\s+(null|~)/g,
                (_, value) => `: <span style="color:#ff8c69">${value}</span>`
            )
            .replace(
                /:\s+(\d+)/g,
                (_, value) => `: <span style="color:#ffb347">${value}</span>`
            )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => convert(input, indent, lineWidth)}
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
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Line Width:</label>
                    <select
                        value={lineWidth}
                        onChange={(e) => onLineWidthChange(parseInt(e.target.value))}
                        className="h-8 px-3 bg-white/5 border border-white/10 text-sm text-white rounded-lg outline-none focus:border-indigo-400"
                    >
                        <option value={80}>80</option>
                        <option value={100}>100</option>
                        <option value={120}>120</option>
                        <option value={160}>160</option>
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
                {/* Input - JSON */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JSON</span>
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

                {/* Output - YAML */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">YAML</span>
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
                        id="yaml-output"
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre select-text"
                        dangerouslySetInnerHTML={{ __html: highlightYaml(output) }}
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