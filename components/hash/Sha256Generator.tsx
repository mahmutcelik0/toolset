"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = `Merhaba Dünya! Bu bir SHA-256 test metnidir.
Hello World! This is a SHA-256 test text.
1234567890 !@#$%^&*()`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

export default function Sha256Generator() {
    const [input, setInput] = useState<string>(SAMPLE_TEXT)
    const [output, setOutput] = useState<string>("")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "Metin girip SHA-256 oluştur'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [isUpperCase, setIsUpperCase] = useState<boolean>(false)
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // SHA-256 hash fonksiyonu (Web Crypto API kullanarak)
    const generateSha256 = useCallback(async (text: string): Promise<string> => {
        if (!text) return ""

        const encoder = new TextEncoder()
        const data = encoder.encode(text)

        // Web Crypto API ile SHA-256 hash oluştur
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return hashHex
    }, [])

    // Hash işlemi
    const processHash = useCallback(async (text: string, upperCase: boolean) => {
        if (!text.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: "Metin girin"
            })
            return
        }

        try {
            const hash = await generateSha256(text)
            const finalHash = upperCase ? hash.toUpperCase() : hash.toLowerCase()
            setOutput(finalHash)

            setStatus({
                type: "ok",
                msg: "✅ SHA-256 hash oluşturuldu",
                meta: `${hash.length} karakter · ${text.length} karakter girdi`
            })
        } catch (e) {
            const error = e as Error
            setOutput("")
            setStatus({
                type: "error",
                msg: `❌ ${error.message}`
            })
        }
    }, [generateSha256])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processHash(val, isUpperCase), 300)
    }, [isUpperCase, processHash])

    // Upper case değişikliği
    const onUpperCaseChange = useCallback((val: boolean) => {
        setIsUpperCase(val)
        processHash(input, val)
    }, [input, processHash])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            processHash(SAMPLE_TEXT, isUpperCase)
        }
    }, [isUpperCase, processHash])

    // Temizle
    const doClear = () => {
        setInput("")
        setOutput("")
        setStatus({
            type: "idle",
            msg: "Metin girip SHA-256 oluştur'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE_TEXT)
        processHash(SAMPLE_TEXT, isUpperCase)
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
            processHash(text, isUpperCase)
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

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processHash(input, isUpperCase)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    SHA-256 Oluştur
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

            {/* Options */}
            <div className="flex flex-wrap gap-4 p-3 bg-[#1a1d27] border border-white/8 rounded-lg">
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isUpperCase}
                        onChange={(e) => onUpperCaseChange(e.target.checked)}
                        className="accent-indigo-500"
                    />
                    Büyük Harf (Uppercase)
                </label>
                <span className="text-xs text-white/30 ml-2">SHA-256: 256-bit (64 karakter)</span>
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
                    <textarea
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        placeholder="Metin girin..."
                        spellCheck={false}
                        className="flex-1 min-h-48 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">SHA-256 Hash</span>
                        <div className="flex gap-1">
                            <button
                                onClick={copyOutput}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Kopyala
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-48 p-4 font-mono text-sm leading-relaxed overflow-auto">
            <span className="text-yellow-300 break-all">
              {output || "Hash oluşturmak için metin girin..."}
            </span>
                    </div>
                </div>
            </div>

            {/* SHA-256 Info */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">SHA-256 Bilgisi</span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Algoritma</span>
                        <br />SHA-256 (Secure Hash Algorithm 256)
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Bit Uzunluğu</span>
                        <br />256-bit
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Karakter</span>
                        <br />64 hex karakter
                    </div>
                    <div className="text-white/40">
                        <span className="text-white/60 font-medium">Kullanım</span>
                        <br />✅ Güvenli hash
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