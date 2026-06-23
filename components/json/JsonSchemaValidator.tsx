"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Ajv, { type ErrorObject } from "ajv"
import addFormats from "ajv-formats"

const SAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "kullanici": {
      "type": "object",
      "properties": {
        "id": { "type": "integer", "minimum": 1 },
        "ad": { "type": "string", "minLength": 2 },
        "email": { "type": "string", "format": "email" },
        "aktif": { "type": "boolean" },
        "roller": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        },
        "adres": {
          "type": "object",
          "properties": {
            "sehir": { "type": "string" },
            "posta": { "type": "string" }
          }
        }
      },
      "required": ["id", "ad", "email"]
    },
    "toplam": { "type": "integer", "minimum": 0 },
    "zaman_damgasi": { "type": ["string", "null"] }
  },
  "required": ["kullanici"]
}`

const SAMPLE_DATA = `{
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
    type: "idle" | "valid" | "invalid"
    msg: string
    meta?: string
}

interface ValidationError {
    path: string
    message: string
    params?: Record<string, unknown>
}

// Error params tipleri
interface ErrorParams {
    allowedValues?: unknown[]
    additionalProperty?: string
    minimum?: number
    maximum?: number
    minLength?: number
    maxLength?: number
    minItems?: number
    maxItems?: number
    [key: string]: unknown
}

export default function JsonSchemaValidator() {
    const [schema, setSchema] = useState<string>(SAMPLE_SCHEMA)
    const [data, setData] = useState<string>(SAMPLE_DATA)
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [isValid, setIsValid] = useState<boolean>(true)
    const [status, setStatus] = useState<Status>({
        type: "valid",
        msg: "✅ Veri şemaya uygun"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Validasyon fonksiyonu
    const validate = useCallback((sch: string, dat: string) => {
        if (!sch.trim() || !dat.trim()) {
            setErrors([])
            setIsValid(true)
            setStatus({
                type: "idle",
                msg: "Şema ve veri girin"
            })
            return
        }

        try {
            const ajv = new Ajv({
                allErrors: true,
                verbose: true
            })
            addFormats(ajv)

            const parsedSchema = JSON.parse(sch)
            const parsedData = JSON.parse(dat)

            const validateFn = ajv.compile(parsedSchema)
            const valid = validateFn(parsedData)

            setIsValid(valid)

            if (valid) {
                setErrors([])
                setStatus({
                    type: "valid",
                    msg: "✅ Veri şemaya uygun"
                })
            } else {
                const errorList: ValidationError[] = (validateFn.errors || []).map((err: ErrorObject) => ({
                    path: err.instancePath || '/',
                    message: err.message || 'Geçersiz değer',
                    params: err.params as Record<string, unknown> | undefined
                }))
                setErrors(errorList)
                setStatus({
                    type: "invalid",
                    msg: `❌ ${errorList.length} hata bulundu`
                })
            }
        } catch (e) {
            const error = e as Error
            setErrors([])
            setIsValid(false)
            setStatus({
                type: "invalid",
                msg: `❌ ${error.message}`
            })
        }
    }, [])

    // Schema değişikliği
    const onSchemaChange = useCallback((val: string) => {
        setSchema(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => validate(val, data), 400)
    }, [data, validate])

    // Data değişikliği
    const onDataChange = useCallback((val: string) => {
        setData(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => validate(schema, val), 400)
    }, [schema, validate])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            validate(SAMPLE_SCHEMA, SAMPLE_DATA)
        }
    }, [validate])

    // Formatla
    const formatJSON = (val: string): string => {
        try {
            return JSON.stringify(JSON.parse(val), null, 2)
        } catch {
            return val
        }
    }

    const formatSchema = () => setSchema(formatJSON(schema))
    const formatData = () => setData(formatJSON(data))

    // Temizle
    const doClear = () => {
        setSchema("")
        setData("")
        setErrors([])
        setIsValid(true)
        setStatus({
            type: "idle",
            msg: "Şema ve veri girin"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setSchema(SAMPLE_SCHEMA)
        setData(SAMPLE_DATA)
        validate(SAMPLE_SCHEMA, SAMPLE_DATA)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyResult = () => {
        const result = {
            valid: isValid,
            errors: errors
        }
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
            .then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır - Schema
    const handlePasteSchema = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setSchema(text)
            validate(text, data)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Yapıştır - Data
    const handlePasteData = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setData(text)
            validate(schema, text)
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

    // Hata mesajını güvenli şekilde render et
    const renderErrorDetails = (params: Record<string, unknown> | undefined) => {
        if (!params) return null

        const details: string[] = []

        if (params.allowedValues && Array.isArray(params.allowedValues)) {
            details.push(`İzin verilen: ${params.allowedValues.join(', ')}`)
        }
        if (params.additionalProperty) {
            details.push(`Ekstra özellik: ${params.additionalProperty}`)
        }
        if (params.minimum !== undefined) {
            details.push(`Minimum: ${params.minimum}`)
        }
        if (params.maximum !== undefined) {
            details.push(`Maksimum: ${params.maximum}`)
        }
        if (params.minLength !== undefined) {
            details.push(`Minimum uzunluk: ${params.minLength}`)
        }
        if (params.maxLength !== undefined) {
            details.push(`Maksimum uzunluk: ${params.maxLength}`)
        }
        if (params.minItems !== undefined) {
            details.push(`Minimum eleman: ${params.minItems}`)
        }
        if (params.maxItems !== undefined) {
            details.push(`Maksimum eleman: ${params.maxItems}`)
        }

        if (details.length === 0) return null

        return (
            <div className="text-white/30 text-xs mt-1">
                {details.join(' · ')}
            </div>
        )
    }

    // Hataları render et
    const renderErrors = () => {
        if (errors.length === 0) {
            return <div className="text-white/40 text-center py-4">Hata yok</div>
        }

        return (
            <div className="space-y-2">
                {errors.map((err, i) => (
                    <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm font-mono">
                        <div className="flex items-start gap-2">
                            <span className="text-red-400 font-bold">#{i + 1}</span>
                            <div className="flex-1">
                                <div className="text-red-400">{err.message}</div>
                                <div className="text-white/40 text-xs mt-1">Path: {err.path}</div>
                                {renderErrorDetails(err.params)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => validate(schema, data)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Doğrula
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
                    onClick={copyResult}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Sonucu Kopyala
                </button>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor()}`}>
                <div className={`w-2 h-2 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/40 ml-2 text-xs">{status.meta}</span>}
                {errors.length > 0 && (
                    <span className="text-white/30 ml-auto text-xs">{errors.length} hata</span>
                )}
            </div>

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Schema */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JSON Schema</span>
                        <div className="flex gap-1">
                            <button
                                onClick={formatSchema}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Format
                            </button>
                            <button
                                onClick={handlePasteSchema}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Yapıştır
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={schema}
                        onChange={(e) => onSchemaChange(e.target.value)}
                        placeholder='{ "$schema": "..." }'
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Data */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JSON Data</span>
                        <div className="flex gap-1">
                            <button
                                onClick={formatData}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Format
                            </button>
                            <button
                                onClick={handlePasteData}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Yapıştır
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={data}
                        onChange={(e) => onDataChange(e.target.value)}
                        placeholder='{ "key": "value" }'
                        spellCheck={false}
                        className={`flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent resize-none outline-none placeholder:text-white/20 ${
                            isValid ? 'text-white' : 'text-red-400'
                        }`}
                    />
                </div>
            </div>

            {/* Errors */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Validasyon Hataları</span>
                    <span className="text-xs text-white/30">{errors.length} hata</span>
                </div>
                <div className="p-4 max-h-64 overflow-auto">
                    {renderErrors()}
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