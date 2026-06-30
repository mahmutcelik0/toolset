"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import bcrypt from "bcryptjs"

const SAMPLE_TEXT = "MySecurePassword123!"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

export default function BcryptGenerator() {
    const [input, setInput] = useState<string>(SAMPLE_TEXT)
    const [output, setOutput] = useState<string>("")
    const [saltRounds, setSaltRounds] = useState<number>(10)
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "Metin girip BCrypt oluştur'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // BCrypt hash oluştur
    const generateBcrypt = useCallback(async (text: string, rounds: number): Promise<string> => {
        if (!text) return ""

        const salt = await bcrypt.genSalt(rounds)
        const hash = await bcrypt.hash(text, salt)

        return hash
    }, [])

    // Hash işlemi
    const processHash = useCallback(async (text: string, rounds: number) => {
        if (!text.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: "Metin girin"
            })
            return
        }

        setIsLoading(true)

        try {
            const hash = await generateBcrypt(text, rounds)
            setOutput(hash)

            setStatus({
                type: "ok",
                msg: "✅ BCrypt hash oluşturuldu",
                meta: `${hash.length} karakter · ${rounds} tur`
            })
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStatus({
                type: "error",
                msg: `❌ ${error.message}`
            })
        } finally {
            setIsLoading(false)
        }
    }, [generateBcrypt])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processHash(val, saltRounds), 500)
    }, [saltRounds, processHash])

    // Salt rounds değişikliği
    const onSaltRoundsChange = useCallback((val: number) => {
        setSaltRounds(val)
        if (input.trim()) {
            processHash(input, val)
        }
    }, [input, processHash])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            processHash(SAMPLE_TEXT, saltRounds)
        }
    }, [saltRounds, processHash])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStatus({
            type: "idle",
            msg: "Metin girip BCrypt oluştur'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE_TEXT)
        processHash(SAMPLE_TEXT, saltRounds)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        if (!output) {
            showToast("Kopyalanacak hash yok")
            return
        }
        navigator.clipboard.writeText(output).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            processHash(text, saltRounds)
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

    // Salt rounds önerileri
    const saltRoundOptions = [4, 6, 8, 10, 12, 14, 16]

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processHash(input, saltRounds)}
                    disabled={isLoading}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {isLoading ? "⏳ Oluşturuluyor..." : "BCrypt Oluştur"}
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

            {/* Salt Rounds */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-[#1a1d27] border border-white/8 rounded-lg">
                <span className="text-xs text-white/40">Salt Rounds:</span>
                <div className="flex flex-wrap gap-1">
                    {saltRoundOptions.map((round) => (
                        <button
                            key={round}
                            onClick={() => onSaltRoundsChange(round)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                                saltRounds === round
                                    ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                            }`}
                        >
                            {round}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-white/30 ml-2">(Öneri: 10-12)</span>
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
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Metin Girişi</span>
                        <button
                            onClick={handlePaste}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Yapıştır
                        </button>
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        placeholder="Metin girin..."
                        className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">BCrypt Hash</span>
                        <div className="flex gap-1">
                            <button
                                onClick={copyOutput}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Kopyala
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-24 p-4 font-mono text-sm leading-relaxed overflow-auto">
            <span className="text-yellow-300 break-all">
              {output || "Hash oluşturmak için metin girin..."}
            </span>
                    </div>
                </div>
            </div>

            {/* BCrypt Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">BCrypt Bilgisi</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="text-white/40">
                            <span className="text-white/60 font-medium">Algoritma</span>
                            <br />BCrypt
                        </div>
                        <div className="text-white/40">
                            <span className="text-white/60 font-medium">Temel</span>
                            <br />Blowfish cipher
                        </div>
                        <div className="text-white/40">
                            <span className="text-white/60 font-medium">Salt</span>
                            <br />Otomatik eklenir
                        </div>
                        <div className="text-white/40">
                            <span className="text-white/60 font-medium">Kullanım</span>
                            <br />✅ Şifre hash&apos;leme
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Salt Rounds Rehberi</span>
                    </div>
                    <div className="p-4 text-xs text-white/40 space-y-1">
                        <div><span className="text-white/60">4-6:</span> Hızlı, test için</div>
                        <div><span className="text-white/60">8-10:</span> Orta, geliştirme</div>
                        <div><span className="text-white/60">10-12:</span> ✅ Önerilen</div>
                        <div><span className="text-white/60">14-16:</span> Yüksek güvenlik, yavaş</div>
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