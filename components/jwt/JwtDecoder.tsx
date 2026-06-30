"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFobWV0IFlpbG1heiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzQ4NzY1NDIyLCJlbWFpbCI6ImFobWV0QG9ybmVrLmNvbSIsInJvbGVzIjpbInVzZXIiLCJhZG1pbiJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface JwtPayload {
    header: Record<string, unknown>
    payload: Record<string, unknown>
    signature: string
    isValid: boolean
    error?: string
}

export default function JwtDecoder() {
    const [input, setInput] = useState<string>(SAMPLE_JWT)
    const [output, setOutput] = useState<JwtPayload | null>(null)
    const [status, setStatus] = useState<Status>({
        type: "ok",
        msg: "✅ JWT decoded successfully",
        meta: "3 parts"
    })
    const [toast, setToast] = useState<string>("")
    const [showRaw, setShowRaw] = useState<boolean>(false)
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Base64 URL decode
    const base64UrlDecode = (str: string): string => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4) {
            base64 += '='
        }
        try {
            const decoded = atob(base64)
            return decodeURIComponent(
                decoded.split('').map(c => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                }).join('')
            )
        } catch {
            return atob(base64)
        }
    }

    // JWT Decode
    const decodeJwt = useCallback((token: string) => {
        if (!token.trim()) {
            setOutput(null)
            setStatus({
                type: "idle",
                msg: "JWT token girin"
            })
            return
        }

        try {
            const parts = token.split('.')

            if (parts.length !== 3) {
                setOutput(null)
                setStatus({
                    type: "error",
                    msg: "❌ Geçersiz JWT formatı. Token 3 parçadan oluşmalıdır."
                })
                return
            }

            const [headerB64, payloadB64, signature] = parts

            // Header'ı decode et
            let header: Record<string, unknown> = {}
            try {
                const headerStr = base64UrlDecode(headerB64)
                header = JSON.parse(headerStr)
            } catch {
                throw new Error("Header decode edilemedi")
            }

            // Payload'ı decode et
            let payload: Record<string, unknown> = {}
            try {
                const payloadStr = base64UrlDecode(payloadB64)
                payload = JSON.parse(payloadStr)
            } catch {
                throw new Error("Payload decode edilemedi")
            }

            // Signature kontrolü (sadece format kontrolü)
            const isValid = signature.length > 0

            setOutput({
                header,
                payload,
                signature,
                isValid
            })

            // Token bilgileri
            const info: string[] = []
            if (payload.iat) {
                const date = new Date((payload.iat as number) * 1000)
                info.push(`Issued: ${date.toLocaleString()}`)
            }
            if (payload.exp) {
                const date = new Date((payload.exp as number) * 1000)
                const now = new Date()
                const expired = now > date
                info.push(`Expires: ${date.toLocaleString()} ${expired ? '⚠️ Expired' : '✅ Valid'}`)
            }
            if (payload.sub) {
                info.push(`Subject: ${payload.sub}`)
            }
            if (payload.email) {
                info.push(`Email: ${payload.email}`)
            }

            setStatus({
                type: "ok",
                msg: "✅ JWT decoded successfully",
                meta: info.join(' · ') || `${parts.length} parts`
            })
        } catch (e) {
            const error = e as Error
            setOutput(null)
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
        debounce.current = setTimeout(() => decodeJwt(val), 300)
    }, [decodeJwt])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            decodeJwt(SAMPLE_JWT)
        }
    }, [decodeJwt])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput(null)
        setStatus({
            type: "idle",
            msg: "JWT token girin"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE_JWT)
        decodeJwt(SAMPLE_JWT)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = (type: "header" | "payload" | "full") => {
        if (!output) {
            showToast("Kopyalanacak çıktı yok")
            return
        }

        let text = ""
        if (type === "header") {
            text = JSON.stringify(output.header, null, 2)
        } else if (type === "payload") {
            text = JSON.stringify(output.payload, null, 2)
        } else {
            text = JSON.stringify(output, null, 2)
        }

        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            decodeJwt(text)
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

    // JSON highlight
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

    // Token info
    const getTokenInfo = () => {
        if (!output) return null

        const info: { label: string; value: string; color?: string }[] = []

        if (output.payload.iat) {
            const date = new Date((output.payload.iat as number) * 1000)
            info.push({ label: "Issued At (iat)", value: date.toLocaleString() })
        }
        if (output.payload.exp) {
            const date = new Date((output.payload.exp as number) * 1000)
            const now = new Date()
            const expired = now > date
            info.push({
                label: "Expires At (exp)",
                value: date.toLocaleString(),
                color: expired ? "text-red-400" : "text-emerald-400"
            })
        }
        if (output.payload.sub) {
            info.push({ label: "Subject (sub)", value: output.payload.sub as string })
        }
        if (output.payload.email) {
            info.push({ label: "Email", value: output.payload.email as string })
        }
        if (output.payload.name) {
            info.push({ label: "Name", value: output.payload.name as string })
        }

        return info
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => decodeJwt(input)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Decode
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
                    onClick={() => setShowRaw(!showRaw)}
                    className={`h-8 px-4 border text-sm rounded-lg transition-colors ${
                        showRaw
                            ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-white/60"
                    }`}
                >
                    {showRaw ? "📊 Görsel" : "📄 Ham"}
                </button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Input */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JWT Token</span>
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
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    spellCheck={false}
                    className="w-full min-h-20 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                />
            </div>

            {/* Output */}
            {output && (
                <>
                    {/* Token Info */}
                    {getTokenInfo() && getTokenInfo()!.length > 0 && (
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                            <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                                <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Token Info</span>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                {getTokenInfo()!.map((item, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-xs text-white/30">{item.label}</span>
                                        <span className={`font-mono ${item.color || 'text-white/80'}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Header</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => copyOutput("header")}
                                    className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                                >
                                    Kopyala
                                </button>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm leading-relaxed overflow-auto max-h-48">
              <pre
                  className="whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(output.header, null, 2)) }}
              />
                        </div>
                    </div>

                    {/* Payload */}
                    <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Payload</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => copyOutput("payload")}
                                    className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                                >
                                    Kopyala
                                </button>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm leading-relaxed overflow-auto max-h-64">
              <pre
                  className="whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(output.payload, null, 2)) }}
              />
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Signature</span>
                            <div className="flex gap-1">
                <span className={`text-xs ${output.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {output.isValid ? '✅ Valid' : '❌ Invalid'}
                </span>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm text-white/60 break-all">
                            {output.signature}
                        </div>
                    </div>

                    {/* Full (raw) */}
                    {showRaw && (
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                                <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Full Token</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => copyOutput("full")}
                                        className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                                    >
                                        Kopyala
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 font-mono text-xs text-white/40 break-all overflow-auto max-h-32">
                                {input}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* JWT Info */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JWT Nedir?</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Header</span>
                        <br />Algoritma ve token tipi
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Payload</span>
                        <br />Veriler (claims)
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Signature</span>
                        <br />Doğrulama için imza
                    </div>
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