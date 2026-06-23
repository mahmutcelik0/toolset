"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { diff, type Diff } from "deep-diff"

const SAMPLE_LEFT = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": true,
    "roller": ["admin", "editor"]
  },
  "toplam": 42
}`

const SAMPLE_RIGHT = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": false,
    "roller": ["admin", "viewer", "editor"],
    "telefon": "+905551234567"
  },
  "toplam": 42,
  "son_giris": "2026-01-01"
}`

type Status = {
    type: "idle" | "ok" | "error"
    msg: string
    meta?: string
}

interface DiffStats {
    added: number
    removed: number
    changed: number
    total: number
}

// Deep-Diff tipleri
type DiffKind = 'N' | 'D' | 'E' | 'A'

interface DiffItem {
    kind: DiffKind
    path?: (string | number)[]
    lhs?: unknown
    rhs?: unknown
    item?: DiffItem
    index?: number
}

// Diff sonucunu güvenli bir şekilde dönüştür
function convertDiff(d: Diff<unknown, unknown>): DiffItem {
    const result: DiffItem = {
        kind: d.kind as DiffKind,
        path: d.path
    }

    // Her diff tipine göre farklı özellikleri kontrol et
    if ('lhs' in d) {
        result.lhs = d.lhs
    }
    if ('rhs' in d) {
        result.rhs = d.rhs
    }
    if ('item' in d && d.item) {
        result.item = convertDiff(d.item)
    }
    if ('index' in d) {
        result.index = d.index
    }

    return result
}

export default function JsonDiffViewer() {
    const [left, setLeft] = useState<string>(SAMPLE_LEFT)
    const [right, setRight] = useState<string>(SAMPLE_RIGHT)
    const [diffResult, setDiffResult] = useState<DiffItem[]>([])
    const [stats, setStats] = useState<DiffStats>({ added: 0, removed: 0, changed: 0, total: 0 })
    const [status, setStatus] = useState<Status>({
        type: "idle",
        msg: "İki JSON girip Karşılaştır butonuna tıklayın"
    })
    const [toast, setToast] = useState<string>("")
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const isFirstRender = useRef(true)

    // Diff hesapla
    const computeDiff = useCallback((l: string, r: string) => {
        if (!l.trim() || !r.trim()) {
            setDiffResult([])
            setStats({ added: 0, removed: 0, changed: 0, total: 0 })
            setStatus({
                type: "idle",
                msg: "Her iki alana da JSON girin"
            })
            return
        }

        try {
            const leftObj = JSON.parse(l)
            const rightObj = JSON.parse(r)
            const diffs = diff(leftObj, rightObj) || []

            // Diff sonuçlarını güvenli bir şekilde dönüştür
            const typedDiffs: DiffItem[] = diffs.map((d: Diff<unknown, unknown>) => convertDiff(d))

            setDiffResult(typedDiffs)

            // İstatistikleri hesapla
            let added = 0, removed = 0, changed = 0
            typedDiffs.forEach((d) => {
                if (d.kind === 'N') added++
                else if (d.kind === 'D') removed++
                else if (d.kind === 'E') changed++
                else if (d.kind === 'A' && d.item) {
                    if (d.item.kind === 'N') added++
                    else if (d.item.kind === 'D') removed++
                    else if (d.item.kind === 'E') changed++
                }
            })

            setStats({ added, removed, changed, total: typedDiffs.length })

            if (typedDiffs.length === 0) {
                setStatus({
                    type: "ok",
                    msg: "✅ JSON'lar birebir aynı"
                })
            } else {
                setStatus({
                    type: "ok",
                    msg: `✅ ${typedDiffs.length} fark bulundu`,
                    meta: `+${added} eklendi, -${removed} çıkarıldı, ~${changed} değişti`
                })
            }
        } catch (e) {
            const error = e as Error
            setDiffResult([])
            setStats({ added: 0, removed: 0, changed: 0, total: 0 })
            setStatus({
                type: "error",
                msg: `❌ Geçersiz JSON: ${error.message}`
            })
        }
    }, [])

    // Sol input değişikliği
    const onLeftChange = useCallback((val: string) => {
        setLeft(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => computeDiff(val, right), 300)
    }, [right, computeDiff])

    // Sağ input değişikliği
    const onRightChange = useCallback((val: string) => {
        setRight(val)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => computeDiff(left, val), 300)
    }, [left, computeDiff])

    // İlk yükleme
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            computeDiff(SAMPLE_LEFT, SAMPLE_RIGHT)
        }
    }, [computeDiff])

    // Temizle
    const doClear = () => {
        setLeft("")
        setRight("")
        setDiffResult([])
        setStats({ added: 0, removed: 0, changed: 0, total: 0 })
        setStatus({
            type: "idle",
            msg: "Her iki alana da JSON girin"
        })
    }

    // Örnek yükle
    const doLoadSample = () => {
        setLeft(SAMPLE_LEFT)
        setRight(SAMPLE_RIGHT)
        computeDiff(SAMPLE_LEFT, SAMPLE_RIGHT)
    }

    // Yer değiştir
    const doSwap = () => {
        const temp = left
        setLeft(right)
        setRight(temp)
        computeDiff(right, temp)
    }

    // Toast
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    // Kopyala
    const copyDiff = () => {
        if (diffResult.length === 0) {
            showToast("Kopyalanacak fark yok")
            return
        }
        const text = JSON.stringify(diffResult, null, 2)
        navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
    }

    // Yapıştır - Sol
    const handlePasteLeft = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setLeft(text)
            computeDiff(text, right)
        } catch {
            showToast("Pano okunamadı")
        }
    }

    // Yapıştır - Sağ
    const handlePasteRight = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setRight(text)
            computeDiff(left, text)
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

    // Diff içeriğini güvenli şekilde göster
    const getDiffContent = (d: DiffItem): string => {
        if (d.kind === 'N') {
            return `+ ${JSON.stringify(d.rhs)}`
        } else if (d.kind === 'D') {
            return `- ${JSON.stringify(d.lhs)}`
        } else if (d.kind === 'E') {
            return `${JSON.stringify(d.lhs)} → ${JSON.stringify(d.rhs)}`
        } else if (d.kind === 'A' && d.item) {
            const itemContent = d.item.kind === 'N'
                ? `+ ${JSON.stringify(d.item.rhs)}`
                : d.item.kind === 'D'
                    ? `- ${JSON.stringify(d.item.lhs)}`
                    : d.item.kind === 'E'
                        ? `${JSON.stringify(d.item.lhs)} → ${JSON.stringify(d.item.rhs)}`
                        : 'Bilinmeyen değişiklik'
            return `Dizi [${d.index ?? '?'}]: ${itemContent}`
        }
        return 'Bilinmeyen değişiklik'
    }

    // Diff sonuçlarını render et
    const renderDiff = () => {
        if (diffResult.length === 0) {
            return <div className="text-white/40 text-center py-8">Fark bulunamadı veya geçersiz JSON</div>
        }

        return (
            <div className="space-y-2">
                {diffResult.map((d: DiffItem, i: number) => {
                    let color: string, label: string, icon: string
                    const path = d.path ? d.path.join('.') : 'root'

                    if (d.kind === 'N') {
                        color = 'bg-emerald-500/20 border-emerald-500/30'
                        label = 'Eklendi'
                        icon = '➕'
                    } else if (d.kind === 'D') {
                        color = 'bg-red-500/20 border-red-500/30'
                        label = 'Çıkarıldı'
                        icon = '➖'
                    } else if (d.kind === 'E') {
                        color = 'bg-yellow-500/20 border-yellow-500/30'
                        label = 'Değişti'
                        icon = '✏️'
                    } else if (d.kind === 'A') {
                        color = 'bg-blue-500/20 border-blue-500/30'
                        label = 'Dizi Değişikliği'
                        icon = '📋'
                    } else {
                        color = 'bg-white/5 border-white/10'
                        label = 'Bilinmeyen'
                        icon = '❓'
                    }

                    const content = getDiffContent(d)

                    return (
                        <div key={i} className={`p-3 rounded-lg border ${color} text-sm font-mono`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs">{icon}</span>
                                <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
                                <span className="text-white/30">→</span>
                                <span className="text-white/70">{path}</span>
                            </div>
                            <div className="text-white/90 break-all">
                                {content}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => computeDiff(left, right)}
                    className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Karşılaştır
                </button>
                <button
                    onClick={doSwap}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    ↔ Yer Değiştir
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
                    onClick={copyDiff}
                    className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
                >
                    Farkı Kopyala
                </button>
            </div>

            {/* Status & Stats */}
            <div className="flex items-center gap-2 text-xs font-mono min-h-5">
                <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
                <span className={getMsgColor()}>{status.msg}</span>
                {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
            </div>

            {/* Stats */}
            {diffResult.length > 0 && (
                <div className="flex gap-4 text-xs font-mono bg-[#1a1d27] p-3 rounded-lg border border-white/5">
                    <span className="text-emerald-400">+{stats.added} eklendi</span>
                    <span className="text-red-400">-{stats.removed} çıkarıldı</span>
                    <span className="text-yellow-400">~{stats.changed} değişti</span>
                    <span className="text-white/40">Toplam: {stats.total} fark</span>
                </div>
            )}

            {/* Editor panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Left (Orijinal)</span>
                        <button
                            onClick={handlePasteLeft}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Yapıştır
                        </button>
                    </div>
                    <textarea
                        value={left}
                        onChange={(e) => onLeftChange(e.target.value)}
                        placeholder='{ "key": "value" }'
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>

                {/* Right */}
                <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
                        <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Right (Değiştirilmiş)</span>
                        <button
                            onClick={handlePasteRight}
                            className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
                        >
                            Yapıştır
                        </button>
                    </div>
                    <textarea
                        value={right}
                        onChange={(e) => onRightChange(e.target.value)}
                        placeholder='{ "key": "value" }'
                        spellCheck={false}
                        className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Diff Results */}
            <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
                    <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Farklar</span>
                    <span className="text-xs text-white/30">{diffResult.length} fark</span>
                </div>
                <div className="p-4 max-h-96 overflow-auto">
                    {renderDiff()}
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