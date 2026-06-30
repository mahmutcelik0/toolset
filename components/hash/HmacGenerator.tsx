"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const SAMPLE_TEXT = "Merhaba Dünya! Bu bir HMAC test metnidir."
const SAMPLE_SECRET = "my-secret-key-123"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

export default function HmacGenerator() {
    const [input, setInput] = useState<string>(SAMPLE_TEXT)
    const [secret, setSecret] = useState<string>(SAMPLE_SECRET)
    const [output, setOutput] = useState<string>("")
    const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "Metin, secret ve algoritma seçip HMAC oluştur'a tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const [isUpperCase, setIsUpperCase] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // HMAC oluştur
    const generateHmac = useCallback(async (text: string, key: string, algo: HashAlgorithm): Promise<string> => {
        if (!text || !key) return ""

        const encoder = new TextEncoder()
        const keyData = encoder.encode(key)
        const messageData = encoder.encode(text)

        // CryptoKey oluştur
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: { name: algo } },
            false,
            ['sign']
        )

        // HMAC imzası oluştur
        const signature = await crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            messageData
        )

        const hashArray = Array.from(new Uint8Array(signature))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return hashHex
    }, [])

    // HMAC işlemi
    const processHash = useCallback(async (text: string, key: string, algo: HashAlgorithm, upperCase: boolean) => {
        if (!text.trim() || !key.trim()) {
            setOutput("")
            setStatus({
                type: "idle",
                msg: !text.trim() && !key.trim() ? "Metin ve secret girin" : !text.trim() ? "Metin girin" : "Secret girin"
            })
            return
        }

        setIsLoading(true)

        try {
            const hash = await generateHmac(text, key, algo)
            const finalHash = upperCase ? hash.toUpperCase() : hash.toLowerCase()
            setOutput(finalHash)

            const algoName = algo.replace('SHA-', '')
            setStatus({
                type: "ok",
                msg: `✅ HMAC-${algoName} oluşturuldu`,
                meta: `${hash.length} karakter · ${algo}`
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
    }, [generateHmac])

    // Input değişikliği
    const onInput = useCallback((val: string) => {
        setInput(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processHash(val, secret, algorithm, isUpperCase), 500)
    }, [secret, algorithm, isUpperCase, processHash])

    // Secret değişikliği
    const onSecretChange = useCallback((val: string) => {
        setSecret(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => processHash(input, val, algorithm, isUpperCase), 500)
    }, [input, algorithm, isUpperCase, processHash])

    // Algoritma değişikliği
    const onAlgorithmChange = useCallback((algo: HashAlgorithm) => {
        setAlgorithm(algo)
        if (input.trim() && secret.trim()) {
            processHash(input, secret, algo, isUpperCase)
        }
    }, [input, secret, isUpperCase, processHash])

    // Upper case değişikliği
    const onUpperCaseChange = useCallback((val: boolean) => {
        setIsUpperCase(val)
        if (input.trim() && secret.trim() && output) {
            // Sadece output'u güncelle
            processHash(input, secret, algorithm, val)
        }
    }, [input, secret, algorithm, output, processHash])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            processHash(SAMPLE_TEXT, SAMPLE_SECRET, algorithm, isUpperCase)
        }
    }, [algorithm, isUpperCase, processHash])

    // Temizle
    const doClear = () => {
        setInput("")
        setSecret("")
        setOutput("")
        setStatus({
            type: "idle",
            msg: "Metin, secret ve algoritma seçip HMAC oluştur'a tıklayın"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setInput(SAMPLE_TEXT)
        setSecret(SAMPLE_SECRET)
        processHash(SAMPLE_TEXT, SAMPLE_SECRET, algorithm, isUpperCase)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyOutput = () => {
        if (!output) {
            showToast("Kopyalanacak HMAC yok")
            return
        }
        navigator.clipboard.writeText(output).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setInput(text)
            processHash(text, secret, algorithm, isUpperCase)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Secret yapıştır
    const handlePasteSecret = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setSecret(text)
            processHash(input, text, algorithm, isUpperCase)
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

    // Algoritma seçenekleri
    const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]

    // Algoritma bilgileri
    const getAlgorithmInfo = (algo: HashAlgorithm) => {
        const info = {
            "SHA-1": { bit: 160, char: 40, security: "⚠️" },
            "SHA-256": { bit: 256, char: 64, security: "✅" },
            "SHA-384": { bit: 384, char: 96, security: "✅" },
            "SHA-512": { bit: 512, char: 128, security: "✅" },
        }
        return info[algo]
    }

    const algoInfo = getAlgorithmInfo(algorithm)

    return (
        <div className="space-y-4">
            {/* Algorithm Selector */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/40">Algorithm:</span>
                {algorithms.map((algo) => (
                    <button
                        key={algo}
                        onClick={() => onAlgorithmChange(algo)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                            algorithm === algo
                                ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                        }`}
                    >
                        {algo}
                        <span className="text-[10px] ml-1 text-white/30">
              ({getAlgorithmInfo(algo).bit}-bit)
            </span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => processHash(input, secret, algorithm, isUpperCase)}
                    disabled={isLoading}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {isLoading ? "⏳ Oluşturuluyor..." : "HMAC Oluştur"}
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
                <span className="text-xs text-white/30 ml-2">
          {algorithm}: {algoInfo.bit}-bit ({algoInfo.char} karakter) {algoInfo.security}
        </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Input - Message */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Metin</span>
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
                        className="flex-1 min-h-32 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Input - Secret */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Secret Key</span>
                        <button
                            onClick={handlePasteSecret}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Yapıştır
                        </button>
                    </div>
                    <input
                        type="text"
                        value={secret}
                        onChange={(e) => onSecretChange(e.target.value)}
                        placeholder="Secret key girin..."
                        className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Output */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
          <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
            HMAC-{algorithm.replace('SHA-', '')} Hash
          </span>
                    <div className="flex gap-1">
                        <button
                            onClick={copyOutput}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Kopyala
                        </button>
                    </div>
                </div>
                <div className="min-h-24 p-4 font-mono text-sm leading-relaxed overflow-auto">
          <span className="text-yellow-300 break-all">
            {output || "HMAC oluşturmak için metin ve secret girin..."}
          </span>
                </div>
            </div>

            {/* HMAC Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">HMAC Nedir?</span>
                    </div>
                    <div className="p-4 text-xs text-white/40 space-y-1">
                        <div>🔐 HMAC = Hash-based Message Authentication Code</div>
                        <div>📝 Mesaj doğrulama ve bütünlük kontrolü</div>
                        <div>🔑 Secret key ile hash oluşturur</div>
                        <div>🛡️ API authentication, JWT, OAuth kullanılır</div>
                    </div>
                </div>

                <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Kullanım Alanları</span>
                    </div>
                    <div className="p-4 text-xs text-white/40 space-y-1">
                        <div>🔑 API authentication (AWS, Stripe)</div>
                        <div>📦 JWT token doğrulama</div>
                        <div>🔒 OAuth signature oluşturma</div>
                        <div>📨 Mesaj bütünlüğü kontrolü</div>
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