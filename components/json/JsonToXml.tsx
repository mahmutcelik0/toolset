"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { XMLBuilder } from "fast-xml-parser"

const SAMPLE = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": true,
    "roller": {
      "rol": ["admin", "editor"]
    },
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

export default function JsonToXml() {
    const [input, setInput] = useState<string>(SAMPLE)
    const [output, setOutput] = useState<string>("")
    const [rootName, setRootName] = useState<string>("root")
    const [format, setFormat] = useState<boolean>(true)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "JSON girip Dönüştür butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // JSON to XML dönüşümü
    const convert = useCallback((val: string, root: string, pretty: boolean) => {
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

            // Önce XML için wrapper oluşturalım
            const wrappedData: Record<string, unknown> = {}
            wrappedData[root || "root"] = parsed

            // XML Builder oluştur
            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: pretty,
                indentBy: "  ",
                suppressEmptyNode: true
            })

            const xml = builder.build(wrappedData)
            setOutput(xml)

            const lineCount = xml.split('\n').length
            const byteSize = new Blob([xml]).size

            setStatus({
                type: "ok",
                msg: "✅ JSON başarıyla XML'e dönüştürüldü",
                meta: `${byteSize} byte · ${lineCount} satır`
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
        debounce.current = setTimeout(() => convert(val, rootName, format), 300)
    }, [rootName, format, convert])

    // Root name değişikliği
    const onRootNameChange = useCallback((val: string) => {
        setRootName(val)
        convert(input, val, format)
    }, [input, format, convert])

    // Format değişikliği
    const onFormatChange = useCallback((val: boolean) => {
        setFormat(val)
        convert(input, rootName, val)
    }, [input, rootName, convert])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            convert(SAMPLE, rootName, format)
        }
    }, [rootName, format, convert])

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
        convert(SAMPLE, rootName, format)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        const text = document.getElementById("xml-output")?.innerText ?? ""
        if (!text) {
            showToast("Kopyalanacak çıktı yok")
            return
        }
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // İndir
    const downloadOutput = () => {
        const text = document.getElementById("xml-output")?.innerText ?? ""
        if (!text) {
            showToast("İndirilecek çıktı yok")
            return
        }
        const a = document.createElement("a")
        a.href = URL.createObjectURL(new Blob([text], { type: "application/xml" }))
        a.download = "output.xml"
        a.click()
        showToast("İndiriliyor…")
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            convert(text, rootName, format)
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

    // XML output'u highlight et (basit highlight)
    const highlightXml = (text: string) => {
        if (!text) return ""
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(
                /(&lt;)(\/?)([a-zA-Z_][a-zA-Z0-9_\-]*)(\s*)([^&]*?)(\/?)(&gt;)/g,
                (_: string, open: string, slash: string, tagName: string, _spaces: string, attrs: string, selfClose: string, close: string) => {
                    let result = `<span style="color:#7cb9e8">${open}${slash}${tagName}</span>`
                    if (attrs) {
                        result += attrs.replace(
                            /([a-zA-Z_][a-zA-Z0-9_\-]*)="([^"]*)"/g,
                            (_match: string, attr: string, value: string) =>
                                ` <span style="color:#c9a0dc">${attr}</span>=<span style="color:#a8d8a8">"${value}"</span>`
                        )
                    }
                    if (selfClose) result += selfClose
                    result += `<span style="color:#7cb9e8">${close}</span>`
                    return result
                }
            )
            .replace(
                /(&lt;!--)(.*?)(--&gt;)/g,
                (_: string, open: string, comment: string, close: string) =>
                    `<span style="color:#ff8c69">${open}${comment}${close}</span>`
            )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => convert(input, rootName, format)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Dönüştür
                </button>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Root Element:</label>
                    <input
                        type="text"
                        value={rootName}
                        onChange={(e) => onRootNameChange(e.target.value)}
                        className="h-8 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-indigo-400 w-24"
                        placeholder="root"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Format:</label>
                    <button
                        onClick={() => onFormatChange(true)}
                        className={`h-8 px-3 rounded-lg text-sm transition-colors ${
                            format
                                ? "bg-indigo-500 text-white"
                                : "bg-white/5 hover:bg-white/10 text-white/60"
                        }`}
                    >
                        Pretty
                    </button>
                    <button
                        onClick={() => onFormatChange(false)}
                        className={`h-8 px-3 rounded-lg text-sm transition-colors ${
                            !format
                                ? "bg-indigo-500 text-white"
                                : "bg-white/5 hover:bg-white/10 text-white/60"
                        }`}
                    >
                        Minify
                    </button>
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

                {/* Output - XML */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">XML</span>
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
                        id="xml-output"
                        className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre select-text"
                        dangerouslySetInnerHTML={{ __html: highlightXml(output) }}
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