"use client"

import { useState, useCallback, useRef, useEffect } from "react"

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

type ValidationStatus = {
    type: "idle" | "valid" | "invalid"
    msg: string
    meta?: string
}

// JSON verisi için tip tanımı - herhangi bir JSON değeri olabilir
type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue }

// JSON verisinin tipini tespit et
function getJsonType(data: JsonValue): string {
    if (data === null) return "null"
    if (Array.isArray(data)) return "array"
    return typeof data
}

// JSON verisindeki anahtar sayısını hesapla
function countKeys(data: JsonValue): number {
    if (data === null || typeof data !== "object" || Array.isArray(data)) return 0
    return Object.keys(data).length
}

interface ValidationResult {
    valid: boolean
    data: JsonValue | null
    error: string | null
    keyCount: number
    type: string
    byteSize: number
}

export default function JsonValidator() {
    const [input, setInput] = useState<string>(SAMPLE)
    const [validation, setValidation] = useState<ValidationResult>({
        valid: true,
        data: null,
        error: null,
        keyCount: 0,
        type: "object",
        byteSize: 0
    })
    const [status, setStatus] = useState<ValidationStatus>({
        type: "valid",
        msg: "✅ Geçerli JSON",
        meta: "7 anahtar · 0.2 KB"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // JSON Validasyonu
    const validateJSON = useCallback((val: string) => {
        if (!val.trim()) {
            setValidation({
                valid: false,
                data: null,
                error: "Boş JSON girildi",
                keyCount: 0,
                type: "empty",
                byteSize: 0
            })
            setStatus({
                type: "idle",
                msg: "JSON girin veya yapıştırın"
            })
            return
        }

        try {
            const parsed: JsonValue = JSON.parse(val)
            const byteSize = new Blob([val]).size
            const keyCount = countKeys(parsed)
            const type = getJsonType(parsed)

            setValidation({
                valid: true,
                data: parsed,
                error: null,
                keyCount,
                type,
                byteSize
            })

            setStatus({
                type: "valid",
                msg: "✅ Geçerli JSON",
                meta: `${keyCount > 0 ? keyCount + ' anahtar' : type} · ${(byteSize / 1024).toFixed(1)} KB`
            })
        } catch (e) {
            const error = e as Error
            setValidation({
                valid: false,
                data: null,
                error: error.message,
                keyCount: 0,
                type: "invalid",
                byteSize: 0
            })
            setStatus({
                type: "invalid",
                msg: `❌ Geçersiz JSON: ${error.message}`
            })
        }
    }, [])

    // Input değişikliği - debounce ile
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => validateJSON(val), 300)
    }, [validateJSON])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            validateJSON(SAMPLE)
        }
    }, [validateJSON])

    // Formatla
    const doFormat = () => {
        if (validation.valid && validation.data !== null) {
            const formatted = JSON.stringify(validation.data, null, 2)
            setInput(formatted)
            validateJSON(formatted)
        }
    }

    // Minify
    const doMinify = () => {
        if (validation.valid && validation.data !== null) {
            const minified = JSON.stringify(validation.data)
            setInput(minified)
            validateJSON(minified)
        }
    }

    // Temizle
    const doClear = () => {
        setInput("")
        setValidation({
            valid: false,
            data: null,
            error: null,
            keyCount: 0,
            type: "empty",
            byteSize: 0
        })
        setStatus({
            type: "idle",
            msg: "JSON girin veya yapıştırın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE)
        validateJSON(SAMPLE)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyResult = () => {
        const text = validation.valid && validation.data !== null
            ? JSON.stringify(validation.data, null, 2)
            : validation.error || "Geçersiz JSON"

        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            validateJSON(text)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Status renkleri
    const getStatusColor = () => {
        if (status.type === "valid") return "bg-emerald-500/10 border-emerald-500/20"
        if (status.type === "invalid") return "bg-red-500/10 border-red-500/20"
        return "bg-white/5 border-white/5"
    }

    const getDotColor = () => {
        if (status.type === "valid") return "bg-emerald-400"
        if (status.type === "invalid") return "bg-red-400"
        return "bg-white/20"
    }

    const getMsgColor = () => {
        if (status.type === "valid") return "text-emerald-400"
        if (status.type === "invalid") return "text-red-400"
        return "text-white/40"
    }

    // JSON Önizleme (valid JSON için)
    const renderPreview = () => {
        if (!validation.valid || validation.data === null) return null

        return (
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Önizleme</span>
                    <div className="flex gap-1">
                        <button
                            onClick={copyResult}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Kopyala
                        </button>
                    </div>
                </div>
                <div className="p-4 font-mono text-sm text-white/70 overflow-auto max-h-64">
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(validation.data, null, 2)}
          </pre>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => validateJSON(input)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Validate
                </button>
                {validation.valid && (
                    <>
                        <button
                            onClick={doFormat}
                            className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                        >
                            Formatla
                        </button>
                        <button
                            onClick={doMinify}
                            className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                        >
                            Minify
                        </button>
                    </>
                )}
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
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor()}`}>
                <div className={`w-2 h-2 rounded-full ${getDotColor()}`} />
                <div>
                    <span className={getMsgColor()}>{status.msg}</span>
                    {status.meta && (
                        <span className="text-white/40 ml-2 text-xs">{status.meta}</span>
                    )}
                </div>
                <div className="ml-auto flex gap-2">
                    {validation.valid && (
                        <button
                            onClick={copyResult}
                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-1 text-white transition-colors"
                        >
                            Kopyala
                        </button>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JSON Giriş</span>
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
                    placeholder='{ "key": "value" }'
                    spellCheck={false}
                    className={`w-full min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent resize-none outline-none placeholder:text-white/20 ${
                        validation.valid ? 'text-white' : 'text-red-400'
                    }`}
                />
            </div>

            {/* Preview (valid JSON için) */}
            {renderPreview()}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-[#22263a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white z-50">
                    {toast}
                </div>
            )}
        </div>
    )
}