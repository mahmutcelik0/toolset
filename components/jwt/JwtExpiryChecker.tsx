"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFobWV0IFlpbG1heiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzQ4NzY1NDIyLCJlbWFpbCI6ImFobWV0QG9ybmVrLmNvbSIsInJvbGVzIjpbInVzZXIiLCJhZG1pbiJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

type Status = {
    type: "idle" | "ok" | "warning" | "error"
    msg: string
    meta?: string
}

interface ExpiryInfo {
    isValid: boolean
    isExpired: boolean
    isExpiringSoon: boolean
    iat: number | null
    exp: number | null
    iatDate: Date | null
    expDate: Date | null
    remainingTime: number | null // milliseconds
    remainingText: string
    percentage: number
    payload: Record<string, unknown> | null
    error?: string
}

export default function JwtExpiryChecker() {
    const [input, setInput] = useState<string>(SAMPLE_JWT)
    const [info, setInfo] = useState<ExpiryInfo | null>(null)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "JWT token girip Kontrol et butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [autoRefresh, setAutoRefresh] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const refreshInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
    const isFirstRender = useRef(true)

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

    // Kalan süreyi formatla
    const formatTime = (ms: number): string => {
        if (ms < 0) return "Expired"

        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`
        }
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`
        }
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`
        }
        return `${seconds}s`
    }

    // JWT Expiry Kontrolü
    const checkExpiry = useCallback((token: string) => {
        if (!token.trim()) {
            setInfo(null)
            setStatus({
                type: "idle",
                msg: "JWT token girin"
            })
            return
        }

        try {
            const parts = token.split('.')

            if (parts.length !== 3) {
                setInfo(null)
                setStatus({
                    type: "error",
                    msg: "❌ Geçersiz JWT formatı. Token 3 parçadan oluşmalıdır."
                })
                return
            }

            const [, payloadB64] = parts
            const payloadStr = base64UrlDecode(payloadB64)
            const payload = JSON.parse(payloadStr)

            const iat = payload.iat ? Number(payload.iat) : null
            const exp = payload.exp ? Number(payload.exp) : null
            const now = Math.floor(Date.now() / 1000)

            // Validasyonlar
            const isValid = true // Format olarak geçerli
            const isExpired = exp !== null && now > exp
            const isExpiringSoon = exp !== null && (exp - now) < 86400 // 24 saat

            let iatDate = null
            let expDate = null
            let remainingTime = null
            let percentage = 0

            if (iat) {
                iatDate = new Date(iat * 1000)
            }

            if (exp) {
                expDate = new Date(exp * 1000)
                remainingTime = (exp - now) * 1000
                // Süre yüzdesi (0-100 arası)
                const total = exp - (iat || exp - 3600)
                const elapsed = now - (iat || exp - 3600)
                percentage = Math.min(100, Math.max(0, (elapsed / total) * 100))
            }

            const remainingText = remainingTime !== null
                ? formatTime(remainingTime)
                : "Bilinmiyor"

            // Status mesajını ayarla
            let statusType: "ok" | "warning" | "error" = "ok"
            let statusMsg = ""

            if (isExpired) {
                statusType = "error"
                statusMsg = "❌ Token süresi dolmuş"
            } else if (isExpiringSoon) {
                statusType = "warning"
                statusMsg = "⚠️ Token yakında süresi dolacak"
            } else {
                statusType = "ok"
                statusMsg = "✅ Token geçerli"
            }

            setInfo({
                isValid,
                isExpired,
                isExpiringSoon,
                iat,
                exp,
                iatDate,
                expDate,
                remainingTime,
                remainingText,
                percentage,
                payload
            })

            setStatus({
                type: statusType,
                msg: statusMsg,
                meta: exp ? `Expires: ${expDate?.toLocaleString()}` : "No expiry set"
            })

        } catch (e) {
            const error = e as Error
            setInfo(null)
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
        debounce.current = setTimeout(() => checkExpiry(val), 300)
    }, [checkExpiry])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            checkExpiry(SAMPLE_JWT)
        }
    }, [checkExpiry])

    // Auto refresh
    useEffect(() => {
        if (autoRefresh && info) {
            refreshInterval.current = setInterval(() => {
                checkExpiry(input)
            }, 5000) // Her 5 saniyede bir yenile
        } else {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current)
                refreshInterval.current = undefined
            }
        }

        return () => {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current)
            }
        }
    }, [autoRefresh, input, info, checkExpiry])

    // Temizle
    const doClear = () => {
        setInput("")
        setInfo(null)
        setStatus({
            type: "idle",
            msg: "JWT token girin"
        })
        setTimeLeft("")
        if (refreshInterval.current) {
            clearInterval(refreshInterval.current)
            refreshInterval.current = undefined
        }
        setAutoRefresh(false)
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE_JWT)
        checkExpiry(SAMPLE_JWT)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyResult = () => {
        if (!info) {
            showToast("Kopyalanacak sonuç yok")
            return
        }
        const text = JSON.stringify(info, null, 2)
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            checkExpiry(text)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Status renkleri
    const getDotColor = () => {
        if (status.type === "ok") return "bg-emerald-400"
        if (status.type === "warning") return "bg-yellow-400"
        if (status.type === "error") return "bg-red-400"
        return "bg-white/20"
    }

    const getMsgColor = () => {
        if (status.type === "ok") return "text-emerald-400"
        if (status.type === "warning") return "text-yellow-400"
        if (status.type === "error") return "text-red-400"
        return "text-white/40"
    }

    // Progress bar rengi
    const getProgressColor = () => {
        if (!info) return "bg-white/20"
        if (info.isExpired) return "bg-red-500"
        if (info.isExpiringSoon) return "bg-yellow-500"
        return "bg-emerald-500"
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => checkExpiry(input)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Kontrol Et
                </button>
                <button
                    onClick={() => {
                        setAutoRefresh(!autoRefresh)
                        if (!autoRefresh) {
                            showToast("Auto-refresh başlatıldı")
                        } else {
                            showToast("Auto-refresh durduruldu")
                        }
                    }}
                    className={`h-8 px-4 border text-sm rounded-lg transition-colors ${
                        autoRefresh
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-white/60"
                    }`}
                >
                    {autoRefresh ? "⏸️ Auto-Refresh" : "▶️ Auto-Refresh"}
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

            {/* Results */}
            {info && (
                <>
                    {/* Status Card */}
                    <div className={`p-4 rounded-xl border ${
                        info.isExpired
                            ? "bg-red-500/10 border-red-500/30"
                            : info.isExpiringSoon
                                ? "bg-yellow-500/10 border-yellow-500/30"
                                : "bg-emerald-500/10 border-emerald-500/30"
                    }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className={`text-lg font-semibold ${
                                    info.isExpired
                                        ? "text-red-400"
                                        : info.isExpiringSoon
                                            ? "text-yellow-400"
                                            : "text-emerald-400"
                                }`}>
                                    {info.isExpired ? "🔴 Token Süresi Dolmuş" : info.isExpiringSoon ? "🟡 Token Yakında Dolacak" : "🟢 Token Geçerli"}
                                </div>
                                <div className="text-xs text-white/40 mt-1">
                                    {info.expDate ? `Expires: ${info.expDate.toLocaleString()}` : "No expiry date set"}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                    {info.remainingText}
                                </div>
                                <div className="text-xs text-white/30">Kalan Süre</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/40">
                            <span>Oluşturulma</span>
                            <span>{info.percentage.toFixed(1)}%</span>
                            <span>Süre Dolumu</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${getProgressColor()}`}
                                style={{ width: `${Math.min(100, info.percentage)}%` }}
                            />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl p-4">
                            <div className="text-xs text-white/30">Issued At (iat)</div>
                            <div className="text-sm font-mono text-white/80 mt-1">
                                {info.iatDate ? info.iatDate.toLocaleString() : "❌ Yok"}
                            </div>
                        </div>
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl p-4">
                            <div className="text-xs text-white/30">Expires At (exp)</div>
                            <div className="text-sm font-mono text-white/80 mt-1">
                                {info.expDate ? info.expDate.toLocaleString() : "❌ Yok"}
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl p-3">
                            <div className="text-xs text-white/30">Unix (iat)</div>
                            <div className="text-sm font-mono text-white/60 mt-1">
                                {info.iat !== null ? info.iat : "❌"}
                            </div>
                        </div>
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl p-3">
                            <div className="text-xs text-white/30">Unix (exp)</div>
                            <div className="text-sm font-mono text-white/60 mt-1">
                                {info.exp !== null ? info.exp : "❌"}
                            </div>
                        </div>
                        <div className="bg-[#1a1d27] border border-white/8 rounded-xl p-3">
                            <div className="text-xs text-white/30">Status</div>
                            <div className="text-sm font-mono mt-1">
                <span className={info.isExpired ? "text-red-400" : "text-emerald-400"}>
                  {info.isExpired ? "⚠️ Expired" : "✅ Valid"}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payload Preview */}
                    <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Payload</span>
                            <span className="text-xs text-white/30">exp, iat içerir</span>
                        </div>
                        <div className="p-4 font-mono text-xs text-white/50 overflow-auto max-h-32">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(info.payload, null, 2)}
              </pre>
                        </div>
                    </div>
                </>
            )}

            {/* Info */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">JWT Expiry Bilgisi</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">iat</span>
                        <br />Token oluşturulma zamanı (Unix timestamp)
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">exp</span>
                        <br />Token süre dolum zamanı (Unix timestamp)
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Auto-Refresh</span>
                        <br />Her 5 saniyede otomatik kontrol
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Expiring Soon</span>
                        <br />24 saat veya daha az kaldığında uyarı
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