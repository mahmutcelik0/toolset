"use client"

import { useState, useCallback, useRef, useEffect } from "react"

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface GeneratorOption {
    id: string
    label: string
    description: string
    generate: (input: string, options: Record<string, boolean>) => string
}

export default function RegexGenerator() {
    const [input, setInput] = useState<string>("")
    const [generatedRegex, setGeneratedRegex] = useState<string>("")
    const [testText, setTestText] = useState<string>("")
    const [matches, setMatches] = useState<string[]>([])
    const [selectedGenerator, setSelectedGenerator] = useState<string>("email")
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "Metin girin ve regex oluşturun"
    })
    const [toast, setToast] = useState<string>("")
    const [options, setOptions] = useState<Record<string, boolean>>({
        caseSensitive: false,
        global: true,
        multiline: false,
        dotAll: false,
        unicode: false
    })

    // Generator'lar
    const generators: GeneratorOption[] = [
        {
            id: "email",
            label: "Email",
            description: "Email adresleri için regex",
            generate: () => {
                return `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`
            }
        },
        {
            id: "url",
            label: "URL",
            description: "URL'ler için regex",
            generate: () => {
                return `(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?`
            }
        },
        {
            id: "phone",
            label: "Telefon",
            description: "Telefon numaraları için regex",
            generate: () => {
                return `\\+?[0-9]{1,3}?[-. ]?\\(?[0-9]{1,4}\\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,9}`
            }
        },
        {
            id: "date",
            label: "Tarih (YYYY-MM-DD)",
            description: "Tarih formatı için regex",
            generate: () => {
                return `\\d{4}-\\d{2}-\\d{2}`
            }
        },
        {
            id: "ipv4",
            label: "IPv4",
            description: "IPv4 adresleri için regex",
            generate: () => {
                return `\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b`
            }
        },
        {
            id: "username",
            label: "Kullanıcı Adı",
            description: "Kullanıcı adları için regex (harf, rakam, alt çizgi)",
            generate: (input: string, opts: Record<string, boolean>) => {
                const min = opts.minLength || 3
                const max = opts.maxLength || 20
                return `^[a-zA-Z0-9_]{${min},${max}}$`
            }
        },
        {
            id: "password",
            label: "Şifre",
            description: "Güçlü şifre için regex (harf, rakam, özel karakter)",
            generate: (input: string, opts: Record<string, boolean>) => {
                const min = opts.minLength || 8
                return `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${min},}$`
            }
        },
        {
            id: "hex-color",
            label: "Hex Renk Kodu",
            description: "Hex renk kodları için regex",
            generate: () => {
                return `^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$`
            }
        },
        {
            id: "slug",
            label: "Slug",
            description: "URL dostu slug için regex",
            generate: () => {
                return `^[a-z0-9]+(?:-[a-z0-9]+)*$`
            }
        },
        {
            id: "custom",
            label: "Özel",
            description: "Kendi regex'inizi oluşturun",
            generate: (input: string) => {
                return input
            }
        }
    ]

    // Regex oluştur
    const generateRegex = useCallback((inputText: string, generatorId: string, opts: Record<string, boolean>) => {
        if (generatorId === "custom") {
            setGeneratedRegex(inputText)
            if (inputText.trim()) {
                setStatus({
                    type: "ok",
                    msg: "✅ Özel regex oluşturuldu"
                })
            } else {
                setStatus({
                    type: "idle",
                    msg: "Regex desenini girin"
                })
            }
            return
        }

        const generator = generators.find(g => g.id === generatorId)
        if (!generator) {
            setStatus({
                type: "error",
                msg: "❌ Geçersiz generator"
            })
            return
        }

        try {
            const regex = generator.generate(inputText, opts)
            setGeneratedRegex(regex)
            setStatus({
                type: "ok",
                msg: `✅ ${generator.label} regex oluşturuldu`,
                meta: `/${regex}/`
            })
        } catch (e) {
            const error = e as Error
            setStatus({
                type: "error",
                msg: `❌ ${error.message}`
            })
        }
    }, [generators])

    // Regex test et
    const testRegex = useCallback((regex: string, text: string, opts: Record<string, boolean>) => {
        if (!regex.trim() || !text.trim()) {
            setMatches([])
            return
        }

        try {
            let flags = ""
            if (opts.global) flags += "g"
            if (!opts.caseSensitive) flags += "i"
            if (opts.multiline) flags += "m"
            if (opts.dotAll) flags += "s"
            if (opts.unicode) flags += "u"

            const reg = new RegExp(regex, flags)
            const matchList: string[] = []
            let match: RegExpExecArray | null

            while ((match = reg.exec(text)) !== null) {
                matchList.push(match[0])
                if (!flags.includes('g')) break
            }

            setMatches(matchList)
        } catch (e) {
            setMatches([])
        }
    }, [])

    // Input değişikliği
    const onInputChange = useCallback((val: string) => {
        setInput(val)
        generateRegex(val, selectedGenerator, options)
        testRegex(generatedRegex, testText, options)
    }, [selectedGenerator, options, generateRegex, generatedRegex, testText])

    // Generator değişikliği
    const onGeneratorChange = useCallback((id: string) => {
        setSelectedGenerator(id)
        generateRegex(input, id, options)
        testRegex(generatedRegex, testText, options)
    }, [input, options, generateRegex, generatedRegex, testText])

    // Option değişikliği
    const onOptionChange = useCallback((key: string, value: boolean) => {
        setOptions(prev => {
            const newOpts = { ...prev, [key]: value }
            generateRegex(input, selectedGenerator, newOpts)
            testRegex(generatedRegex, testText, newOpts)
            return newOpts
        })
    }, [input, selectedGenerator, generateRegex, generatedRegex, testText])

    // Test metni değişikliği
    const onTestTextChange = useCallback((val: string) => {
        setTestText(val)
        testRegex(generatedRegex, val, options)
    }, [generatedRegex, options, testRegex])

    // İlk yükleme
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            generateRegex("", "email", options)
        }
    }, [generateRegex, options])

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyRegex = () => {
        if (!generatedRegex) {
            showToast("Kopyalanacak regex yok")
            return
        }
        navigator.clipboard.writeText(generatedRegex).then(() => showToast("Kopyalandı ✓"))
    }

    // Kopyala - Test sonucu
    const copyMatches = () => {
        if (matches.length === 0) {
            showToast("Kopyalanacak eşleşme yok")
            return
        }
        navigator.clipboard.writeText(matches.join('\n')).then(() => showToast("Kopyalandı ✓"))
    }

    // Temizle
    const doClear = () => {
        setInput("")
        setGeneratedRegex("")
        setTestText("")
        setMatches([])
        setStatus({
            type: "idle",
            msg: "Metin girin ve regex oluşturun"
        })
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

    // Flag display
    const getFlags = () => {
        let flags = ""
        if (options.global) flags += "g"
        if (!options.caseSensitive) flags += "i"
        if (options.multiline) flags += "m"
        if (options.dotAll) flags += "s"
        if (options.unicode) flags += "u"
        return flags || "none"
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => {
                        generateRegex(input, selectedGenerator, options)
                        testRegex(generatedRegex, testText, options)
                    }}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Oluştur
                </button>
                <button
                    onClick={copyRegex}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Kopyala
                </button>
                <button
                    onClick={doClear}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Temizle
                </button>
            </div>

            {/* Generator Select */}
            <div className="flex flex-wrap gap-2">
                {generators.map(gen => (
                    <button
                        key={gen.id}
                        onClick={() => onGeneratorChange(gen.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedGenerator === gen.id
                                ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/40"
                        }`}
                    >
                        {gen.label}
                    </button>
                ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Generated Regex Display */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Oluşturulan Regex</span>
                    <span className="text-xs text-white/30">Flags: {getFlags()}</span>
                </div>
                <div className="p-4 font-mono text-sm text-yellow-200 break-all">
                    {generatedRegex || "Regex oluşturmak için metin girin..."}
                </div>
            </div>

            {/* Input */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
          <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
            {selectedGenerator === "custom" ? "Regex Deseni" : "Metin Girişi"}
          </span>
                    <span className="text-xs text-white/30">
            {selectedGenerator === "custom" ? "Kendi regex'ini yaz" : "Regex oluşturmak için metin gir"}
          </span>
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={selectedGenerator === "custom" ? "/[a-z]+/g" : "Metin girin..."}
                    className="w-full p-4 font-mono text-sm bg-transparent text-white outline-none placeholder:text-white/20"
                />
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4 p-3 bg-[#1a1d27] border border-white/8 rounded-lg">
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.global}
                        onChange={(e) => onOptionChange("global", e.target.checked)}
                        className="accent-indigo-500"
                    />
                    Global (g)
                </label>
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={!options.caseSensitive}
                        onChange={(e) => onOptionChange("caseSensitive", !e.target.checked)}
                        className="accent-indigo-500"
                    />
                    Case Insensitive (i)
                </label>
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.multiline}
                        onChange={(e) => onOptionChange("multiline", e.target.checked)}
                        className="accent-indigo-500"
                    />
                    Multiline (m)
                </label>
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.dotAll}
                        onChange={(e) => onOptionChange("dotAll", e.target.checked)}
                        className="accent-indigo-500"
                    />
                    DotAll (s)
                </label>
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={options.unicode}
                        onChange={(e) => onOptionChange("unicode", e.target.checked)}
                        className="accent-indigo-500"
                    />
                    Unicode (u)
                </label>
            </div>

            {/* Test Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Test Input */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Test Metni</span>
                        <span className="text-xs text-white/30">{matches.length} eşleşme</span>
                    </div>
                    <textarea
                        value={testText}
                        onChange={(e) => onTestTextChange(e.target.value)}
                        placeholder="Regex'i test etmek için metin yapıştırın..."
                        spellCheck={false}
                        className="min-h-32 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Matches */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Eşleşmeler</span>
                        <div className="flex gap-1">
                            <button
                                onClick={copyMatches}
                                className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                            >
                                Kopyala
                            </button>
                        </div>
                    </div>
                    <div className="min-h-32 p-4 overflow-auto">
                        {matches.length > 0 ? (
                            <div className="space-y-1">
                                {matches.map((match, i) => (
                                    <div key={i} className="text-sm font-mono text-yellow-200">
                                        #{i + 1}: {match}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-white/30">Eşleşme bulunamadı</div>
                        )}
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