"use client"

import { useState, useCallback, useRef } from "react"
import { formatJSON, minifyJSON, sortKeysJSON } from "@/lib/json"

const SAMPLE = `{
  "kullanici": {
    "id": 1,
    "ad": "Ahmet Yılmaz",
    "email": "ahmet@ornek.com",
    "aktif": true,
    "roller": ["admin", "editor"],
    "adres": { "sehir": "İstanbul", "posta": "34000" }
  },
  "toplam": 42,
  "zaman_damgasi": null
}`

function highlight(json: string): string {
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g,
      (m) => {
        if (/^"/.test(m)) return /:$/.test(m) ? `<span style="color:#7cb9e8">${m}</span>` : `<span style="color:#a8d8a8">${m}</span>`
        if (/true|false/.test(m)) return `<span style="color:#c9a0dc">${m}</span>`
        if (/null/.test(m)) return `<span style="color:#ff8c69">${m}</span>`
        if (/[{}[\]]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
        if (/[,:]/.test(m)) return `<span style="color:#8890a8">${m}</span>`
        return `<span style="color:#ffb347">${m}</span>`
      }
    )
}

type Status = { type: "idle" | "ok" | "error"; msg: string; meta?: string }

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState(() => {
    const r = formatJSON(SAMPLE, 2)
    return r.ok ? highlight(r.output) : ""
  })
  const [indent, setIndent] = useState<string>("2")
  const [status, setStatus] = useState<Status>({ type: "ok", msg: "Geçerli JSON", meta: "7 anahtar · 0.2 KB" })
  const [toast, setToast] = useState("")
const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const getIndent = () => (indent === "tab" ? "\t" : parseInt(indent))

  const applyResult = (raw: string, ind = getIndent()) => {
    const r = formatJSON(raw, ind)
    if (r.ok) {
      setOutput(highlight(r.output))
      setStatus({ type: "ok", msg: "Geçerli JSON", meta: `${r.keyCount} anahtar · ${(r.byteSize / 1024).toFixed(1)} KB` })
    } else {
      setOutput("")
      setStatus({ type: "error", msg: r.error })
    }
  }

  const onInput = useCallback((val: string) => {
    setInput(val)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => applyResult(val), 300)
  }, [indent])

  const doMinify = () => {
    const r = minifyJSON(input)
    if (r.ok) {
      setOutput(highlight(r.output))
      const saved = input.length - r.output.length
      setStatus({ type: "ok", msg: `Minify tamamlandı — ${saved} karakter kaldırıldı`, meta: `${r.output.length} karakter` })
    } else setStatus({ type: "error", msg: r.error })
  }

  const doSort = () => {
    const r = sortKeysJSON(input, getIndent())
    if (r.ok) {
      setInput(r.output)
      setOutput(highlight(r.output))
      setStatus({ type: "ok", msg: "Anahtarlar alfabetik sıralandı" })
    } else setStatus({ type: "error", msg: r.error })
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2000)
  }

  const copyOutput = () => {
    const text = document.getElementById("json-output")?.innerText ?? ""
    if (!text) return
    navigator.clipboard.writeText(text).then(() => showToast("Kopyalandı ✓"))
  }

  const downloadOutput = () => {
    const text = document.getElementById("json-output")?.innerText ?? ""
    if (!text) return
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }))
    a.download = "formatted.json"
    a.click()
    showToast("İndiriliyor…")
  }

  const dotColor = status.type === "ok" ? "bg-emerald-400" : status.type === "error" ? "bg-red-400" : "bg-white/20"
  const msgColor = status.type === "ok" ? "text-emerald-400" : status.type === "error" ? "text-red-400" : "text-white/40"

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => applyResult(input)} className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">
          Formatla
        </button>
        <button onClick={doMinify} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Minify
        </button>
        <button onClick={doSort} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Anahtarları sırala
        </button>
        <div className="w-px h-5 bg-white/10" />
        <select
          value={indent}
          onChange={(e) => { setIndent(e.target.value); applyResult(input, e.target.value === "tab" ? "\t" : parseInt(e.target.value)) }}
          className="h-8 px-3 bg-white/5 border border-white/10 text-sm text-white rounded-lg outline-none"
        >
          <option value="2">2 boşluk</option>
          <option value="4">4 boşluk</option>
          <option value="tab">Tab</option>
        </select>
        <div className="w-px h-5 bg-white/10" />
        <button onClick={() => { setInput(""); setOutput(""); setStatus({ type: "idle", msg: "JSON girin veya yapıştırın" }) }}
          className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Temizle
        </button>
        <button onClick={() => { setInput(SAMPLE); applyResult(SAMPLE) }}
          className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Örnek yükle
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs font-mono min-h-5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={msgColor}>{status.msg}</span>
        {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
      </div>

      {/* Editor panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {/* Input */}
        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8 shrink-0">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Giriş</span>
            <button onClick={async () => { const t = await navigator.clipboard.readText(); setInput(t); applyResult(t) }}
              className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">
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
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Çıktı</span>
            <div className="flex gap-1">
              <button onClick={copyOutput} className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">Kopyala</button>
              <button onClick={downloadOutput} className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">İndir</button>
            </div>
          </div>
          <div
            id="json-output"
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
    </>
  )
}