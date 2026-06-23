"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { minifyJSON, formatJSON } from "@/lib/json"

const SAMPLE = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": true,
    "roller": ["admin", "editor"]
  }
}`

// Highlight fonksiyonu - JSON renklendirme
function highlight(json: string): string {
  if (!json) return ""
  return json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
          /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g,
          (m: string) => {
            if (/^"/.test(m)) return `<span style="color:#a8d8a8">${m}</span>`
            if (/true|false/.test(m)) return `<span style="color:#c9a0dc">${m}</span>`
            if (/null/.test(m)) return `<span style="color:#ff8c69">${m}</span>`
            if (/[{}[\]]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
            if (/[,:]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
            return `<span style="color:#ffb347">${m}</span>`
          }
      )
}

type Status = { type: "idle" | "ok" | "error"; msg: string; meta?: string }

export default function JsonMinifier() {
  const [input, setInput] = useState<string>(SAMPLE)
  const [output, setOutput] = useState<string>("")
  const [status, setStatus] = useState<Status>({ type: "idle", msg: "JSON girin veya yapıştırın" })
  const [toast, setToast] = useState<string>("")
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isFirstRender = useRef(true)

  // Minify işlemi
  const processMinify = useCallback((val: string) => {
    if (!val.trim()) {
      setOutput("")
      setStatus({ type: "idle", msg: "JSON girin veya yapıştırın" })
      return
    }

    const r = minifyJSON(val)
    if (r.ok) {
      setOutput(highlight(r.output))
      const saved = val.length - r.output.length
      setStatus({
        type: "ok",
        msg: `Minify tamamlandı — ${saved} karakter kaldırıldı`,
        meta: `${r.output.length} karakter`
      })
    } else {
      setOutput("")
      setStatus({ type: "error", msg: r.error })
    }
  }, [])

  // Input değişikliği - debounce ile
  const onInput = useCallback((val: string) => {
    setInput(val)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => processMinify(val), 300)
  }, [processMinify])

  // İlk yükleme
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      processMinify(SAMPLE)
    }
  }, [processMinify])

  // Formatla (güzel görünüm için)
  const doFormat = () => {
    const r = formatJSON(input, 2)
    if (r.ok) {
      setInput(r.output)
      processMinify(r.output)
    } else {
      setStatus({ type: "error", msg: r.error })
    }
  }

  // Temizle
  const doClear = () => {
    setInput("")
    setOutput("")
    setStatus({ type: "idle", msg: "JSON girin veya yapıştırın" })
  }

  // Örnek yükle
  const doLoadSample = () => {
    setInput(SAMPLE)
    processMinify(SAMPLE)
  }

  // Toast
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2000)
  }

  // Kopyala
  const copyOutput = () => {
    const text = document.getElementById("minify-output")?.innerText ?? ""
    if (!text) {
      showToast("Kopyalanacak çıktı yok")
      return
    }
    navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
  }

  // İndir
  const downloadOutput = () => {
    const text = document.getElementById("minify-output")?.innerText ?? ""
    if (!text) {
      showToast("İndirilecek çıktı yok")
      return
    }
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }))
    a.download = "minified.json"
    a.click()
    showToast("İndiriliyor…")
  }

  // Yapıştır
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      processMinify(text)
    } catch {
      showToast("Pano okunamadı")
    }
  }

  // Status renkleri
  const dotColor = status.type === "ok" ? "bg-emerald-400" : status.type === "error" ? "bg-red-400" : "bg-white/20"
  const msgColor = status.type === "ok" ? "text-emerald-400" : status.type === "error" ? "text-red-400" : "text-white/40"

  // Minify istatistikleri
  const originalSize = input.length
  const minifiedSize = output ? output.replace(/<[^>]*>/g, "").length : 0
  const savedPercent = originalSize > 0 && minifiedSize > 0
      ? Math.round(((originalSize - minifiedSize) / originalSize) * 100)
      : 0

  return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
              onClick={() => processMinify(input)}
              className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Minify
          </button>
          <button
              onClick={doFormat}
              className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors"
          >
            Formatla
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
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs font-mono min-h-5">
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          <span className={msgColor}>{status.msg}</span>
          {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
        </div>

        {/* Stats */}
        {originalSize > 0 && minifiedSize > 0 && (
            <div className="flex items-center gap-4 text-xs font-mono text-white/40">
              <span>Orijinal: <span className="text-white">{originalSize} karakter</span></span>
              <span>Minified: <span className="text-white">{minifiedSize} karakter</span></span>
              {savedPercent > 0 && (
                  <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              %{savedPercent} küçültüldü
            </span>
              )}
            </div>
        )}

        {/* Editor panes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Input */}
          <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
              <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Giriş</span>
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
                className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
              <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Minified</span>
              <div className="flex gap-1">
                <button onClick={copyOutput} className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">Kopyala</button>
                <button onClick={downloadOutput} className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">İndir</button>
              </div>
            </div>
            <div
                id="minify-output"
                className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre select-text"
                dangerouslySetInnerHTML={{ __html: output }}
            />
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