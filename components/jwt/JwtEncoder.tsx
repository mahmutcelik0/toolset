"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_HEADER = `{
  "alg": "HS256",
  "typ": "JWT"
}`

const SAMPLE_PAYLOAD = `{
  "sub": "1234567890",
  "name": "Ahmet Yılmaz",
  "iat": 1516239022,
  "exp": 1748765422,
  "email": "ahmet@ornek.com",
  "roles": ["user", "admin"]
}`

const SAMPLE_SECRET = "my-secret-key"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface JwtResult {
    token: string
    header: Record<string, unknown>
    payload: Record<string, unknown>
    signature: string
}

export default function JwtEncoder() {
    const [header, setHeader] = useState<string>(SAMPLE_HEADER)
    const [payload, setPayload] = useState<string>(SAMPLE_PAYLOAD)
    const [secret, setSecret] = useState<string>(SAMPLE_SECRET)
    const [algorithm, setAlgorithm] = useState<string>("HS256")
    const [result, setResult] = useState<JwtResult | null>(null)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "Header, payload ve secret girip Encode'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [showRaw, setShowRaw] = useState<boolean>(false)

    // UTF-8 string'i ArrayBuffer'a çevir (btoa için)
    const utf8ToBinary = (str: string): string => {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(str)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return binary
    }

    // Base64 URL encode (UTF-8 desteği ile)
    const base64UrlEncode = (str: string): string => {
        // UTF-8'den binary'e çevir, sonra btoa
        const binary = utf8ToBinary(str)
        const base64 = btoa(binary)
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }

    // Base64 URL decode (UTF-8 desteği ile)
    const base64UrlDecode = (str: string): string => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4) {
            base64 += '='
        }
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        const decoder = new TextDecoder()
        return decoder.decode(bytes)
    }

    // HMAC SHA-256 signature
    const signJWT = async (headerB64: string, payloadB64: string, secretKey: string): Promise<string> => {
        const data = `${headerB64}.${payloadB64}`
        const encoder = new TextEncoder()
        const keyData = encoder.encode(secretKey)
        const messageData = encoder.encode(data)

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: { name: 'SHA-256' } },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            messageData
        )

        const uint8Array = new Uint8Array(signature)
        const binaryString = utf8ToBinary(String.fromCharCode(...uint8Array))
        const base64 = btoa(binaryString)
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }

    // JWT Encode
    const encodeJwt = useCallback(async (hdr: string, pld: string, sec: string, alg: string) => {
        if (!hdr.trim() || !pld.trim() || !sec.trim()) {
            setResult(null)
            setStatus({
                type: "idle",
                msg: "Header, payload ve secret girin"
            })
            return
        }

        try {
            const headerObj = JSON.parse(hdr)
            const payloadObj = JSON.parse(pld)

            headerObj.alg = alg
            headerObj.typ = "JWT"

            const headerStr = JSON.stringify(headerObj)
            const payloadStr = JSON.stringify(payloadObj)

            // Base64 URL encode (UTF-8 desteği ile)
            const headerB64 = base64UrlEncode(headerStr)
            const payloadB64 = base64UrlEncode(payloadStr)

            const signature = await signJWT(headerB64, payloadB64, sec)
            const token = `${headerB64}.${payloadB64}.${signature}`

            setResult({
                token,
                header: headerObj,
                payload: payloadObj,
                signature
            })

            setStatus({
                type: "ok",
                msg: "✅ JWT encoded successfully",
                meta: `${token.length} characters`
            })
        } catch (e) {
            const error = e as Error
            setResult(null)
            setStatus({
                type: "error",
                msg: `❌ ${error.message}`
            })
        }
    }, [])

    const onHeaderChange = useCallback((val: string) => {
        setHeader(val)
    }, [])

    const onPayloadChange = useCallback((val: string) => {
        setPayload(val)
    }, [])

    const onSecretChange = useCallback((val: string) => {
        setSecret(val)
    }, [])

    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            encodeJwt(SAMPLE_HEADER, SAMPLE_PAYLOAD, SAMPLE_SECRET, algorithm)
        }
    }, [encodeJwt, algorithm])

    const doClear = () => {
        setHeader("")
        setPayload("")
        setSecret("")
        setResult(null)
        setStatus({
            type: "idle",
            msg: "Header, payload ve secret girin"
        })
    }

    const doLoadSample = () => {
        setHeader(SAMPLE_HEADER)
        setPayload(SAMPLE_PAYLOAD)
        setSecret(SAMPLE_SECRET)
        encodeJwt(SAMPLE_HEADER, SAMPLE_PAYLOAD, SAMPLE_SECRET, algorithm)
    }

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    const copyOutput = (type: "token" | "header" | "payload" | "full") => {
        if (!result) {
            showToast("Kopyalanacak çıktı yok")
            return
        }

        let text = ""
        if (type === "token") {
            text = result.token
        } else if (type === "header") {
            text = JSON.stringify(result.header, null, 2)
        } else if (type === "payload") {
            text = JSON.stringify(result.payload, null, 2)
        } else {
            text = JSON.stringify(result, null, 2)
        }

        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    const onAlgorithmChange = useCallback((alg: string) => {
        setAlgorithm(alg)
    }, [])

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

    const algorithms = ["HS256", "HS384", "HS512"]

    return (
        <div className="space-y-4">
            {/* Algorithm Selector */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-white/40">Algorithm:</span>
                {algorithms.map((alg) => (
                    <button
                        key={alg}
                        onClick={() => onAlgorithmChange(alg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                            algorithm === alg
                                ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                        }`}
                    >
                        {alg}
                    </button>
                ))}
                <span className="text-xs text-white/30 ml-2">(HMAC with SHA)</span>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => encodeJwt(header, payload, secret, algorithm)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Encode
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

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Header</span>
                        <span className="text-xs text-white/30">alg, typ</span>
                    </div>
                    <textarea
                        value={header}
                        onChange={(e) => onHeaderChange(e.target.value)}
                        placeholder='{ "alg": "HS256", "typ": "JWT" }'
                        spellCheck={false}
                        className="flex-1 min-h-32 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Payload</span>
                        <span className="text-xs text-white/30">claims</span>
                    </div>
                    <textarea
                        value={payload}
                        onChange={(e) => onPayloadChange(e.target.value)}
                        placeholder='{ "sub": "123", "name": "John" }'
                        spellCheck={false}
                        className="flex-1 min-h-32 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Secret */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Secret Key</span>
                    <span className="text-xs text-white/30">HMAC secret</span>
                </div>
                <input
                    type="text"
                    value={secret}
                    onChange={(e) => onSecretChange(e.target.value)}
                    placeholder="my-secret-key"
                    className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                />
            </div>

            {/* Output */}
            {result && (
                <>
                    <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Generated JWT</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => copyOutput("token")}
                                    className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                                >
                                    Kopyala
                                </button>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm text-white/80 break-all overflow-auto max-h-32">
                            {result.token}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                            <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                                <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Header</span>
                            </div>
                            <div className="p-3 font-mono text-xs text-white/50 break-all max-h-16 overflow-auto">
                                {result.token.split('.')[0]}
                            </div>
                        </div>
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                            <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                                <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Payload</span>
                            </div>
                            <div className="p-3 font-mono text-xs text-white/50 break-all max-h-16 overflow-auto">
                                {result.token.split('.')[1]}
                            </div>
                        </div>
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                            <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                                <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Signature</span>
                            </div>
                            <div className="p-3 font-mono text-xs text-white/50 break-all max-h-16 overflow-auto">
                                {result.token.split('.')[2]}
                            </div>
                        </div>
                    </div>

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
                                {result.token}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* JWT Info */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JWT Yapısı</span>
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